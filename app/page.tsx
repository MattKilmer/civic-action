"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TopNav from "./components/TopNav";
import Footer from "./components/Footer";
import AddressForm from "./components/AddressForm";
import LocationStatus from "./components/LocationStatus";
import IssuePicker, { type Issue } from "./components/IssuePicker";
import OfficialsList from "./components/OfficialsList";

type Official = {
  name: string; role: string; party?: string; phones: string[]; emails: string[]; urls: string[]; photoUrl?: string; primaryUrl?: string;
};

export default function Page() {
  const searchParams = useSearchParams();
  const [officials, setOfficials] = useState<Official[] | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedAddress, setSubmittedAddress] = useState<string | null>(null);
  const [location, setLocation] = useState<{ city?: string; state?: string; district?: string } | null>(null);
  const [initialBillNumber, setInitialBillNumber] = useState<string | null>(null);
  const [initialBillTitle, setInitialBillTitle] = useState<string | null>(null);
  const addressFormRef = useRef<HTMLElement>(null);
  const issuePickerRef = useRef<HTMLElement>(null);

  // Check for bill number and title in URL params and scroll to issue picker
  useEffect(() => {
    const billParam = searchParams.get('bill');
    const titleParam = searchParams.get('billTitle');

    if (billParam) {
      setInitialBillNumber(billParam);
      if (titleParam) {
        setInitialBillTitle(titleParam);
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
    // Reset state and scroll to address form
    setSubmittedAddress(null);
    setOfficials(null);
    setLocation(null);
    setIssue(null);
    addressFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <TopNav />
      <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
        {/* Page Header */}
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Take action with your representatives
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl">
            Enter your address to see your elected officials from local to federal level, then generate a respectful email to contact them.
          </p>
        </header>

        {/* Address Form Section */}
        <section ref={addressFormRef} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <AddressForm onSubmit={fetchOfficials} />
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
        <section ref={issuePickerRef} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              Choose your issue & stance
            </h2>
          </div>
          <IssuePicker onChange={(v) => setIssue(v)} initialBillNumber={initialBillNumber} initialBillTitle={initialBillTitle} />
        </section>

        {/* Officials List Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
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
      </div>
    </main>
    <Footer />
  </>
  );
}
