"use client";
import { useState, useEffect, useRef } from "react";

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

interface BillSuggestion {
  number: string;
  title: string;
  status: string;
  date: string;
}

export default function IssuePicker({ onChange }: { onChange: (v: Issue) => void }) {
  const [issue, setIssue] = useState<Issue>({ stance: "support", topic: DEFAULT_TOPICS[0], tone: "neutral" });
  const [billQuery, setBillQuery] = useState("");
  const [billSuggestions, setBillSuggestions] = useState<BillSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  function update<K extends keyof Issue>(k: K, v: Issue[K]) {
    const next = { ...issue, [k]: v };
    setIssue(next);
    onChange(next);
  }

  // Debounced bill search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (billQuery.length < 2) {
      setBillSuggestions([]);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/bills/search?q=${encodeURIComponent(billQuery)}`);
        if (res.ok) {
          const suggestions = await res.json();
          setBillSuggestions(suggestions);
        }
      } catch (error) {
        console.error('Bill search error:', error);
      }
    }, 300); // Wait 300ms after user stops typing

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [billQuery]);

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
        <div className="relative">
          <label htmlFor="bill-number" className="block font-semibold text-gray-700 mb-1 text-sm">
            Bill Number <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <input
            id="bill-number"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., HR 1234 or search by title"
            value={billQuery}
            onChange={(e) => {
              setBillQuery(e.target.value);
              update("bill", e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay to allow clicking suggestions
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />

          {/* Bill Suggestions Dropdown */}
          {showSuggestions && billSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {billSuggestions.map((bill) => (
                <button
                  key={bill.number}
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    setBillQuery(bill.number);
                    update("bill", bill.number);
                    setShowSuggestions(false);
                  }}
                >
                  <div className="font-semibold text-sm text-gray-900">{bill.number}</div>
                  <div className="text-xs text-gray-600 line-clamp-1">{bill.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{bill.status}</div>
                </button>
              ))}
            </div>
          )}
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
