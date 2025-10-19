"use client";
import { useState } from "react";

export default function AddressForm({ onSubmit }: { onSubmit: (address: string) => void }) {
  const [address, setAddress] = useState("");
  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        className="flex flex-col sm:flex-row gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (address.trim().length < 5) return;
          onSubmit(address.trim());
        }}
      >
        <div className="flex-1">
          <label htmlFor="address-input" className="block font-semibold text-gray-700 mb-1 text-sm">
            Your Address
          </label>
          <input
            id="address-input"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your address (e.g., San Francisco, CA)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <p className="text-sm text-gray-600 mt-1">
            Your address is never stored. We only use it to find your representatives.
          </p>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={address.trim().length < 5}
          >
            Find officials
          </button>
        </div>
      </form>
    </div>
  );
}
