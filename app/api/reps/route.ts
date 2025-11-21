import { NextRequest, NextResponse } from "next/server";
import { AddressSchema } from "@/app/lib/schemas";
import { rateLimit } from "@/app/lib/rateLimit";
import { mapFiveCallsToOfficials } from "@/app/lib/civic";
import { logAddressLookup, logAPIError } from "@/app/lib/logger";

// export const runtime = "edge";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  const userAgent = req.headers.get("user-agent") ?? undefined;

  // Rate limiting: 30 requests per minute per IP
  const rl = rateLimit(`reps:${ip}`, 30, 60_000);
  if (!rl.ok) {
    logAPIError({
      endpoint: "/api/reps",
      error: "Rate limit exceeded",
      statusCode: 429,
      ip,
      userAgent,
    });
    return new Response("Rate limit exceeded. Please try again in a moment.", { status: 429 });
  }

  const address = req.nextUrl.searchParams.get("address") ?? "";
  const parsed = AddressSchema.safeParse({ address });

  if (!parsed.success) {
    logAPIError({
      endpoint: "/api/reps",
      error: "Invalid address format",
      statusCode: 400,
      ip,
      userAgent,
    });
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const url = new URL("https://api.5calls.org/v1/reps");
  url.searchParams.set("location", address);

  try {
    const r = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    if (!r.ok) {
      const text = await r.text();
      logAPIError({
        endpoint: "/api/reps",
        error: `5 Calls API error: ${text}`,
        statusCode: r.status,
        ip,
        userAgent,
      });
      return new Response(text || "5 Calls API error", { status: r.status });
    }

    const data = await r.json();
    const officials = mapFiveCallsToOfficials(data);

    // Log successful lookup
    logAddressLookup({
      address,
      officialsFound: officials.length,
      ip,
      userAgent,
    });

    return Response.json({
      address,
      officials,
      location: data.location,
      state: data.state,
      district: data.district,
    });
  } catch (error) {
    logAPIError({
      endpoint: "/api/reps",
      error: error instanceof Error ? error.message : "Unknown error",
      statusCode: 500,
      ip,
      userAgent,
    });
    throw error;
  }
}
