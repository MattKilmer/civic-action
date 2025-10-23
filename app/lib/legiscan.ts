/**
 * LegiScan API Client
 * Documentation: https://legiscan.com/gaits/documentation/legiscan
 * Provides access to state legislature bills across all 50 states
 */

const API_BASE = "https://api.legiscan.com";
const API_KEY = process.env.LEGISCAN_API_KEY;

// Rate limiting: Free tier = 30,000 req/month
// Setting to 100 req/min to allow for reasonable usage
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100;

// In-memory rate limiter
const requestTimestamps: number[] = [];

// Simple in-memory cache for search results (5 minute TTL)
interface CacheEntry {
  data: {
    bills: NormalizedStateBill[];
    totalCount?: number;
    currentPage?: number;
    totalPages?: number;
  };
  timestamp: number;
}
const searchCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(params: {
  query: string;
  jurisdiction?: string;
  page?: number;
  perPage?: number;
}): string {
  return JSON.stringify({
    q: params.query.toLowerCase().trim(),
    j: params.jurisdiction || '',
    p: params.page || 1,
    pp: params.perPage || 20,
  });
}

function getFromCache(key: string): {
  bills: NormalizedStateBill[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
} | null {
  const entry = searchCache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    searchCache.delete(key);
    return null;
  }

  return entry.data;
}

function setInCache(key: string, data: {
  bills: NormalizedStateBill[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}): void {
  searchCache.set(key, {
    data,
    timestamp: Date.now(),
  });

  // Clean up old entries (keep cache size reasonable)
  if (searchCache.size > 100) {
    const now = Date.now();
    searchCache.forEach((v, k) => {
      if (now - v.timestamp > CACHE_TTL) {
        searchCache.delete(k);
      }
    });
  }
}

function checkRateLimit(): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Remove old timestamps outside the window
  while (requestTimestamps.length > 0 && requestTimestamps[0] < windowStart) {
    requestTimestamps.shift();
  }

  // Check if we're under the limit
  if (requestTimestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }

  // Add current request
  requestTimestamps.push(now);
  return true;
}

/**
 * LegiScan Search Result Types
 */
export interface LegiScanSearchResult {
  relevance: number;
  state: string; // Two-letter abbreviation
  bill_number: string; // e.g., "S03376", "A03420"
  bill_id: number;
  change_hash: string;
  url: string;
  text_url: string;
  research_url: string;
  last_action_date: string; // YYYY-MM-DD
  last_action: string;
  title: string;
}

export interface LegiScanSearchResponse {
  status: string; // "OK" or "ERROR"
  searchresult: {
    summary: {
      page: string;
      range: string;
      relevancy: string;
      count: number;
      page_current: number;
      page_total: number;
      query: string;
    };
    [key: string]: LegiScanSearchResult | any; // Results are keyed "0", "1", "2", etc.
  };
}

/**
 * LegiScan Bill Detail Types
 */
export interface LegiScanBill {
  bill_id: number;
  bill_number: string;
  title: string;
  description: string;
  session: {
    session_id: number;
    state_id: number;
    year_start: number;
    year_end: number;
    session_title: string; // e.g., "2025-2026 Regular Session"
    session_name: string;
  };
  sponsors: Array<{
    people_id: number;
    name: string;
    party: string; // "R", "D", "I"
    role: string; // "Sen", "Rep"
    sponsor_type_id: number; // 1 = primary, 2 = co-sponsor
  }>;
  history: Array<{
    date: string; // YYYY-MM-DD
    action: string;
    chamber: string; // "S" or "H"
    importance: number;
  }>;
  url: string;
}

export interface LegiScanBillResponse {
  status: string; // "OK" or "ERROR"
  bill: LegiScanBill;
}

/**
 * Normalized bill format matching our existing format
 */
export interface NormalizedStateBill {
  bill: string; // e.g., "NY S 3376"
  bill_id?: number; // LegiScan bill_id for fetching full details
  title: string;
  summary?: string;
  level: "state";
  jurisdiction: string; // Full state name, e.g., "New York"
  session: string; // e.g., "2025-2026"
  chamber: "state-house" | "state-senate";
  introduced?: string;
  latestAction?: string;
  latestActionDate?: string; // Date of latest action (YYYY-MM-DD from LegiScan)
  sponsors?: string[];
  url?: string;
}

/**
 * Search for state bills in a specific jurisdiction
 */
