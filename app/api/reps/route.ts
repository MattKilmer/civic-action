import { NextRequest } from "next/server";
import { AddressSchema } from "@/app/lib/schemas";
import { rateLimit } from "@/app/lib/rateLimit";
import { mapCivicToOfficials } from "@/app/lib/civic";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const rl = rateLimit(`reps:${ip}`, 30, 60_000);
  if (!rl.ok) return new Response("Rate limit", { status: 429 });

  const address = req.nextUrl.searchParams.get("address") ?? "";
  const parsed = AddressSchema.safeParse({ address });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const url = new URL("https://civicinfo.googleapis.com/civicinfo/v2/representatives");
  url.searchParams.set("key", process.env.GOOGLE_CIVIC_API_KEY || "");
  url.searchParams.set("address", address);

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) {
    const text = await r.text();
    return new Response(text || "Civic Info error", { status: r.status });
  }
  const data = await r.json();
  const officials = mapCivicToOfficials(data);

  return Response.json({ address, officials });
}
