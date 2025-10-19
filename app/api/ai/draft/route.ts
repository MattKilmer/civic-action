import { NextRequest } from "next/server";
import { rateLimit } from "@/app/lib/rateLimit";
import { IssueDraftSchema } from "@/app/lib/schemas";
import { draftEmail } from "@/app/actions/draftEmail";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const rl = rateLimit(`ai:${ip}`, 15, 60_000);
  if (!rl.ok) return new Response("Rate limit", { status: 429 });

  const body = await req.json().catch(() => ({}));
  const parsed = IssueDraftSchema.safeParse(body.input);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const text = await draftEmail(parsed.data, body.official);
    return Response.json({ text });
  } catch (e: any) {
    return Response.json({ error: e.message || "AI error" }, { status: 500 });
  }
}
