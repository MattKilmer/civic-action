"use server";

import { IssueDraftSchema, IssueDraftInput, OfficialContact } from "@/app/lib/schemas";

function systemPrompt() {
  return [
    "You draft concise, respectful constituent emails to public officials.",
    "Rules:",
    "- 150–220 words.",
    "- 1 opening paragraph stating locality & stance.",
    "- Then 2–3 short bullets with reasons (no more than one clause each).",
    "- Include any bill number exactly as provided (no fabrication).",
    "- When a bill title is provided, ensure the email is specifically about that bill's content and purpose.",
    "- Close with a clear ask and request for a written response.",
    "- Tone: calm, civil, professional. No insults, no threats.",
  ].join("\n");
}

function userPrompt(input: IssueDraftInput, official?: OfficialContact) {
  const who = official ? `${official.role} ${official.name}` : "my representative";
  const city = input.city ? ` in ${input.city}` : "";
  const state = input.state ? (input.city ? `, ${input.state}` : ` in ${input.state}`) : "";

  // Include both bill number and title for better context
  let billLine = "";
  if (input.bill) {
    billLine = `Bill: ${input.bill}`;
    if (input.billTitle) {
      billLine += ` - ${input.billTitle}`;
    }
    billLine += "\n";
  }

  const impact = input.personalImpact ? `Personal impact: ${input.personalImpact}\n` : "";
  const ask = input.desiredAction ? `Desired action: ${input.desiredAction}\n` : "";
  return [
    `Recipient: ${who}`,
    `Constituent stance: ${input.stance.toUpperCase()} — Topic: ${input.topic}`,
    billLine + impact + ask,
    `Jurisdiction: I am a resident${city}${state}.`,
    `Tone: ${input.tone ?? "neutral"}`,
  ].join("\n");
}

export async function draftEmail(inputRaw: unknown, official?: OfficialContact) {
  const parse = IssueDraftSchema.safeParse(inputRaw);
  if (!parse.success) throw new Error("Invalid input");
  const input = parse.data;

  // OpenAI implementation using gpt-4o-mini
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt() },
        { role: "user", content: userPrompt(input, official) },
      ],
      temperature: 0.3,
    }),
  });
  if (!r.ok) throw new Error("LLM error");
  const json = await r.json();
  const text = json.choices?.[0]?.message?.content?.trim() || "";
  return text;
}
