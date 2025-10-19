"use client";

import { useState } from "react";
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
  const [location, setLocation] = useState<{ city?: string; state?: string }>({});

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
    <main className="min-h-screen p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Take action with your representatives</h1>
      <p className="text-gray-600">Enter your address to see your elected officials from local to federal, then generate a respectful email to contact them.</p>

      <AddressForm onSubmit={fetchOfficials} />

      <div className="border-t pt-6 space-y-6">
        <h2 className="text-xl font-semibold">1) Choose your issue & stance</h2>
        <IssuePicker onChange={(v) => setIssue(v)} />
      </div>

      <div className="border-t pt-6 space-y-6">
        <h2 className="text-xl font-semibold">2) Contact your officials</h2>
        {loading && <div>Loading your officials…</div>}
        {!loading && officials && issue && (
          <OfficialsList officials={officials} issue={issue} location={location} />
        )}
        {!loading && officials && !issue && <div className="text-gray-600">Pick an issue above to enable drafting.</div>}
      </div>
    </main>
  );
}
