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
  phoneScript?: string;
  onPhoneScript: () => Promise<void>;
  hasIssue?: boolean;
  canVote?: boolean;
  billNumber?: string;
};

export default function OfficialCard({ official, draft, onDraft, phoneScript, onPhoneScript, hasIssue = false, canVote = false, billNumber }: Props) {
  const [busy, setBusy] = useState(false);
  const [busyPhone, setBusyPhone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showWebFormGuide, setShowWebFormGuide] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const email = official.emails?.[0];
  const hasEmail = !!(email && email.trim().length > 0);
  const hasWebsite = !!(official.primaryUrl || official.urls?.[0]);
  const subject = `Constituent regarding ${official.role}`;
  const mailto = email && draft ? mailtoHref(email, subject, draft) : undefined;
  const canDraft = hasIssue && !draft;

  const copyToClipboard = async () => {
    if (!draft) return;

    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = draft;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Failed to copy text:', e);
      }
      document.body.removeChild(textArea);
    }
  };

  const copyPhoneScript = async () => {
    if (!phoneScript) return;

    try {
      await navigator.clipboard.writeText(phoneScript);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = phoneScript;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } catch (e) {
        console.error('Failed to copy text:', e);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleWebFormContact = async () => {
    if (!draft) return;

    // Auto-copy the draft to clipboard
    try {
      await navigator.clipboard.writeText(draft);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    } catch (err) {
      // Fallback copy method
      const textArea = document.createElement('textarea');
      textArea.value = draft;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 3000);
      } catch (e) {
        console.error('Failed to copy text:', e);
      }
      document.body.removeChild(textArea);
    }

    // Open the contact form in a new tab
    const contactUrl = official.primaryUrl || official.urls?.[0];
    if (contactUrl) {
      // Try common contact page patterns
      const contactPaths = ['/contact', '/contact-me', '/email-me', '/write-your-representative'];
      const baseUrl = contactUrl.endsWith('/') ? contactUrl.slice(0, -1) : contactUrl;

      // Open the base URL with /contact appended
      window.open(baseUrl + '/contact', '_blank', 'noopener,noreferrer');
    }

    // Show the instruction guide
    setShowWebFormGuide(true);
  };

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
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-gray-600">
              {official.role}
              {official.party && <span className="text-gray-500"> · {official.party}</span>}
            </p>
            {canVote && billNumber && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium"
                aria-label="Can vote directly on this bill"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Can vote
              </span>
            )}
            {!hasEmail && draft && hasWebsite && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium"
                aria-label="Contact via web form required"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Uses web form
              </span>
            )}
          </div>
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
        {official.phones?.[0] && (
          <div className="relative group">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 text-sm"
              onClick={async () => {
                if (!hasIssue) return;
                setBusyPhone(true);
                try {
                  await onPhoneScript();
                } finally {
                  setBusyPhone(false);
                }
              }}
              disabled={busyPhone || !!phoneScript || !hasIssue}
              title={!hasIssue ? "Select an issue above to get a call script" : undefined}
            >
              {busyPhone ? "Generating…" : phoneScript ? "✓ Script generated" : "Get call script"}
            </button>
            {!hasIssue && !phoneScript && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                ⬆ Select an issue above first
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        )}
        {hasEmail && mailto && (
          <a
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            href={mailto}
          >
            Send email to {official.name.split(" ")[0]}
          </a>
        )}
        {!hasEmail && draft && hasWebsite && (
          <button
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm inline-flex items-center gap-2"
            onClick={handleWebFormContact}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Contact via web form
          </button>
        )}
      </div>

      {/* Draft Display */}
      {draft && (
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor={`draft-${official.name}`} className="block text-sm font-semibold text-gray-700">
              Your AI-drafted email:
            </label>
            <button
              onClick={copyToClipboard}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                copied
                  ? 'bg-green-50 text-green-700 border border-green-200 focus:ring-green-500'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 focus:ring-blue-500'
              }`}
              aria-label={copied ? 'Email text copied to clipboard' : 'Copy email text to clipboard'}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy text
                </>
              )}
            </button>
          </div>
          <textarea
            id={`draft-${official.name}`}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y leading-relaxed"
            value={draft}
            readOnly
            rows={10}
            onFocus={(e) => e.currentTarget.select()}
          />
          <p className="text-xs text-gray-600 flex items-start gap-1.5">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Click the textarea to select all text, or use the &quot;Copy text&quot; button to copy to your clipboard. You can edit the text before sending.
            </span>
          </p>
        </div>
      )}

      {/* Web Form Contact Instructions */}
      {showWebFormGuide && !hasEmail && draft && hasWebsite && (
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  How to Contact via Web Form
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  Your message has been copied to your clipboard. Follow these steps to complete your contact:
                </p>
                <ol className="text-sm text-blue-900 space-y-2 list-decimal list-inside">
                  <li>A new tab has opened with {official.name.split(" ")[0]}&apos;s contact page</li>
                  <li>Look for the contact form or email option on their website</li>
                  <li>Fill in your personal information (name, email, address)</li>
                  <li>Paste your message into the message field (your draft is already copied!)</li>
                  <li>Review your message and submit the form</li>
                </ol>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-800 flex items-start gap-1.5">
                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span>
                      If the new tab didn&apos;t open or you closed it, you can visit {official.name.split(" ")[0]}&apos;s website using the link above and navigate to their contact page.
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWebFormGuide(false)}
                className="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-1"
                aria-label="Dismiss instructions"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Toast Notification */}
      {showCopyToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium">Message copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* Phone Script Display */}
      {phoneScript && (
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor={`script-${official.name}`} className="block text-sm font-semibold text-gray-700">
              Your call script:
            </label>
            <button
              onClick={copyPhoneScript}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                copiedPhone
                  ? 'bg-green-50 text-green-700 border border-green-200 focus:ring-green-500'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 focus:ring-emerald-500'
              }`}
              aria-label={copiedPhone ? 'Script copied to clipboard' : 'Copy script to clipboard'}
            >
              {copiedPhone ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy script
                </>
              )}
            </button>
          </div>
          <textarea
            id={`script-${official.name}`}
            className="w-full border border-emerald-300 rounded-lg p-3 text-sm text-gray-900 bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-y leading-relaxed"
            value={phoneScript}
            readOnly
            rows={6}
            onFocus={(e) => e.currentTarget.select()}
          />

          {/* Call Guidance */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              Tips for calling
            </h4>
            <ul className="text-sm text-emerald-900 space-y-1.5 list-disc list-inside">
              <li><strong>Best times:</strong> 9am-5pm EST, Tuesday-Thursday</li>
              <li><strong>Keep it brief:</strong> Read your script (30-45 seconds) and thank them</li>
              <li><strong>Be polite:</strong> Office staff are doing their job - respect goes a long way</li>
              <li><strong>If voicemail:</strong> Leave the message - they count voicemails too</li>
              <li><strong>Ask for response:</strong> Request a written response to your concern</li>
            </ul>
            {official.phones?.[0] && (
              <div className="pt-2 border-t border-emerald-200">
                <a
                  href={`tel:${official.phones[0]}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  Call now: {official.phones[0]}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
