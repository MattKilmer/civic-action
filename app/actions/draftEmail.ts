"use server";

import { IssueDraftSchema, IssueDraftInput, OfficialContact } from "@/app/lib/schemas";

function systemPrompt() {
  return [
    "You draft concise, respectful constituent emails to public officials.",
    "Rules:",
    "- 150–220 words.",
    "- Opening paragraph: State locality, mention the SPECIFIC BILL NUMBER AND TITLE, and your stance on it.",
    "- Then 2–3 short bullets explaining why based on what the bill actually does.",
    "- CRITICAL: When bill information is provided, you MUST:",
    "  * In your opening paragraph, use the placeholder [BILL_NUMBER] where the bill number should appear",
    "  * Include the bill title after the bill number placeholder",
    "  * Write ONLY about what that specific bill does (based on the summary provided)",
    "  * Do NOT write about general topics - be specific to this legislation",
    "- If no bill is provided, write about the general topic.",
    "- Close with a clear ask using the placeholder [BILL_NUMBER] (e.g., 'I urge you to support/oppose [BILL_NUMBER]').",
    "- Request a written response.",
    "- Tone: calm, civil, professional. No insults, no threats.",
    "- IMPORTANT: Use [BILL_NUMBER] as a placeholder - do NOT write the actual bill number yourself.",
  ].join("\n");
}

function userPrompt(input: IssueDraftInput, official?: OfficialContact) {
  const who = official ? `${official.role} ${official.name}` : "my representative";
  const city = input.city ? ` in ${input.city}` : "";
  const state = input.state ? (input.city ? `, ${input.state}` : ` in ${input.state}`) : "";

  const impact = input.personalImpact ? `Personal impact: ${input.personalImpact}\n` : "";
  const ask = input.desiredAction ? `Desired action: ${input.desiredAction}\n` : "";

  // Build bill information section - prioritize summary when available
  const parts: string[] = [`Recipient: ${who}`];

  // Check for bill summary first - even if bill number is missing, the summary is what matters!
  if (input.billSummary) {
    // BILL-SPECIFIC EMAIL: Put bill info FIRST to make it the primary focus
    const billHeader = input.bill
      ? `${input.bill}${input.billTitle ? ` - ${input.billTitle}` : ""}`
      : (input.billTitle || "Specific Legislation");

    parts.push(`BILL-SPECIFIC REQUEST: ${billHeader}`);
    parts.push(`WHAT THIS BILL DOES: ${input.billSummary}`);
    parts.push(`Constituent stance: ${input.stance.toUpperCase()} this bill`);
    if (impact) parts.push(impact.trim());
    if (ask) parts.push(ask.trim());
    parts.push(`Jurisdiction: I am a resident${city}${state}.`);
    parts.push(`Tone: ${input.tone ?? "neutral"}`);
  } else if (input.bill) {
    // Has bill number but no summary - still bill-focused
    parts.push(`BILL: ${input.bill}${input.billTitle ? ` - ${input.billTitle}` : ""}`);
    parts.push(`Constituent stance: ${input.stance.toUpperCase()} — Topic: ${input.topic}`);
    if (impact) parts.push(impact.trim());
    if (ask) parts.push(ask.trim());
    parts.push(`Jurisdiction: I am a resident${city}${state}.`);
    parts.push(`Tone: ${input.tone ?? "neutral"}`);
  } else {
    // No bill - general topic-based email
    parts.push(`Constituent stance: ${input.stance.toUpperCase()} — Topic: ${input.topic}`);
    if (impact) parts.push(impact.trim());
    if (ask) parts.push(ask.trim());
    parts.push(`Jurisdiction: I am a resident${city}${state}.`);
    parts.push(`Tone: ${input.tone ?? "neutral"}`);
  }

  return parts.join("\n");
}

export async function draftEmail(inputRaw: unknown, official?: OfficialContact) {
  const parse = IssueDraftSchema.safeParse(inputRaw);
  if (!parse.success) throw new Error("Invalid input");
  const input = parse.data;

  console.log('[draftEmail] Input data:', {
    bill: input.bill,
    billTitle: input.billTitle,
    billSummary: input.billSummary ? `${input.billSummary.substring(0, 50)}...` : 'NONE',
    topic: input.topic,
    stance: input.stance
  });

  const prompt = userPrompt(input, official);
  console.log('[draftEmail] User prompt:\n', prompt);

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
  let text = json.choices?.[0]?.message?.content?.trim() || "";

  // Replace [BILL_NUMBER] placeholder with actual bill number to ensure exact format
  if (input.bill) {
    text = text.replace(/\[BILL_NUMBER\]/g, input.bill);
    console.log('[draftEmail] Replaced [BILL_NUMBER] with:', input.bill);
  }

  return text;
}
