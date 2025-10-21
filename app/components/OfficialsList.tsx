"use client";
import OfficialCard from "./OfficialCard";
import type { Issue } from "./IssuePicker";
import { useState } from "react";
import { getBillInfo, canOfficialVoteOnBill, getVotingDescription } from "@/app/lib/billVoting";

type Official = {
  name: string;
  role: string;
  party?: string;
  state?: string; // State abbreviation for state legislators
  phones: string[];
  emails: string[];
  urls: string[];
  photoUrl?: string;
  primaryUrl?: string;
};

type EnrichedOfficial = Official & {
  canVote: boolean;
};

export default function OfficialsList({ officials, issue, location }: {
  officials: Official[];
  issue: Issue | null;
  location?: { city?: string; state?: string };
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [infoBannerDismissed, setInfoBannerDismissed] = useState(false);

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

  // Determine bill info and enrich officials with voting info
  // For state bills, use issue.jurisdiction; for federal bills, use location.state
  const billJurisdiction = issue?.jurisdiction || location?.state;
  const billInfo = getBillInfo(issue?.bill, billJurisdiction);
  const enrichedOfficials: EnrichedOfficial[] = officials.map(official => ({
    ...official,
    canVote: canOfficialVoteOnBill(official.role, billInfo, official.state)
  }));

  // Sort officials: voting officials first, maintaining original order within groups
  const sortedOfficials = [...enrichedOfficials].sort((a, b) => {
    if (a.canVote && !b.canVote) return -1;
    if (!a.canVote && b.canVote) return 1;
    return 0;
  });

  // Get voting description for info banner
  const votingDescription = getVotingDescription(issue?.bill, billInfo?.jurisdiction);
  const showInfoBanner = votingDescription && !infoBannerDismissed;

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      {showInfoBanner && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3" role="status">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div className="flex-1">
            <p className="text-sm text-blue-900">
              {votingDescription}
            </p>
          </div>
          <button
            onClick={() => setInfoBannerDismissed(true)}
            className="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-1"
            aria-label="Dismiss voting information"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Officials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedOfficials.map((o) => (
          <OfficialCard
            key={o.name + o.role}
            official={o}
            draft={drafts[o.name + o.role]}
            onDraft={() => draftFor(o)}
            hasIssue={!!issue}
            canVote={o.canVote}
            billNumber={issue?.bill}
          />
        ))}
      </div>
    </div>
  );
}
