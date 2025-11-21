import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/app/lib/db";

export const runtime = "edge";

/**
 * Database Initialization API
 * POST /api/admin/init-db?password={adminPassword}
 *
 * Creates database tables if they don't exist.
 * Only accessible with admin password.
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
    console.warn("[SECURITY] Unauthorized admin init-db attempt", {
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Initialize database schema
  try {
    const result = await initializeDatabase();

    if (!result.success) {
      throw result.error;
    }

    return NextResponse.json({
      success: true,
      message: "Database schema initialized successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return NextResponse.json(
      {
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
