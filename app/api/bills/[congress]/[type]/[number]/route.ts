import { NextRequest } from 'next/server';

export const runtime = 'edge';

interface BillSummary {
  text: string;
  versionCode: string;
  actionDate: string;
  updateDate: string;
}

interface BillDetails {
  number: string;
  title: string;
  type: string;
  congress: number;
  summary: string | null;
  latestAction?: {
    text: string;
    actionDate: string;
  };
}

/**
 * Clean HTML tags and decode HTML entities from bill summary text
 */
function cleanSummaryHtml(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };

  Object.entries(entities).forEach(([entity, char]) => {
    text = text.replace(new RegExp(entity, 'g'), char);
  });

  // Remove extra whitespace and normalize line breaks
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * GET /api/bills/{congress}/{type}/{number}
 *
 * Fetches detailed bill information including summary from Congress.gov API.
 * This provides much better context for AI email generation.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { congress: string; type: string; number: string } }
) {
  const { congress, type, number } = params;
  const apiKey = process.env.CONGRESS_API_KEY;

  if (!apiKey) {
    console.warn('CONGRESS_API_KEY not set - bill details unavailable');
    return Response.json({ error: 'API key not configured' }, { status: 503 });
  }

  try {
    // Fetch bill details
    const billUrl = `https://api.congress.gov/v3/bill/${congress}/${type}/${number}?format=json`;
    const billRes = await fetch(billUrl, {
      headers: { 'X-Api-Key': apiKey },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!billRes.ok) {
      console.error('Congress API bill error:', billRes.status);
      return Response.json({ error: 'Bill not found' }, { status: billRes.status });
    }

    const billData = await billRes.json();
    const bill = billData.bill;

    // Fetch bill summaries (these provide the best context)
    const summariesUrl = `https://api.congress.gov/v3/bill/${congress}/${type}/${number}/summaries?format=json`;
    const summariesRes = await fetch(summariesUrl, {
      headers: { 'X-Api-Key': apiKey },
      next: { revalidate: 3600 },
    });

    let summary: string | null = null;
    if (summariesRes.ok) {
      const summariesData = await summariesRes.json();
      // Get the most recent summary (usually the most comprehensive)
      const summaries: BillSummary[] = summariesData.summaries || [];
      if (summaries.length > 0) {
        // Sort by updateDate to get the most recent summary
        summaries.sort((a, b) =>
          new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
        );
        // Clean HTML tags and entities from the summary
        summary = cleanSummaryHtml(summaries[0].text);
      }
    }

    const details: BillDetails = {
      number: `${bill.type} ${bill.number}`,
      title: bill.title,
      type: bill.type,
      congress: bill.congress,
      summary,
      latestAction: bill.latestAction,
    };

    return Response.json(details);

  } catch (error) {
    console.error('Bill details fetch error:', error);
    return Response.json({ error: 'Failed to fetch bill details' }, { status: 500 });
  }
}
