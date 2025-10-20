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
  billSummary?: string;
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
  type: string;
  congress: number;
}

interface IssuePickerProps {
  onChange: (v: Issue) => void;
  initialBillNumber?: string | null;
  initialBillTitle?: string | null;
  initialBillCongress?: string | null;
  initialBillType?: string | null;
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

export default function IssuePicker({ onChange, initialBillNumber, initialBillTitle, initialBillCongress, initialBillType }: IssuePickerProps) {
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
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const isAutoDetectingRef = useRef(false); // Track if we're auto-detecting topic from bill

  // Pre-fill bill number and auto-detect topic from bill title
  useEffect(() => {
    if (initialBillNumber) {
      isAutoDetectingRef.current = true; // Flag that we're auto-detecting

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

      isAutoDetectingRef.current = false; // Done auto-detecting

      // Fetch bill summary if we have congress and type info
      if (initialBillCongress && initialBillType) {
        setLoadingSummary(true);
        fetchBillDetails(
          parseInt(initialBillCongress),
          initialBillType,
          initialBillNumber
        ).then((summary) => {
          if (summary) {
            update("billSummary", summary);
          }
          setLoadingSummary(false);
        }).catch(() => {
          setLoadingSummary(false);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBillNumber, initialBillTitle, initialBillCongress, initialBillType]);

  function update<K extends keyof Issue>(k: K, v: Issue[K]) {
    const next = { ...issue, [k]: v };
    console.log(`[IssuePicker.update] Setting ${k} =`, v);
    console.log(`[IssuePicker.update] New issue state:`, { ...next, billSummary: next.billSummary ? `${next.billSummary.substring(0, 30)}...` : undefined });
    setIssue(next);
    onChange(next);
  }

  function handleTopicChange(value: string) {
    console.log(`[IssuePicker.handleTopicChange] Topic changed to: "${value}", isAutoDetecting: ${isAutoDetectingRef.current}`);
    setSelectedTopicValue(value);

    // Determine the new topic value
    const newTopic = value === "OTHER" ? (customTopic || "") : (value || "");

    // Only clear bill fields if user is MANUALLY changing topic (not auto-detection)
    if (!isAutoDetectingRef.current) {
      console.log('[IssuePicker.handleTopicChange] MANUAL topic change - clearing bill fields (bill, billTitle, billSummary) and setting new topic');
      // Clear bill-related fields AND set new topic in ONE update
      setBillQuery("");
      const next = { ...issue, bill: undefined, billTitle: undefined, billSummary: undefined, topic: newTopic };
      setIssue(next);
      onChange(next);
      setSummaryExpanded(true); // Reset summary expansion state
    } else {
      console.log('[IssuePicker.handleTopicChange] AUTO-DETECTING from bill - preserving bill fields, only updating topic');
      // Just update the topic without clearing bill fields
      update("topic", newTopic);
    }
  }

  function handleCustomTopicChange(value: string) {
    setCustomTopic(value);
    if (selectedTopicValue === "OTHER") {
      update("topic", value);
    }
  }

  // Fetch bill details including summary
  async function fetchBillDetails(congress: number, type: string, billNumber: string) {
    try {
      // Extract just the numeric part from bill number (e.g., "HR 1234" -> "1234")
      const numericPart = billNumber.replace(/[A-Z\s]/gi, '').trim();
      console.log(`[IssuePicker] Fetching bill summary: congress=${congress}, type=${type}, input="${billNumber}", extracted="${numericPart}"`);
      const url = `/api/bills/${congress}/${type}/${numericPart}`;
      console.log(`[IssuePicker] Fetching from: ${url}`);
      const res = await fetch(url);
      if (res.ok) {
        const details = await res.json();
        console.log(`[IssuePicker] Got summary:`, details.summary?.substring(0, 100));
        return details.summary;
      } else {
        console.error(`[IssuePicker] Bill details fetch failed: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error('[IssuePicker] Bill details fetch error:', error);
    }
    return null;
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

      {/* Bill Summary Display */}
      {loadingSummary && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-900">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">Loading bill summary...</span>
          </div>
        </div>
      )}

      {!loadingSummary && issue.billSummary && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setSummaryExpanded(!summaryExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-semibold text-blue-900 text-sm">
                Bill Summary
              </h3>
            </div>
            <svg
              className={`w-4 h-4 text-blue-700 transition-transform ${summaryExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {summaryExpanded && (
            <div className="px-4 pb-4 pt-2">
              <div className="text-sm text-gray-700 max-h-60 overflow-y-auto pr-2 custom-scrollbar" style={{ lineHeight: '1.6' }}>
                {issue.billSummary}
              </div>
            </div>
          )}
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
                  onClick={async () => {
                    setBillQuery(bill.number);
                    update("bill", bill.number);
                    update("billTitle", bill.title);
                    setShowSuggestions(false);

                    // Fetch bill summary for better AI context
                    setLoadingSummary(true);
                    try {
                      const summary = await fetchBillDetails(bill.congress, bill.type, bill.number.toString());
                      if (summary) {
                        update("billSummary", summary);
                      }
                    } catch (error) {
                      console.error('Failed to fetch bill summary:', error);
                    } finally {
                      setLoadingSummary(false);
                    }

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
