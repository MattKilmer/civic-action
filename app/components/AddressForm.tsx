"use client";
import { useState, useEffect } from "react";

export default function AddressForm({ onSubmit, defaultValue }: { onSubmit: (address: string) => void; defaultValue?: string | null }) {
  const [address, setAddress] = useState(defaultValue || "");

  // Update address when defaultValue changes (e.g., when loaded from session)
  useEffect(() => {
    if (defaultValue) {
      setAddress(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (address.trim().length < 5) return;
          onSubmit(address.trim());
        }}
      >
        <div>
          <label htmlFor="address-input" className="block font-semibold text-gray-700 mb-2 text-sm">
            Your Address
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="address-input"
              type="text"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your full address (e.g., 123 Main St, Brooklyn, NY)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
              disabled={address.trim().length < 5}
            >
              Find officials
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Your address is never stored—we only use it to find your representatives. For best results, enter a full street address; zip codes alone may be less accurate.
          </p>
        </div>
      </form>
    </div>
  );
}
