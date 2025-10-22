import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Warmup cron job to prevent cold starts on state bill search
 * Runs every 5 minutes to keep the Edge function warm
 *
 * To enable:
 * 1. Deploy to Vercel
 * 2. Go to Project Settings → Cron Jobs
 * 3. Add cron: /api/cron/warmup with schedule (every 5 minutes)
 * 4. Or use vercel.json configuration (see vercel.json)
 */
export async function GET(req: NextRequest) {
  // Verify this is called by Vercel Cron (security)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Make a lightweight warmup request to state bill search
    // Use California and a simple query
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const warmupUrl = `${baseUrl}/api/bills/search-state?q=budget&jurisdiction=California`;

    const response = await fetch(warmupUrl, {
      headers: {
        "User-Agent": "Vercel-Cron-Warmup",
      },
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      warmupUrl,
      status: response.status,
      billsFound: data.bills?.length || 0,
    });
  } catch (error) {
    console.error("[Warmup] Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Warmup failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
