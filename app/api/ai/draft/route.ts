import { NextRequest } from "next/server";
import { rateLimit } from "@/app/lib/rateLimit";
import { IssueDraftSchema } from "@/app/lib/schemas";
import { draftEmail } from "@/app/actions/draftEmail";
import { logEmailDraft, logAPIError } from "@/app/lib/logger";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  const userAgent = req.headers.get("user-agent") ?? undefined;

  // Rate limiting: 15 requests per minute per IP
  const rl = rateLimit(`ai:${ip}`, 15, 60_000);
  if (!rl.ok) {
    logAPIError({
      endpoint: "/api/ai/draft",
      error: "Rate limit exceeded",
      statusCode: 429,
      ip,
      userAgent,
    });
    return new Response("Rate limit exceeded. Please try again in a moment.", { status: 429 });
  }

  const body = await req.json().catch(() => ({}));

  const parsed = IssueDraftSchema.safeParse(body.input);
  if (!parsed.success) {
    logAPIError({
      endpoint: "/api/ai/draft",
      error: "Invalid input format",
      statusCode: 400,
      ip,
      userAgent,
    });
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const text = await draftEmail(parsed.data, body.official);

    // Log successful draft generation
    logEmailDraft({
      topic: parsed.data.topic,
      stance: parsed.data.stance,
      billNumber: parsed.data.billNumber || undefined,
      officialRole: body.official?.role || "unknown",
      wordCount: text.split(/\s+/).length,
      ip,
      userAgent,
    });

    return Response.json({ text });
  } catch (e: any) {
    logAPIError({
      endpoint: "/api/ai/draft",
      error: e.message || "AI generation error",
      statusCode: 500,
      ip,
      userAgent,
    });
    return Response.json({ error: e.message || "AI error" }, { status: 500 });
  }
}
