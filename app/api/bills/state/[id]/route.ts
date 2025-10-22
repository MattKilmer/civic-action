import { NextRequest, NextResponse } from "next/server";
import { getStateBill } from "@/app/lib/legiscan";

export const runtime = "edge";

/**
 * Get full state bill details by LegiScan bill_id
 * GET /api/bills/state/[id]
 *
 * This endpoint fetches the complete bill details including summary/description
 * Used when user selects a bill or clicks "View Summary"
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const billId = parseInt(params.id, 10);

  // Validate bill ID
  if (isNaN(billId)) {
    return NextResponse.json(
      { error: "Invalid bill ID" },
      { status: 400 }
    );
  }

  try {
    const result = await getStateBill({ billId });

    if (result.error) {
      const status = result.error.includes("Rate limit") ? 429
                   : result.error.includes("not configured") ? 503
                   : result.error.includes("not found") ? 404
                   : 502; // Bad Gateway for LegiScan API errors

      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    if (!result.bill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      bill: result.bill,
    });
  } catch (error) {
    console.error("State bill detail fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
