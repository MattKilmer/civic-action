"use client";
import { useState } from "react";

const DEFAULT_TOPICS = [
  "Public safety",
  "Education funding",
  "Transit & infrastructure",
  "Healthcare access",
  "Housing affordability",
  "Environment & climate",
];

export type Issue = {
  stance: "support" | "oppose";
  topic: string;
  bill?: string;
  personalImpact?: string;
  desiredAction?: string;
  tone?: "neutral" | "urgent" | "friendly";
};

export default function IssuePicker({ onChange }: { onChange: (v: Issue) => void }) {
  const [issue, setIssue] = useState<Issue>({ stance: "support", topic: DEFAULT_TOPICS[0], tone: "neutral" });

  function update<K extends keyof Issue>(k: K, v: Issue[K]) {
    const next = { ...issue, [k]: v };
    setIssue(next);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["support", "oppose"] as const).map((s) => (
          <button
            key={s}
            onClick={() => update("stance", s)}
            className={`px-3 py-2 rounded-xl border ${issue.stance === s ? "bg-black text-white" : ""}`}
            type="button"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {DEFAULT_TOPICS.map((t) => (
          <button
            key={t}
            className={`px-3 py-2 rounded-xl border ${issue.topic === t ? "bg-gray-900 text-white" : ""}`}
            onClick={() => update("topic", t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      <input
        className="w-full border rounded-xl px-3 py-2"
        placeholder="Or type a custom topic"
        value={issue.topic}
        onChange={(e) => update("topic", e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-2">
        <input className="border rounded-xl px-3 py-2" placeholder="Bill number (optional)" onChange={(e) => update("bill", e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="Desired action (e.g., please vote yes)" onChange={(e) => update("desiredAction", e.target.value)} />
      </div>

      <textarea
        className="w-full border rounded-xl px-3 py-2"
        placeholder="(Optional) One sentence on how this affects you personally"
        rows={3}
        onChange={(e) => update("personalImpact", e.target.value)}
      />

      <div className="flex gap-2">
        {(["neutral", "friendly", "urgent"] as const).map((t) => (
          <button
            key={t}
            onClick={() => update("tone", t)}
            className={`px-3 py-2 rounded-xl border ${issue.tone === t ? "bg-gray-900 text-white" : ""}`}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
