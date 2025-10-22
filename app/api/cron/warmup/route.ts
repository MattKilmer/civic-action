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
    // Get the base URL from the request
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const warmupUrl = `${baseUrl}/api/bills/search-state?q=budget&jurisdiction=California`;

    console.log(`[Warmup] Calling: ${warmupUrl}`);

    const response = await fetch(warmupUrl, {
      headers: {
        "User-Agent": "Vercel-Cron-Warmup",
      },
    });

    console.log(`[Warmup] Response status: ${response.status}`);

    // Try to parse JSON, but handle non-JSON responses gracefully
    let data: any = null;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log(`[Warmup] Non-JSON response: ${text.substring(0, 200)}`);
    }

    return NextResponse.json({
      success: response.ok,
      timestamp: new Date().toISOString(),
      warmupUrl,
      status: response.status,
      billsFound: data?.bills?.length || 0,
      contentType,
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
