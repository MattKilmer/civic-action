"use client";
import { useState } from "react";

// Research-backed top 10 issues for young voters (2024-2025 data)
// Based on Harvard Youth Poll, Pew Research, and AP-NORC polling
// Ordered by salience and importance to 18-35 demographic
const DEFAULT_TOPICS = [
  "Climate Change & Environmental Policy",
  "Economy, Jobs & Wages",
  "Housing Affordability & Rent Costs",
  "Healthcare Access & Costs",
  "Gun Policy & Community Safety",
  "Reproductive Rights & Abortion Access",
  "Education Costs & Student Debt",
  "Immigration & Border Policy",
  "Criminal Justice & Police Reform",
  "Voting Rights & Election Integrity",
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
    <div className="space-y-6">
      {/* Stance Selection */}
      <div>
        <label className="block font-semibold text-gray-700 mb-2 text-sm">
          Your Stance <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-2">
          {(["support", "oppose"] as const).map((s) => (
            <button
              key={s}
              onClick={() => update("stance", s)}
              className={`px-4 py-2 rounded-md border font-semibold text-sm transition-colors capitalize focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                issue.stance === s
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
              }`}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Selection */}
      <div>
        <label className="block font-semibold text-gray-700 mb-2 text-sm">
          Issue Topic <span className="text-red-600">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_TOPICS.map((t) => (
            <button
              key={t}
              className={`px-3 py-2 rounded-md border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                issue.topic === t
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => update("topic", t)}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Topic Input */}
      <div>
        <label htmlFor="custom-topic" className="block font-semibold text-gray-700 mb-1 text-sm">
          Or enter a custom topic
        </label>
        <input
          id="custom-topic"
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Type your own topic"
          value={issue.topic}
          onChange={(e) => update("topic", e.target.value)}
        />
      </div>

      {/* Optional Fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="bill-number" className="block font-semibold text-gray-700 mb-1 text-sm">
            Bill Number <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <input
            id="bill-number"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., HR 1234"
            onChange={(e) => update("bill", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="desired-action" className="block font-semibold text-gray-700 mb-1 text-sm">
            Desired Action <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <input
            id="desired-action"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., Please vote yes"
            onChange={(e) => update("desiredAction", e.target.value)}
          />
        </div>
      </div>

      {/* Personal Impact */}
      <div>
        <label htmlFor="personal-impact" className="block font-semibold text-gray-700 mb-1 text-sm">
          Personal Impact <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="personal-impact"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
          placeholder="How does this issue affect you personally?"
          rows={3}
          onChange={(e) => update("personalImpact", e.target.value)}
        />
        <p className="text-sm text-gray-600 mt-1">
          Adding your personal story makes your message more impactful.
        </p>
      </div>

      {/* Tone Selection */}
      <div>
        <label className="block font-semibold text-gray-700 mb-2 text-sm">
          Message Tone
        </label>
        <div className="flex gap-2">
          {(["neutral", "friendly", "urgent"] as const).map((t) => (
            <button
              key={t}
              onClick={() => update("tone", t)}
              className={`px-3 py-2 rounded-md border text-sm transition-colors capitalize focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                issue.tone === t
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
              }`}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
