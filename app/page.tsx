"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopNav from "./components/TopNav";
import Footer from "./components/Footer";
import AddressForm from "./components/AddressForm";
import LocationStatus from "./components/LocationStatus";
import IssuePicker, { type Issue } from "./components/IssuePicker";
import OfficialsList from "./components/OfficialsList";
import { loadSession, saveSession, clearSession } from "./lib/sessionStorage";

type Official = {
  name: string; role: string; party?: string; phones: string[]; emails: string[]; urls: string[]; photoUrl?: string; primaryUrl?: string;
};

function PageContent() {
  const searchParams = useSearchParams();
  const [officials, setOfficials] = useState<Official[] | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedAddress, setSubmittedAddress] = useState<string | null>(null);
  const [location, setLocation] = useState<{ city?: string; state?: string; district?: string } | null>(null);
  const [initialBillNumber, setInitialBillNumber] = useState<string | null>(null);
  const [initialBillTitle, setInitialBillTitle] = useState<string | null>(null);
  const [initialBillSummary, setInitialBillSummary] = useState<string | null>(null);
  const [initialBillCongress, setInitialBillCongress] = useState<string | null>(null);
  const [initialBillType, setInitialBillType] = useState<string | null>(null);
  const [initialBillJurisdiction, setInitialBillJurisdiction] = useState<string | null>(null);
  const [initialBillSession, setInitialBillSession] = useState<string | null>(null);
  const addressFormRef = useRef<HTMLElement>(null);
  const issuePickerRef = useRef<HTMLElement>(null);

  // Load session data on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setSubmittedAddress(session.address);
      setOfficials(session.officials);
      setLocation(session.location);
    }
  }, []);

  // Save session data whenever address, officials, or location changes
  useEffect(() => {
    if (submittedAddress && officials) {
      saveSession({
        address: submittedAddress,
        officials,
        location,
      });
    }
  }, [submittedAddress, officials, location]);

  // Check for bill number and title in URL params and scroll to issue picker
  useEffect(() => {
    const billParam = searchParams.get('bill');
    const titleParam = searchParams.get('billTitle');
    const summaryParam = searchParams.get('billSummary');
    const congressParam = searchParams.get('billCongress');
    const typeParam = searchParams.get('billType');
    const jurisdictionParam = searchParams.get('billJurisdiction'); // State bills
    const sessionParam = searchParams.get('billSession'); // State bills

    if (billParam) {
      setInitialBillNumber(billParam);
      if (titleParam) {
        setInitialBillTitle(titleParam);
      }
      if (summaryParam) {
        setInitialBillSummary(summaryParam);
      }
      if (congressParam) {
        setInitialBillCongress(congressParam);
      }
      if (typeParam) {
        setInitialBillType(typeParam);
      }
      if (jurisdictionParam) {
        setInitialBillJurisdiction(jurisdictionParam);
      }
      if (sessionParam) {
        setInitialBillSession(sessionParam);
      }
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        issuePickerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [searchParams]);

  async function fetchOfficials(address: string) {
    setLoading(true);
    setOfficials(null);
    setSubmittedAddress(address);
    try {
      const r = await fetch(`/api/reps?address=${encodeURIComponent(address)}`, { cache: "no-store" });
      const json = await r.json();
      if (json.officials) {
        setOfficials(json.officials);
        // Extract location info from API response (5 Calls API returns location, state, district)
        setLocation({
          city: json.location || address,
          state: json.state,
          district: json.district,
        });
      } else {
        setOfficials([]);
        setLocation(null);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleEditAddress() {
    // Clear session storage and reset state
    clearSession();
    setSubmittedAddress(null);
    setOfficials(null);
    setLocation(null);
    setIssue(null);
    addressFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <TopNav />
      <main className="min-h-screen">
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
        {/* Page Header - Asymmetric Layout */}
        <header className="animate-fade-up-1 relative">
          <div className="grid md:grid-cols-[2fr,1fr] gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight">
                Take action with your representatives
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Enter your address to see your elected officials from local to federal level, then generate a respectful email to contact them.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">100% Free</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">No data stored</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">Nonpartisan</span>
                </div>
              </div>
            </div>
            {/* Decorative Element - Hidden on mobile */}
            <div className="hidden md:block opacity-10 absolute right-0 top-1/2 -translate-y-1/2 -z-10">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 20L180 60V140L100 180L20 140V60L100 20Z" stroke="#2563eb" strokeWidth="2" fill="#2563eb" fillOpacity="0.05"/>
                <circle cx="100" cy="100" r="40" stroke="#2563eb" strokeWidth="2" fill="#2563eb" fillOpacity="0.05"/>
              </svg>
            </div>
          </div>
        </header>

        {/* Address Form Section */}
        <section ref={addressFormRef} className="card-elevated rounded-2xl p-6 md:p-8 space-y-4 animate-fade-up-2">
          <div className="flex items-center gap-3">
            <div className="step-badge-gradient w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <h2 className="text-xl md:text-2xl text-gray-900">
              Enter your address
            </h2>
          </div>
          <AddressForm onSubmit={fetchOfficials} defaultValue={submittedAddress} />
        </section>

        {/* Location Status */}
        {submittedAddress && (
          <LocationStatus
            address={submittedAddress}
            loading={loading}
            location={location || undefined}
            onEdit={handleEditAddress}
          />
        )}

        {/* Issue Picker Section */}
        <section ref={issuePickerRef} className="card-elevated rounded-2xl p-6 md:p-8 space-y-4 animate-fade-up-3">
          <div className="flex items-center gap-3">
            <div className="step-badge-gradient w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <h2 className="text-xl md:text-2xl text-gray-900">
              Choose your issue & stance
            </h2>
          </div>
          <IssuePicker
            onChange={(v) => setIssue(v)}
            initialBillNumber={initialBillNumber}
            initialBillTitle={initialBillTitle}
            initialBillSummary={initialBillSummary}
            initialBillCongress={initialBillCongress}
            initialBillType={initialBillType}
            initialBillJurisdiction={initialBillJurisdiction}
            initialBillSession={initialBillSession}
            userState={location?.state}
          />
        </section>

        {/* Officials List Section - Only show after address is submitted */}
        {submittedAddress && (
          <section className="space-y-4 animate-fade-up-4">
            <div className="flex items-center gap-3">
              <div className="step-badge-gradient w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <h2 className="text-xl md:text-2xl text-gray-900">
                Contact your officials
              </h2>
            </div>

            {officials && officials.length > 0 && (
              <OfficialsList officials={officials} issue={issue} location={location || undefined} />
            )}

            {officials && officials.length === 0 && !loading && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                <p className="text-amber-900 font-medium">
                  No officials found for this location. Please try a different address.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
    <Footer />
  </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <PageContent />
    </Suspense>
  );
}
