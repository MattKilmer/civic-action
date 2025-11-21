import { NextRequest, NextResponse } from "next/server";
import analytics from "@/app/lib/analytics";

export const runtime = "edge";

/**
 * Admin Analytics API
 * GET /api/admin/analytics?password={adminPassword}
 *
 * Returns comprehensive analytics data for the admin dashboard.
 * Requires authentication via query parameter.
 */
export async function GET(req: NextRequest) {
  // Simple authentication via environment variable
  const adminPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.nextUrl.searchParams.get("password");

  // If no admin password is set, disable the endpoint
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin dashboard not configured" },
      { status: 503 }
    );
  }

  // Verify password
  if (providedPassword !== adminPassword) {
    // Log unauthorized attempts
    console.warn("[SECURITY] Unauthorized admin access attempt", {
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Return analytics snapshot
  const snapshot = analytics.getSnapshot();

  return NextResponse.json({
    success: true,
    data: snapshot,
    generatedAt: new Date().toISOString(),
  });
}

/**
 * Reset analytics data (requires authentication)
 * POST /api/admin/analytics/reset?password={adminPassword}
 */
export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.nextUrl.searchParams.get("password");

  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin dashboard not configured" },
      { status: 503 }
    );
  }

  if (providedPassword !== adminPassword) {
    console.warn("[SECURITY] Unauthorized admin reset attempt", {
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Reset analytics
  analytics.reset();

  return NextResponse.json({
    success: true,
    message: "Analytics data reset successfully",
    timestamp: new Date().toISOString(),
  });
}
