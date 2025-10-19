"use client";

import { useState } from "react";
import TopNav from "./components/TopNav";
import Footer from "./components/Footer";
import AddressForm from "./components/AddressForm";
import IssuePicker, { type Issue } from "./components/IssuePicker";
import OfficialsList from "./components/OfficialsList";

type Official = {
  name: string; role: string; party?: string; phones: string[]; emails: string[]; urls: string[]; photoUrl?: string; primaryUrl?: string;
};

export default function Page() {
  const [officials, setOfficials] = useState<Official[] | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ city?: string; state?: string }>({ city: "San Francisco", state: "California" });

  async function fetchOfficials(address: string) {
    setLoading(true);
    setOfficials(null);
    try {
      const r = await fetch(`/api/reps?address=${encodeURIComponent(address)}`, { cache: "no-store" });
      const json = await r.json();
      if (json.officials) {
        setOfficials(json.officials);
      } else {
        setOfficials([]);
      }
    } finally {
      setLoading(false);
    }
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
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <AddressForm onSubmit={fetchOfficials} />
        </section>

        {/* Issue Picker Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              Choose your issue & stance
            </h2>
          </div>
          <IssuePicker onChange={(v) => setIssue(v)} />
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

          {loading && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-3 text-gray-600">Loading your officials…</p>
            </div>
          )}

          {!loading && officials && issue && (
            <OfficialsList officials={officials} issue={issue} location={location} />
          )}

          {!loading && officials && !issue && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
              <p className="text-blue-900 font-medium">
                👆 Select an issue and stance above to start drafting emails to your representatives.
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
