// app/ride-parcel/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import RideParcelForm from "@/components/RideParcelDrawer";

export default function RideParcelPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-6 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">
          Ride & Parcel
        </h1>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        <RideParcelForm />
      </div>
    </main>
  );
}