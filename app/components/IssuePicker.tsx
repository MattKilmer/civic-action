"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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

const TOPIC_OPTIONS = [
  { value: "", label: "Select an issue topic" },
  ...DEFAULT_TOPICS.map(topic => ({ value: topic, label: topic })),
  { value: "OTHER", label: "Other (specify below)" },
];

export type Issue = {
  stance: "support" | "oppose";
  topic: string;
  bill?: string;
  billTitle?: string;
  personalImpact?: string;
  desiredAction?: string;
  tone?: "neutral" | "urgent" | "friendly";
};

interface BillSuggestion {
  number: string;
  title: string;
  titleShort: string;
  status: string;
  date: string;
}

interface IssuePickerProps {
  onChange: (v: Issue) => void;
  initialBillNumber?: string | null;
  initialBillTitle?: string | null;
}

/**
 * Maps bill title keywords to our predefined topics
 * Returns the best-matching topic or "OTHER" if no match
 */
function mapBillTitleToTopic(billTitle: string): string {
  const titleLower = billTitle.toLowerCase();

  const keywordMappings = [
    {
      keywords: ["climate", "environment", "carbon", "emissions", "renewable", "clean energy", "pollution", "greenhouse"],
      topic: "Climate Change & Environmental Policy"
    },
    {
      keywords: ["economy", "jobs", "employment", "wage", "labor", "work", "unemployment", "economic"],
      topic: "Economy, Jobs & Wages"
    },
    {
      keywords: ["housing", "rent", "affordable housing", "homelessness", "mortgage", "real estate"],
      topic: "Housing Affordability & Rent Costs"
    },
    {
      keywords: ["healthcare", "health care", "medicaid", "medicare", "insurance", "medical", "hospital", "prescription"],
      topic: "Healthcare Access & Costs"
    },
    {
      keywords: ["gun", "firearm", "weapon", "second amendment", "shooting", "gun violence"],
      topic: "Gun Policy & Community Safety"
    },
    {
      keywords: ["reproductive", "abortion", "roe", "pregnancy", "contraception", "family planning"],
      topic: "Reproductive Rights & Abortion Access"
    },
    {
      keywords: ["education", "student", "college", "university", "tuition", "loan", "debt forgiveness", "school"],
      topic: "Education Costs & Student Debt"
    },
    {
      keywords: ["immigration", "border", "visa", "refugee", "asylum", "citizenship", "immigrant"],
      topic: "Immigration & Border Policy"
    },
    {
      keywords: ["criminal justice", "police", "reform", "sentencing", "prison", "incarceration", "law enforcement"],
      topic: "Criminal Justice & Police Reform"
    },
    {
      keywords: ["voting", "election", "ballot", "voter", "electoral", "democracy", "suffrage"],
      topic: "Voting Rights & Election Integrity"
    },
  ];

  for (const mapping of keywordMappings) {
    if (mapping.keywords.some(keyword => titleLower.includes(keyword))) {
      return mapping.topic;
    }
  }

  return "OTHER";
}

export default function IssuePicker({ onChange, initialBillNumber, initialBillTitle }: IssuePickerProps) {
  const [issue, setIssue] = useState<Issue>({
    stance: "support",
    topic: DEFAULT_TOPICS[0],
    tone: "neutral"
  });
  const [selectedTopicValue, setSelectedTopicValue] = useState<string>(DEFAULT_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState<string>("");
  const [billQuery, setBillQuery] = useState("");
  const [billSuggestions, setBillSuggestions] = useState<BillSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Pre-fill bill number and auto-detect topic from bill title
  useEffect(() => {
    if (initialBillNumber) {
      setBillQuery(initialBillNumber);

      // Auto-detect topic from bill title
      if (initialBillTitle) {
        const detectedTopic = mapBillTitleToTopic(initialBillTitle);

        if (detectedTopic === "OTHER") {
          setSelectedTopicValue("OTHER");
          setCustomTopic(initialBillTitle);
          update("topic", initialBillTitle);
        } else {
          setSelectedTopicValue(detectedTopic);
          update("topic", detectedTopic);
        }

        // Store bill title for AI context
        update("billTitle", initialBillTitle);
      }

      update("bill", initialBillNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBillNumber, initialBillTitle]);

  function update<K extends keyof Issue>(k: K, v: Issue[K]) {
    const next = { ...issue, [k]: v };
    setIssue(next);
    onChange(next);
  }

  function handleTopicChange(value: string) {
    setSelectedTopicValue(value);

    if (value === "OTHER") {
      // When "Other" is selected, wait for custom input
      update("topic", customTopic || "");
    } else if (value) {
      // Use the selected predefined topic
      update("topic", value);
    }
  }

  function handleCustomTopicChange(value: string) {
    setCustomTopic(value);
    if (selectedTopicValue === "OTHER") {
      update("topic", value);
    }
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
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [billQuery]);

  const showCustomTopicField = selectedTopicValue === "OTHER";

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

      {/* Topic Dropdown */}
      <div>
        <label htmlFor="topic-select" className="block font-semibold text-gray-700 mb-2 text-sm">
          Issue Topic <span className="text-red-600">*</span>
        </label>
        <select
          id="topic-select"
          value={selectedTopicValue}
          onChange={(e) => handleTopicChange(e.target.value)}
          className="w-full border border-gray-300 text-gray-900 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {TOPIC_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} disabled={!option.value && option.value !== "OTHER"}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Topic Input (conditional) */}
      {showCustomTopicField && (
        <div>
          <label htmlFor="custom-topic" className="block font-semibold text-gray-700 mb-1 text-sm">
            Specify your topic <span className="text-red-600">*</span>
          </label>
          <input
            id="custom-topic"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., Infrastructure spending"
            value={customTopic}
            onChange={(e) => handleCustomTopicChange(e.target.value)}
          />
        </div>
      )}

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
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                  onClick={() => {
                    setBillQuery(bill.number);
                    update("bill", bill.number);
                    update("billTitle", bill.title);
                    setShowSuggestions(false);

                    // Auto-detect topic from bill title
                    const detectedTopic = mapBillTitleToTopic(bill.title);
                    if (detectedTopic !== "OTHER") {
                      setSelectedTopicValue(detectedTopic);
                      update("topic", detectedTopic);
                    }
                  }}
                >
                  <div className="font-semibold text-sm text-gray-900">{bill.number}</div>
                  <div className="text-xs text-gray-600 line-clamp-1">{bill.titleShort}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{bill.status}</div>
                </button>
              ))}
            </div>
          )}

          {/* Explore Bills Link */}
          <Link
            href="/bills"
            className="inline-flex items-center gap-1 mt-1.5 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Explore all bills
          </Link>
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
