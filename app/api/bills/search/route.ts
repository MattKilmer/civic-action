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
  status: string;
  date: string;
}

/**
 * GET /api/bills/search?q={query}
 *
 * Searches Congress.gov API for bills matching the query.
 * Returns simplified bill suggestions for autocomplete.
 */
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || '';

  // Require at least 2 characters to search
  if (query.length < 2) {
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

    const url = new URL(`https://api.congress.gov/v3/bill/${currentCongress}`);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '100'); // Fetch more bills to increase match probability
    url.searchParams.set('sort', 'updateDate desc');

    const res = await fetch(url.toString(), {
      headers: {
        'X-Api-Key': apiKey,
      },
      // Cache responses for 1 hour to reduce API usage
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error('Congress API error:', res.status, await res.text());
      return Response.json([]);
    }

    const data = await res.json() as CongressApiResponse;

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
        const fullNumber = bill.fullNumber.toLowerCase();
        const title = bill.title.toLowerCase();
        return fullNumber.includes(queryLower) || title.includes(queryLower);
      })
      .slice(0, 10) // Limit to 10 suggestions
      .map((bill) => ({
        number: bill.fullNumber,
        title: bill.title.slice(0, 100) + (bill.title.length > 100 ? '...' : ''), // Truncate long titles
        status: bill.latestAction?.text || 'Introduced',
        date: bill.latestAction?.actionDate || bill.updateDate,
      }));

    return Response.json(bills);

  } catch (error) {
    console.error('Bills search error:', error);
    return Response.json([]);
  }
}
