import { NextRequest } from 'next/server';

export const runtime = 'edge';

interface CongressBill {
  number: string;
  title: string;
  type: string;
  congress: number;
  latestAction?: {
    text: string;
    actionDate: string;
  };
  updateDate: string;
}

interface CongressApiResponse {
  bills: CongressBill[];
}

interface BillSuggestion {
  number: string;
  title: string;
  titleShort: string;
  status: string;
  date: string;
  type: string;
  congress: number;
}

/**
 * GET /api/bills/search?q={query}&type={billType}&limit={limit}&sort={sort}
 *
 * Searches Congress.gov API for bills matching the query.
 * Returns simplified bill suggestions for autocomplete or bill explorer.
 *
 * Query params:
 * - q: Search query (bill number or title keywords)
 * - type: Bill type filter (hr, s, hjres, sjres, or 'all')
 * - limit: Number of results to return (default: 10 for autocomplete, 50 for explorer)
 * - sort: Sort order ('recent' or 'oldest', default: 'recent')
 */
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || '';
  const billTypeFilter = req.nextUrl.searchParams.get('type') || 'all';
  const limitParam = req.nextUrl.searchParams.get('limit') || '10';
  const sortParam = req.nextUrl.searchParams.get('sort') || 'recent';

  const limit = parseInt(limitParam, 10);
  const sortOrder = sortParam === 'oldest' ? 'updateDate asc' : 'updateDate desc';

  // For autocomplete, require at least 2 characters
  // For explorer (higher limits), allow showing all bills
  if (query.length < 2 && limit <= 10) {
    return Response.json([]);
  }

  const apiKey = process.env.CONGRESS_API_KEY;

  // If no API key, return empty (feature is optional)
  if (!apiKey) {
    console.warn('CONGRESS_API_KEY not set - bill search unavailable');
    return Response.json([]);
  }

  try {
    // Get current Congress number (118th Congress: 2023-2024)
    const currentCongress = 118;

    // Build API URL with optional bill type filter
    let apiPath = `https://api.congress.gov/v3/bill/${currentCongress}`;
    if (billTypeFilter !== 'all') {
      apiPath += `/${billTypeFilter}`;
    }

    // Fetch bills in a single batch to avoid timeouts
    // Limit to 250 bills max (Congress.gov API limit)
    // This is sufficient for most searches and keeps response time under 10s
    const batchSize = Math.min(limit * 2, 250); // Fetch 2x to allow for filtering

    const url = new URL(apiPath);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', batchSize.toString());
    url.searchParams.set('offset', '0');
    url.searchParams.set('sort', sortOrder);

    // Add 15 second timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let allBills: CongressBill[] = [];

    try {
      const res = await fetch(url.toString(), {
        headers: {
          'X-Api-Key': apiKey,
        },
        signal: controller.signal,
        // Cache responses for 1 hour to reduce API usage
        next: { revalidate: 3600 },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.error('Congress API error:', res.status, await res.text());
        return Response.json({ error: 'Failed to fetch bills from Congress.gov' }, { status: res.status });
      }

      const data = await res.json() as CongressApiResponse;
      allBills = data.bills;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('Congress API timeout after 15 seconds');
        return Response.json({ error: 'Request timed out - Congress.gov API is slow. Please try again.' }, { status: 504 });
      }
      throw error;
    }

    // Use combined results
    const data = { bills: allBills };

    // Filter bills by query (search in number and title)
    const queryLower = query.toLowerCase();
    const bills: BillSuggestion[] = data.bills
      .map((bill) => {
        // Combine type and number to create full bill number (e.g., "HR 6358", "S 3283")
        const fullNumber = `${bill.type} ${bill.number}`;
        return {
          ...bill,
          fullNumber,
        };
      })
      .filter((bill) => {
        // If no query, return all (for bill explorer)
        if (!query) return true;

        const fullNumber = bill.fullNumber.toLowerCase();
        const title = bill.title.toLowerCase();
        return fullNumber.includes(queryLower) || title.includes(queryLower);
      })
      .slice(0, limit) // Apply requested limit
      .map((bill) => ({
        number: bill.fullNumber,
        // Return full title for topic detection, truncate on display if needed
        title: bill.title,
        // Also provide truncated version for autocomplete display
        titleShort: bill.title.slice(0, 100) + (bill.title.length > 100 ? '...' : ''),
        status: bill.latestAction?.text || 'Introduced',
        date: bill.latestAction?.actionDate || bill.updateDate,
        type: bill.type.toLowerCase(),
        congress: bill.congress,
      }));

    return Response.json(bills);

  } catch (error) {
    console.error('Bills search error:', error);
    return Response.json([]);
  }
}
