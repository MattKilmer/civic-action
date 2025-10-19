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
};

export default function OfficialCard({ official, draft, onDraft }: Props) {
  const [busy, setBusy] = useState(false);
  const email = official.emails?.[0];
  const subject = `Constituent regarding ${official.role}`;
  const mailto = email && draft ? mailtoHref(email, subject, draft) : undefined;

  return (
    <div className="rounded-2xl border p-4 flex gap-4 items-start">
      <img
        alt=""
        src={official.photoUrl || "/placeholder.svg"}
        className="w-16 h-16 rounded-xl object-cover border"
      />
      <div className="flex-1 space-y-2">
        <div className="text-lg font-semibold">{official.name}</div>
        <div className="text-sm text-gray-600">{official.role}{official.party ? ` · ${official.party}` : ""}</div>

        <div className="flex flex-wrap gap-2">
          {official.phones?.[0] && (
            <a className="underline" href={`tel:${official.phones[0]}`}>Call office</a>
          )}
          {email && (
            <a className="underline" href={`mailto:${email}`}>Email</a>
          )}
          {official.primaryUrl && (
            <a className="underline" href={official.primaryUrl} target="_blank">Website</a>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded-xl bg-black text-white disabled:opacity-50"
            onClick={async () => { setBusy(true); try { await onDraft(); } finally { setBusy(false); } }}
            disabled={busy}
          >
            {busy ? "Drafting…" : "Generate email draft"}
          </button>
          {mailto && (
            <a className="px-3 py-2 rounded-xl border" href={mailto}>Open in Mail</a>
          )}
        </div>

        {draft && (
          <div className="mt-2">
            <label className="text-sm font-medium">Copy & paste into the official contact form:</label>
            <textarea
              className="w-full border rounded-xl p-2 mt-1"
              value={draft}
              readOnly
              rows={8}
              onFocus={(e) => e.currentTarget.select()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
