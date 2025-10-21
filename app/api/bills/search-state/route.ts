import { NextRequest, NextResponse } from "next/server";
import { searchStateBills } from "@/app/lib/openstates";
import { rateLimit } from "@/app/lib/rateLimit";

export const runtime = "edge";

/**
 * State bill search endpoint using Open States API
 * GET /api/bills/search-state?q=education&jurisdiction=California&session=2023-2024
 */
export async function GET(req: NextRequest) {
  // Rate limiting: 15 requests per minute (same as federal bill search)
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
  const rateLimitResult = rateLimit(`state-bill-search:${ip}`, 15, 60);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // Get query parameters
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  const jurisdiction = searchParams.get("jurisdiction"); // Optional: filter by state
  const session = searchParams.get("session"); // Optional: filter by legislative session

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
      session: session || undefined,
      perPage: 20,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error, bills: [] },
        { status: 503 }
      );
    }

    return NextResponse.json({
      bills: result.bills,
      count: result.bills.length,
    });
  } catch (error) {
    console.error("State bill search error:", error);
    return NextResponse.json(
      { error: "Internal server error", bills: [] },
      { status: 500 }
    );
  }
}