export async function searchStateBills(params: {
  query: string;
  jurisdiction?: string; // Full state name (will be converted to abbreviation)
  page?: number;
  perPage?: number;
}): Promise<{
  bills: NormalizedStateBill[];
  totalCount?: number;      // Total number of bills across all pages
  currentPage?: number;     // Current page number
  totalPages?: number;      // Total number of pages
  error?: string;
}> {
  // Check API key
  if (!API_KEY) {
    console.warn("LEGISCAN_API_KEY not configured");
    return { bills: [], error: "State bill search unavailable (API key not configured)" };
  }

  // Check cache first
  const cacheKey = getCacheKey(params);
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log(`[legiscan] Cache hit for: ${params.query}`);
    return cached;
  }

  // Check rate limit
  if (!checkRateLimit()) {
    return { bills: [], error: "Rate limit exceeded. Please try again in a moment." };
  }

  try {
    // Convert jurisdiction (full state name) to state abbreviation
    const stateAbbr = params.jurisdiction ? getStateAbbreviation(params.jurisdiction) : undefined;

    // Build API URL
    const searchParams = new URLSearchParams();
    searchParams.set("key", API_KEY);
    searchParams.set("op", "getSearch");
    searchParams.set("query", params.query);

    if (stateAbbr) {
      searchParams.set("state", stateAbbr);
    }

    // Note: LegiScan returns 50 results per page by default
    // We'll just take the first page and limit client-side
    if (params.page && params.page > 1) {
      searchParams.set("page", String(params.page));
    }

    const url = `${API_BASE}/?${searchParams.toString()}`;

    console.log(`[legiscan] Searching: ${params.query} in ${stateAbbr || 'all states'}`);

    // LegiScan is generally fast, but add timeout to be safe
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("LegiScan API error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url,
        });
        return {
          bills: [],
          error: `State bill search failed (${response.status}: ${response.statusText})`
        };
      }

      const data: LegiScanSearchResponse = await response.json();

      if (data.status !== "OK") {
        console.error("LegiScan API returned error status:", data);
        return { bills: [], error: "State bill search failed" };
      }

      // Extract search results (they're keyed as "0", "1", "2", etc.)
      const results: LegiScanSearchResult[] = [];
      const summary = data.searchresult.summary;

      // Results are numbered from 0 to (count - 1)
      for (let i = 0; i < summary.count && i < 50; i++) {
        const result = data.searchresult[String(i)];
        if (result && typeof result === 'object' && 'bill_number' in result) {
          results.push(result as LegiScanSearchResult);
        }
      }

      console.log(`[legiscan] Found ${results.length} bills`);

      // Normalize to our format
      const bills: NormalizedStateBill[] = results
        .map(mapLegiScanResultToNormalized)
        .filter((bill): bill is NormalizedStateBill => bill !== null)
        .slice(0, params.perPage || 20); // Limit to requested perPage

      // Calculate total count from pagination info
      // If only 1 page, use actual count. If multiple pages, estimate from page_total
      const estimatedTotalCount = summary.page_total === 1
        ? summary.count  // Single page: use actual count
        : summary.page_total * 50;  // Multiple pages: estimate (LegiScan returns ~50/page)

      // Cache the result with pagination info
      const result = {
        bills,
        totalCount: estimatedTotalCount,
        currentPage: summary.page_current,
        totalPages: summary.page_total,
      };
      setInCache(cacheKey, result);

      return result;
    } catch (fetchError) {
      clearTimeout(timeoutId);

      // If it's an AbortError (timeout), return friendly message
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("LegiScan API request timed out:", fetchError);
        return {
          bills: [],
          error: "Search timed out. Please try again in a moment."
        };
      }

      // For other errors, throw
      throw fetchError;
    }
  } catch (error) {
    console.error("LegiScan API request failed:", error);
    return { bills: [], error: "State bill search failed" };
  }
}

/**
 * Get a specific bill by bill_id
 */
