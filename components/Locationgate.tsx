// components/LocationGate.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { MapPin } from "lucide-react";
import { useUserLocation } from "@/contexts/LocationContext";

export default function LocationGate({ children }: { children: ReactNode }) {
  const { status, permissionChecked, requestLocation } = useUserLocation();

  // Purely in-memory — resets on every mount/refresh by design.
  // This is what makes "Cancel" ask again next time, instead of sticking
  // like the old sessionStorage flag did.
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Render only when nothing has happened yet: permission is known
  // (permissionChecked) and status is still "idle" — meaning no prior
  // grant, denial, or in-flight request exists. We deliberately check
  // for "idle" rather than excluding "granted"/"denied"/"unsupported",
  // because a pre-granted permission passes through a "loading" status
  // (waiting on the first watchPosition fix) before it ever reaches
  // "granted" — excluding statuses one-by-one would let that gap through
  // and cause a blink. "loading" always means a request is already in
  // flight (auto-started from a past grant, or just kicked off by the
  // user tapping Allow), so it should never trigger the popup.
  const shouldRender = permissionChecked && status === "idle" && !dismissed;

  useEffect(() => {
    if (shouldRender) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
  }, [shouldRender]);

  function dismiss() {
    setVisible(false);
    setTimeout(() => setDismissed(true), 200);
  }

  function handleAllow() {
    // Runs synchronously inside a real tap — required for the native
    // permission prompt to actually appear on mobile Safari/Chrome.
    requestLocation();
    dismiss();
  }

  return (
    <>
      {/* Site content sits underneath but is inert while the gate is up —
          it's blocked visually (blur) and by the overlay capturing clicks,
          not literally unmounted, so nothing has to remount when it closes. */}
      <div className={shouldRender ? "pointer-events-none" : ""}>{children}</div>

      {shouldRender && (
        <div
          className={`fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-6 transition-opacity duration-200 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl transition-all duration-200 ${
              visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-50">
              <MapPin size={26} className="text-purple-600" strokeWidth={2.5} />
            </div>

            <h2 className="mb-1.5 text-base font-black text-gray-900">
              Allow Location Access
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Meal Bear Skardu wants to use your location.
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={dismiss}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAllow}
                className="flex-1 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white transition-colors hover:bg-purple-700 active:scale-[0.98]"
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}