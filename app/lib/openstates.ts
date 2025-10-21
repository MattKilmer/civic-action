/**
 * Open States API v3 Client
 * Documentation: https://docs.openstates.org/api-v3/
 * Provides access to state legislature bills, legislators, and voting data
 */

const API_BASE = "https://v3.openstates.org";
const API_KEY = process.env.OPENSTATES_API_KEY;

// Rate limiting: Free tier = 500 req/day, 10 req/min
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10;

// In-memory rate limiter (same pattern as our existing rate limiter)
const requestTimestamps: number[] = [];

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
 * Open States Bill Response Types
 */
export interface OpenStatesBill {
  id: string;
  identifier: string; // e.g., "AB 123"
  title: string;
  classification: string[]; // e.g., ["bill"], ["resolution"]
  subject: string[];
  chamber: string; // "upper" (senate) or "lower" (house)
  legislative_session: {
    identifier: string; // e.g., "2023-2024"
    jurisdiction: {
      id: string;
      name: string; // e.g., "California"
      classification: string;
    };
  };
  abstracts?: Array<{
    abstract: string;
    note?: string;
  }>;
  sponsorships?: Array<{
    name: string;
    classification: string; // "primary", "cosponsor"
    entity_type: string; // "person", "organization"
  }>;
  created_at: string;
  updated_at: string;
  first_action_date: string | null;
  latest_action_date: string | null;
  latest_action_description: string | null;
}

export interface OpenStatesSearchResponse {
  results: OpenStatesBill[];
  pagination: {
    per_page: number;
    page: number;
    max_page: number;
    total_items: number;
  };
}

/**
 * Normalized bill format matching our existing Congress.gov format
 */
export interface NormalizedStateBill {
  bill: string; // e.g., "CA AB 123"
  title: string;
  summary?: string;
  level: "state";
  jurisdiction: string; // Full state name, e.g., "California"
  session: string; // e.g., "2023-2024"
  chamber: "state-house" | "state-senate";
  introduced?: string;
  latestAction?: string;
  sponsors?: string[];
}

/**
 * Search for state bills across all states or specific jurisdiction
 */
export async function searchStateBills(params: {
  query: string;
  jurisdiction?: string; // State name or abbreviation
  session?: string; // Legislative session, e.g., "2023-2024"
  page?: number;
  perPage?: number;
}): Promise<{ bills: NormalizedStateBill[]; error?: string }> {
  // Check API key
  if (!API_KEY) {
    console.warn("OPENSTATES_API_KEY not configured");
    return { bills: [], error: "State bill search unavailable (API key not configured)" };
  }

  // Check rate limit
  if (!checkRateLimit()) {
    return { bills: [], error: "Rate limit exceeded. Please try again in a moment." };
  }

  try {
    const searchParams = new URLSearchParams();
    searchParams.set("q", params.query);

    if (params.jurisdiction) {
      searchParams.set("jurisdiction", params.jurisdiction);
    }

    if (params.session) {
      searchParams.set("session", params.session);
    }

    searchParams.set("page", String(params.page || 1));
    searchParams.set("per_page", String(params.perPage || 20));

    // Include sponsorships and abstracts in response (append each separately)
    searchParams.append("include", "abstracts");
    searchParams.append("include", "sponsorships");

    const url = `${API_BASE}/bills?${searchParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "X-API-KEY": API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Open States API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url,
        apiKeyConfigured: !!API_KEY
      });
      return {
        bills: [],
        error: `State bill search failed (${response.status}: ${response.statusText})`
      };
    }

    const data: OpenStatesSearchResponse = await response.json();

    // Normalize to our format
    const bills: NormalizedStateBill[] = data.results.map(mapOpenStatesBillToNormalized);

    return { bills };
  } catch (error) {
    console.error("Open States API request failed:", error);
    return { bills: [], error: "State bill search failed" };
  }
}

/**
 * Get a specific bill by jurisdiction and identifier
 */
export async function getStateBill(params: {
  jurisdiction: string;
  session: string;
  identifier: string; // e.g., "AB 123"
}): Promise<{ bill: NormalizedStateBill | null; error?: string }> {
  if (!API_KEY) {
    return { bill: null, error: "State bill lookup unavailable (API key not configured)" };
  }

  if (!checkRateLimit()) {
    return { bill: null, error: "Rate limit exceeded" };
  }

  try {
    const searchParams = new URLSearchParams();
    searchParams.set("jurisdiction", params.jurisdiction);
    searchParams.set("session", params.session);
    searchParams.set("identifier", params.identifier);
    searchParams.append("include", "abstracts");
    searchParams.append("include", "sponsorships");

    const url = `${API_BASE}/bills?${searchParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "X-API-KEY": API_KEY,
      },
    });

    if (!response.ok) {
      return { bill: null, error: `Bill not found (${response.status})` };
    }

    const data: OpenStatesSearchResponse = await response.json();

    if (data.results.length === 0) {
      return { bill: null, error: "Bill not found" };
    }

    const bill = mapOpenStatesBillToNormalized(data.results[0]);

    return { bill };
  } catch (error) {
    console.error("Open States API request failed:", error);
    return { bill: null, error: "Bill lookup failed" };
  }
}

/**
 * Map Open States bill format to our normalized format
 */
function mapOpenStatesBillToNormalized(bill: OpenStatesBill): NormalizedStateBill {
  const jurisdiction = bill.legislative_session.jurisdiction.name;
  const stateAbbr = getStateAbbreviation(jurisdiction);

  return {
    bill: `${stateAbbr} ${bill.identifier}`,
    title: bill.title,
    summary: bill.abstracts?.[0]?.abstract,
    level: "state",
    jurisdiction,
    session: bill.legislative_session.identifier,
    chamber: bill.chamber === "upper" ? "state-senate" : "state-house",
    introduced: bill.first_action_date || undefined,
    latestAction: bill.latest_action_description || undefined,
    sponsors: bill.sponsorships
      ?.filter(s => s.entity_type === "person")
      .map(s => s.name),
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
