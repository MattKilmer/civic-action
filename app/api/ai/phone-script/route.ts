import { NextRequest } from "next/server";
import { draftPhoneScript } from "@/app/actions/draftPhoneScript";
import { IssueDraftSchema } from "@/app/lib/schemas";
import { rateLimit } from "@/app/lib/rateLimit";

export const runtime = "edge";

/**
 * Phone script generation endpoint
 * POST /api/ai/phone-script
 * Body: { issue: IssueDraftInput, official?: OfficialContact }
 */
export async function POST(req: NextRequest) {
  // Rate limiting: 15 requests per minute (same as email drafts)
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const rl = rateLimit(`phone-script:${ip}`, 15, 60_000);
  if (!rl.ok) return new Response("Rate limit", { status: 429 });

  const body = await req.json().catch(() => ({}));

  // Validate issue data
  const parsed = IssueDraftSchema.safeParse(body.issue);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const script = await draftPhoneScript(parsed.data, body.official);
    return Response.json({ script });
  } catch (e: any) {
    return Response.json({ error: e.message || "AI error" }, { status: 500 });
  }
}