export async function getStateBill(params: {
  billId: number;
}): Promise<{ bill: NormalizedStateBill | null; error?: string }> {
  if (!API_KEY) {
    return { bill: null, error: "State bill lookup unavailable (API key not configured)" };
  }

  if (!checkRateLimit()) {
    return { bill: null, error: "Rate limit exceeded" };
  }

  try {
    const searchParams = new URLSearchParams();
    searchParams.set("key", API_KEY);
    searchParams.set("op", "getBill");
    searchParams.set("id", String(params.billId));

    const url = `${API_BASE}/?${searchParams.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return { bill: null, error: `Bill not found (${response.status})` };
      }

      const data: LegiScanBillResponse = await response.json();

      if (data.status !== "OK" || !data.bill) {
        return { bill: null, error: "Bill not found" };
      }

      const bill = mapLegiScanBillToNormalized(data.bill);

      if (!bill) {
        return { bill: null, error: "Bill data incomplete" };
      }

      return { bill };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error("LegiScan API request failed:", error);

    if (error instanceof Error && error.name === 'AbortError') {
      return { bill: null, error: "Request timeout" };
    }

    return { bill: null, error: "Bill lookup failed" };
  }
}

/**
 * Format bill number to match OpenStates style (space after prefix, no leading zeros)
 * Examples:
 *   "A06101" → "A 6101"
 *   "S00606" → "S 606"
 *   "AB123" → "AB 123"
 *   "HB0001" → "HB 1"
 */
function formatBillNumber(billNumber: string): string {
  // Match letter prefix and numeric part
  const match = billNumber.match(/^([A-Z]+)(\d+)$/);

  if (!match) {
    // If doesn't match expected pattern, return as-is
    return billNumber;
  }

  const prefix = match[1]; // e.g., "A", "S", "AB", "HB"
  const number = parseInt(match[2], 10); // Remove leading zeros by parsing as int

  return `${prefix} ${number}`;
}

/**
 * Map LegiScan search result to our normalized format
 */
function mapLegiScanResultToNormalized(result: LegiScanSearchResult): NormalizedStateBill | null {
  if (!result.state || !result.bill_number) {
    console.warn("LegiScan result missing required fields:", result);
    return null;
  }

  const jurisdiction = getStateName(result.state);
  if (!jurisdiction) {
    console.warn("Unknown state abbreviation:", result.state);
    return null;
  }

  // Determine chamber from bill number prefix
  // Senate bills: S, SB, SR, SJ, etc.
  // House/Assembly bills: H, HB, HR, HJ, A, AB, etc.
  const chamber = result.bill_number.match(/^[SA]/i)
    ? (result.bill_number.match(/^S/i) ? "state-senate" : "state-house")
    : "state-house";

  // Extract session from last_action_date (year)
  const year = result.last_action_date ? new Date(result.last_action_date).getFullYear() : new Date().getFullYear();
  const session = year % 2 === 0 ? `${year - 1}-${year}` : `${year}-${year + 1}`;

  return {
    bill: `${result.state} ${formatBillNumber(result.bill_number)}`,
    bill_id: result.bill_id, // Store bill_id for fetching full details later
    title: result.title,
    summary: undefined, // Search results don't include summary (need getBill for that)
    level: "state",
    jurisdiction,
    session,
    chamber,
    introduced: undefined, // Not available in search results
    latestAction: result.last_action || undefined,
    latestActionDate: result.last_action_date || undefined, // Date of latest action
    sponsors: undefined, // Not available in search results
    url: result.url,
  };
}

/**
 * Map LegiScan full bill to our normalized format
 */
function mapLegiScanBillToNormalized(bill: LegiScanBill): NormalizedStateBill | null {
  if (!bill.bill_number || !bill.session) {
    console.warn("LegiScan bill missing required fields:", bill.bill_id);
    return null;
  }

  // Get state abbreviation from session.state_id (need to map state_id to abbreviation)
  // For now, extract from bill URL: https://legiscan.com/NY/bill/S03376/2025
  const stateMatch = bill.url.match(/legiscan\.com\/([A-Z]{2})\//);
  const stateAbbr = stateMatch ? stateMatch[1] : null;

  if (!stateAbbr) {
    console.warn("Could not determine state from bill URL:", bill.url);
    return null;
  }

  const jurisdiction = getStateName(stateAbbr);
  if (!jurisdiction) {
    console.warn("Unknown state abbreviation:", stateAbbr);
    return null;
  }

  // Determine chamber from bill number prefix
  const chamber = bill.bill_number.match(/^[SA]/i)
    ? (bill.bill_number.match(/^S/i) ? "state-senate" : "state-house")
    : "state-house";

  // Session format: "2025-2026"
  const session = `${bill.session.year_start}-${bill.session.year_end}`;

  // Get first action date (introduced date)
  const introduced = bill.history.length > 0
    ? bill.history[bill.history.length - 1].date
    : undefined;

  // Get latest action
  const latestAction = bill.history.length > 0
    ? bill.history[0].action
    : undefined;

  // Get primary sponsors
  const sponsors = bill.sponsors
    .filter(s => s.sponsor_type_id === 1) // Primary sponsors only
    .map(s => s.name);

  return {
    bill: `${stateAbbr} ${formatBillNumber(bill.bill_number)}`,
    title: bill.title,
    summary: bill.description || undefined,
    level: "state",
    jurisdiction,
    session,
    chamber,
    introduced,
    latestAction,
    sponsors,
    url: bill.url,
  };
}

/**
 * Get state abbreviation from full state name
 */
function getStateAbbreviation(stateName: string): string {
  const stateMap: Record<string, string> = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
    "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
    "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
    "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
    "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
    "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
    "Wisconsin": "WI", "Wyoming": "WY", "District of Columbia": "DC", "Puerto Rico": "PR"
  };

  return stateMap[stateName] || stateName.substring(0, 2).toUpperCase();
}

/**
 * Get full state name from abbreviation
 */
export function getStateName(abbreviation: string): string | null {
  const stateMap: Record<string, string> = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas",
    "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
    "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho",
    "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas",
    "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
    "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi",
    "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
    "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
    "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma",
    "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
    "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah",
    "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia",
    "WI": "Wisconsin", "WY": "Wyoming", "DC": "District of Columbia", "PR": "Puerto Rico"
  };

  return stateMap[abbreviation.toUpperCase()] || null;
}
