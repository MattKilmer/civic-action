"use server";

import { IssueDraftSchema, IssueDraftInput, OfficialContact } from "@/app/lib/schemas";

function systemPrompt() {
  return [
    "You draft concise, respectful phone scripts for constituents to call their representatives.",
    "Rules:",
    "- 60-90 words total (30-45 seconds when spoken).",
    "- Opening: Greeting, constituent name (use placeholder [YOUR_NAME]), location (city/state if provided).",
    "- State your position clearly: 'I'm calling to ask you to support/oppose [BILL_NUMBER]' or the topic.",
    "- ONE brief reason (one sentence maximum) - keep it simple and conversational.",
    "- If personal impact is provided, include it briefly (one sentence).",
    "- Close: 'Thank you for your time' or similar.",
    "- Tone: Polite, conversational, brief. Office staff appreciate brevity.",
    "- IMPORTANT: Use [BILL_NUMBER] as a placeholder - do NOT write the actual bill number yourself.",
    "- IMPORTANT: Use [YOUR_NAME] as a placeholder for the caller's name.",
    "- Format as natural spoken dialogue, not formal letter language.",
  ].join("\n");
}

function userPrompt(input: IssueDraftInput, official?: OfficialContact) {
  const who = official ? `${official.role} ${official.name}` : "my representative";
  const city = input.city ? ` in ${input.city}` : "";
  const state = input.state ? (input.city ? `, ${input.state}` : ` in ${input.state}`) : "";
  const location = city || state ? `${city}${state}` : "";

  const impact = input.personalImpact ? `Personal impact: ${input.personalImpact}\n` : "";

  const parts: string[] = [`Recipient: ${who}'s office (phone call)`];

  // Build context based on available information
  if (input.billSummary) {
    // BILL-SPECIFIC CALL: Focus on specific legislation
    const billHeader = input.bill
      ? `${input.bill}${input.billTitle ? ` - ${input.billTitle}` : ""}`
      : (input.billTitle || "Specific Legislation");

    parts.push(`BILL: ${billHeader}`);
    parts.push(`WHAT THIS BILL DOES: ${input.billSummary}`);
    parts.push(`Caller stance: ${input.stance.toUpperCase()} this bill`);
    if (impact) parts.push(impact.trim());
    if (location) parts.push(`Caller location:${location}`);
    parts.push(`Tone: ${input.tone ?? "neutral"}`);
  } else if (input.bill) {
    // Has bill number but no summary
    parts.push(`BILL: ${input.bill}${input.billTitle ? ` - ${input.billTitle}` : ""}`);
    parts.push(`Caller stance: ${input.stance.toUpperCase()} — Topic: ${input.topic}`);
    if (impact) parts.push(impact.trim());
    if (location) parts.push(`Caller location:${location}`);
    parts.push(`Tone: ${input.tone ?? "neutral"}`);
  } else {
    // No bill - general topic-based call
    parts.push(`Topic: ${input.topic}`);
    parts.push(`Caller stance: ${input.stance.toUpperCase()} this topic`);
    if (impact) parts.push(impact.trim());
    if (location) parts.push(`Caller location:${location}`);
    parts.push(`Tone: ${input.tone ?? "neutral"}`);
  }

  parts.push("Remember: This is a phone script, so keep it brief and conversational. Office staff handle many calls daily.");

  return parts.join("\n");
}

export async function draftPhoneScript(inputRaw: unknown, official?: OfficialContact) {
  const parse = IssueDraftSchema.safeParse(inputRaw);
  if (!parse.success) throw new Error("Invalid input");
  const input = parse.data;

  console.log('[draftPhoneScript] Input data:', {
    bill: input.bill,
    billTitle: input.billTitle,
    billSummary: input.billSummary ? `${input.billSummary.substring(0, 50)}...` : 'NONE',
    topic: input.topic,
    stance: input.stance
  });

  const prompt = userPrompt(input, official);
  console.log('[draftPhoneScript] User prompt:\n', prompt);

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

  // Replace [BILL_NUMBER] placeholder with actual bill number
  if (input.bill) {
    text = text.replace(/\[BILL_NUMBER\]/g, input.bill);
    console.log('[draftPhoneScript] Replaced [BILL_NUMBER] with:', input.bill);
  }

  return text;
}
