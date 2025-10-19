"use client";
import { useState } from "react";

export default function AddressForm({ onSubmit }: { onSubmit: (address: string) => void }) {
  const [address, setAddress] = useState("");
  return (
    <form
      className="w-full max-w-2xl mx-auto flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (address.trim().length < 5) return;
        onSubmit(address.trim());
      }}
    >
      <input
        className="flex-1 border rounded-2xl px-4 py-3 outline-none focus:ring text-gray-900 bg-white"
        placeholder="Enter your full street address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button className="px-4 py-3 rounded-2xl bg-black text-white">Find officials</button>
    </form>
  );
}
