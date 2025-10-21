"use client";
import OfficialCard from "./OfficialCard";
import type { Issue } from "./IssuePicker";
import { useState } from "react";

type Official = {
  name: string; role: string; party?: string; phones: string[]; emails: string[]; urls: string[]; photoUrl?: string; primaryUrl?: string;
};

export default function OfficialsList({ officials, issue, location }: {
  officials: Official[];
  issue: Issue | null;
  location?: { city?: string; state?: string };
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function draftFor(official: Official) {
    if (!issue) return; // Safety check
    const input = { ...issue, ...location };
    const r = await fetch("/api/ai/draft", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input, official }),
    });
    const json = await r.json();
    if (json.text) setDrafts((d) => ({ ...d, [official.name + official.role]: json.text }));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {officials.map((o) => (
        <OfficialCard
          key={o.name + o.role}
          official={o}
          draft={drafts[o.name + o.role]}
          onDraft={() => draftFor(o)}
          hasIssue={!!issue}
        />
      ))}
    </div>
  );
}
