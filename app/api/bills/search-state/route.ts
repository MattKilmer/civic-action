import { NextRequest, NextResponse } from "next/server";
import { searchStateBills } from "@/app/lib/legiscan";
import { rateLimit } from "@/app/lib/rateLimit";

export const runtime = "edge";

/**
 * State bill search endpoint using LegiScan API
 * GET /api/bills/search-state?q=education&jurisdiction=California
 */
export async function GET(req: NextRequest) {
  // Rate limiting: 15 requests per minute (same as federal bill search)
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
  const rateLimitResult = rateLimit(`state-bill-search:${ip}`, 15, 60);

  if (!rateLimitResult.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // Get query parameters
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  const jurisdiction = searchParams.get("jurisdiction"); // Optional: filter by state
  const page = searchParams.get("page"); // Optional: page number for pagination

  // Validate query
  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    // Search state bills
    const result = await searchStateBills({
      query: query.trim(),
      jurisdiction: jurisdiction || undefined,
      page: page ? parseInt(page, 10) : undefined,
      perPage: 20,
    });

    if (result.error) {
      // Return appropriate status code based on error type
      const status = result.error.includes("Rate limit") ? 429
                   : result.error.includes("not configured") ? 503
                   : 502; // Bad Gateway for LegiScan API errors

      console.error("State bill search failed:", result.error);
      return NextResponse.json(
        { error: result.error, bills: [] },
        { status }
      );
    }

    return NextResponse.json({
      bills: result.bills,
      count: result.bills.length,        // Bills on current page
      totalCount: result.totalCount,     // Total bills across all pages
      currentPage: result.currentPage,   // Current page number
      totalPages: result.totalPages,     // Total pages available
    });
  } catch (error) {
    console.error("State bill search error:", error);
    return NextResponse.json(
      { error: "Internal server error", bills: [] },
      { status: 500 }
    );
  }
}
