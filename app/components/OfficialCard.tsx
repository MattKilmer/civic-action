"use client";
import { mailtoHref } from "@/app/lib/mailto";
import { useState } from "react";

type Props = {
  official: {
    name: string;
    role: string;
    party?: string;
    phones: string[];
    emails: string[];
    urls: string[];
    photoUrl?: string;
    primaryUrl?: string;
  };
  draft?: string;
  onDraft: () => Promise<void>;
  hasIssue?: boolean;
};

export default function OfficialCard({ official, draft, onDraft, hasIssue = false }: Props) {
  const [busy, setBusy] = useState(false);
  const email = official.emails?.[0];
  const subject = `Constituent regarding ${official.role}`;
  const mailto = email && draft ? mailtoHref(email, subject, draft) : undefined;
  const canDraft = hasIssue && !draft;

  // Generate initials for photo fallback
  const initials = official.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-2xl border border-gray-200 p-6 space-y-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex gap-4 items-start">
        {/* Official Photo or Initials */}
        {official.photoUrl ? (
          <img
            alt={`Photo of ${official.name}`}
            src={official.photoUrl}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-lg border-2 border-blue-200">
            {initials}
          </div>
        )}

        {/* Official Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">{official.name}</h3>
          <p className="text-sm text-gray-600">
            {official.role}
            {official.party && <span className="text-gray-500"> · {official.party}</span>}
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="flex flex-wrap gap-3">
        {official.phones?.[0] && (
          <a
            href={`tel:${official.phones[0]}`}
            className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            📞 Call office
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            ✉️ Email
          </a>
        )}
        {official.primaryUrl && (
          <a
            href={official.primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            🌐 Website
          </a>
        )}
      </div>

      {/* Draft Actions */}
      <div className="flex flex-wrap gap-2">
        <div className="relative group">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            onClick={async () => {
              if (!hasIssue) return;
              setBusy(true);
              try {
                await onDraft();
              } finally {
                setBusy(false);
              }
            }}
            disabled={busy || !!draft || !hasIssue}
            title={!hasIssue ? "Select an issue above to draft an email" : undefined}
          >
            {busy ? "Drafting…" : draft ? "✓ Draft generated" : "Draft email"}
          </button>
          {!hasIssue && !draft && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              ⬆ Select an issue above first
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
        {mailto && (
          <a
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            href={mailto}
          >
            Send email to {official.name.split(" ")[0]}
          </a>
        )}
      </div>

      {/* Draft Display */}
      {draft && (
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <label htmlFor={`draft-${official.name}`} className="block text-sm font-semibold text-gray-700">
            Your AI-drafted email:
          </label>
          <textarea
            id={`draft-${official.name}`}
            className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
            value={draft}
            readOnly
            rows={10}
            onFocus={(e) => e.currentTarget.select()}
          />
          <p className="text-sm text-gray-600">
            Click to select all, then copy and paste into your email client or the official&apos;s contact form.
          </p>
        </div>
      )}
    </div>
  );
}
