// components/MaintenanceGate.tsx
import type { ReactNode } from "react";

// ---- CONFIG ----------------------------------------------------------
// Set to true to show the maintenance screen on every page.
// Set to false to show your site normally.
const MAINTENANCE_MODE = true;
// -----------------------------------------------------------------------

export default function MaintenanceGate({ children }: { children: ReactNode }) {
  if (!MAINTENANCE_MODE) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 via-white to-purple-50 px-4 py-8">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-300 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-400 opacity-20 blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-3xl bg-white/90 backdrop-blur shadow-2xl shadow-purple-200 border border-purple-100 px-6 py-10 sm:px-10 sm:py-12 text-center">
        {/* Icon circle */}
        <div className="mx-auto mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg shadow-purple-300">
          <span className="text-4xl sm:text-5xl">🛠️</span>
        </div>

        {/* Tag */}
        <p className="text-purple-500 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-2">
          Scheduled Maintenance
        </p>

        {/* Main heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
          Server Maintenance
        </h1>

        {/* Sub heading */}
        <p className="text-base sm:text-lg font-semibold text-purple-600 mb-3">
          We will be back soon
        </p>

        {/* Body */}
        <p className="text-gray-500 text-sm sm:text-base mb-7 leading-relaxed">
          Our website is temporarily closed today for scheduled maintenance. Please come back later to order your food.
        </p>

        {/* Time badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 shadow-md shadow-purple-300">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-white text-xs sm:text-sm font-semibold">
            Closed from 1 PM to 12 AM
          </span>
        </div>

        {/* Footer */}
        <p className="text-purple-400 text-xs sm:text-sm mt-7">
          Thank you for your patience 💜
        </p>
      </div>
    </div>
  );
}
