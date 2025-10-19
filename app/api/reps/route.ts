import { NextRequest, NextResponse } from "next/server";
import { AddressSchema } from "@/app/lib/schemas";
import { rateLimit } from "@/app/lib/rateLimit";
import { mapCivicToOfficials } from "@/app/lib/civic";

// export const runtime = "edge";

export async function GET(req: NextRequest) {
  console.log("API /api/reps called");
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const rl = rateLimit(`reps:${ip}`, 30, 60_000);
  if (!rl.ok) {
    console.log("Rate limit exceeded");
    return new Response("Rate limit", { status: 429 });
  }

  const address = req.nextUrl.searchParams.get("address") ?? "";
  console.log("Address:", address);
  const parsed = AddressSchema.safeParse({ address });
  console.log("Parsed:", parsed);
  if (!parsed.success) {
    console.log("Validation failed:", parsed.error);
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  console.log("Calling Google Civic API...");

  const url = new URL("https://civicinfo.googleapis.com/civicinfo/v2/representatives");
  url.searchParams.set("key", process.env.GOOGLE_CIVIC_API_KEY || "");
  url.searchParams.set("address", address);

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) {
    const text = await r.text();
    console.log("Google Civic API error:", r.status, text);
    return new Response(text || "Civic Info error", { status: r.status });
  }
  const data = await r.json();
  const officials = mapCivicToOfficials(data);

  return Response.json({ address, officials });
}
