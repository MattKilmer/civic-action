import { NextRequest, NextResponse } from "next/server";
import { AddressSchema } from "@/app/lib/schemas";
import { rateLimit } from "@/app/lib/rateLimit";
import { mapFiveCallsToOfficials } from "@/app/lib/civic";

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
  console.log("Calling 5 Calls API...");

  const url = new URL("https://api.5calls.org/v1/reps");
  url.searchParams.set("location", address);

  const r = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  if (!r.ok) {
    const text = await r.text();
    console.log("5 Calls API error:", r.status, text);
    return new Response(text || "5 Calls API error", { status: r.status });
  }
  const data = await r.json();
  const officials = mapFiveCallsToOfficials(data);

  return Response.json({ address, officials });
}
