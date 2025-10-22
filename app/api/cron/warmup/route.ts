import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Warmup cron job to prevent cold starts on state bill search
 * Runs every 3 minutes to keep the Edge function warm
 *
 * To enable:
 * 1. Deploy to Vercel
 * 2. Go to Project Settings → Cron Jobs
 * 3. Add cron: /api/cron/warmup with schedule (every 3 minutes)
 * 4. Or use vercel.json configuration (see vercel.json)
 */
export async function GET(req: NextRequest) {
  // Verify this is called by Vercel Cron (security)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only run warmup on production deployments
  // Skip on preview/development to avoid hitting deployment protection
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    console.log(`[Warmup] Skipping - not production (env: ${process.env.VERCEL_ENV})`);
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "Not production environment",
      env: process.env.VERCEL_ENV,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Use production domain directly to avoid preview deployment auth issues
    const productionUrl = process.env.NEXT_PUBLIC_APP_URL || "https://takecivicaction.org";
    const warmupUrl = `${productionUrl}/api/bills/search-state?q=budget&jurisdiction=California`;

    console.log(`[Warmup] Calling production: ${warmupUrl}`);

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
