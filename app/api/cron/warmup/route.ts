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

    // Warm up the 4 most populous states to cover ~40% of US population
    // Ordered by priority: NY first (current user need), then by population
    // NY: 19M, CA: 39M, TX: 30M, FL: 22M (total: 110M / 330M = 33%)
    const statesToWarmup = ["New York", "California", "Texas", "Florida"];

    console.log(`[Warmup] Starting warmup for ${statesToWarmup.length} states`);

    const results = await Promise.allSettled(
      statesToWarmup.map(async (state) => {
        const warmupUrl = `${productionUrl}/api/bills/search-state?q=budget&jurisdiction=${encodeURIComponent(state)}`;

        // Add timeout to prevent any single state from holding up the whole warmup
        // Each state gets max 10 seconds (all run in parallel, so total = 10s)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          const response = await fetch(warmupUrl, {
            headers: {
              "User-Agent": "Vercel-Cron-Warmup",
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          console.log(`[Warmup] ${state}: ${response.status}`);

          // Try to parse JSON, but handle non-JSON responses gracefully
          let billsFound = 0;
          const contentType = response.headers.get("content-type");

          if (contentType?.includes("application/json")) {
            const data = await response.json();
            billsFound = data?.bills?.length || 0;
          }

          return {
            state,
            status: response.status,
            success: response.ok,
            billsFound,
          };
        } catch (error) {
          clearTimeout(timeoutId);
          // Timeout or other error
          const isTimeout = error instanceof Error && error.name === 'AbortError';
          console.log(`[Warmup] ${state}: ${isTimeout ? 'timeout (10s)' : 'error'}`);

          return {
            state,
            status: 0,
            success: false,
            error: isTimeout ? 'timeout' : 'error',
          };
        }
      })
    );

    // Count successes
    const successful = results.filter(r => r.status === "fulfilled" && r.value.success).length;
    const failed = results.length - successful;

    console.log(`[Warmup] Complete: ${successful}/${results.length} successful`);

    return NextResponse.json({
      success: successful > 0,
      timestamp: new Date().toISOString(),
      states: statesToWarmup,
      successful,
      failed,
      results: results.map(r =>
        r.status === "fulfilled"
          ? r.value
          : { error: r.reason?.message || "Unknown error" }
      ),
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
