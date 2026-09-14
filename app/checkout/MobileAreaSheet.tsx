"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, MapPin, CheckCircle2 } from "lucide-react";

// ---------------------------------------------------------------------
// MobileAreaSheet
// ---------------------------------------------------------------------
// A dedicated, mobile-only searchable bottom sheet for picking a
// predefined delivery area / hotel. It replaces the inline dropdown on
// small screens only — the desktop dropdown in the checkout page is
// completely untouched and this component renders nothing on md+
// screens (see the `md:hidden` on the outer wrapper).
//
// Responsibilities kept intentionally isolated here so the checkout
// page itself stays simple:
//   1. Focus management (auto-focus the search input on open, blur on
//      close so the keyboard actually goes away).
//   2. Body scroll locking while open, restoring the exact scroll
//      position on close.
//   3. Android back-button handling via the History API, so the first
//      back press dismisses the keyboard (native browser behavior when
//      an input still has focus) and only a subsequent back press closes
//      the sheet — without permanently hijacking browser navigation.
//   4. Keyboard-safe layout using dvh + an internally scrollable results
//      list, so the results are never hidden behind the virtual keyboard.
//
// The list of areas, current value, and select handler are all passed
// in as props — this component owns none of the area/hotel data or the
// predefined-list validation logic, which stays exactly where it already
// lived in the checkout page.

interface MobileAreaSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  placeholder: string;
  areas: string[];
  value: string;
  onSelect: (area: string) => void;
}

export default function MobileAreaSheet({
  isOpen,
  onClose,
  title,
  placeholder,
  areas,
  value,
  onSelect,
}: MobileAreaSheetProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Reset the in-sheet search text each time it's opened fresh, so a
  // previous search doesn't linger the next time the user taps the field.
  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  // -----------------------------------------------------------------
  // Focus management — auto-focus the search input once the sheet has
  // finished its slide-in, and make sure it's blurred (keyboard closed)
  // whenever the sheet leaves the DOM/hides.
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [isOpen]);

  // -----------------------------------------------------------------
  // Body scroll lock — prevents the checkout page underneath from
  // scrolling while the sheet is open, and restores the exact scroll
  // position it was at once the sheet closes.
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // -----------------------------------------------------------------
  // Android back-button handling
  // -----------------------------------------------------------------
  // We push exactly one history entry while the sheet is open. A
  // popstate event (fired by the hardware/gesture back button) then
  // means "the user wants to go back one step" — but if the search
  // input still has focus we treat that step as "dismiss the keyboard"
  // and re-arm the history entry, so a second press is required to
  // actually close the sheet. This never touches navigation once the
  // sheet is closed, and it never registers more than one extra entry.
  const consumedByUsRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ mbAreaSheet: true }, "");

    const handlePopState = () => {
      if (document.activeElement === inputRef.current) {
        // First back press while typing: just drop the keyboard, keep
        // the sheet open, and re-arm one history entry for next time.
        inputRef.current?.blur();
        window.history.pushState({ mbAreaSheet: true }, "");
        return;
      }
      consumedByUsRef.current = true;
      onClose();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Programmatic close (X button, backdrop tap, selecting an area).
  // Routes through history.back() so the entry we pushed on open is
  // always cleanly popped — keeping the back-button behavior identical
  // no matter how the sheet was dismissed.
  const closeSheet = useCallback(() => {
    inputRef.current?.blur();
    if (window.history.state?.mbAreaSheet && !consumedByUsRef.current) {
      window.history.back();
    } else {
      consumedByUsRef.current = false;
      onClose();
    }
  }, [onClose]);

  // Escape key closes the sheet too (keyboard accessibility on devices
  // with a physical/attached keyboard).
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeSheet]);

  if (!isOpen) return null;

  const filtered = areas.filter((a) =>
    a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[999] flex flex-col justify-end md:hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-in fade-in duration-200"
        onClick={closeSheet}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        style={{ height: "96dvh", maxHeight: "96dvh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1 shrink-0">
          <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 shrink-0 border-b border-gray-100">
          <h2 className="font-black uppercase text-[13px] tracking-widest text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={closeSheet}
            aria-label="Close"
            className="p-2 -mr-2 rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search input */}
        <div className="px-5 py-3 shrink-0">
          <label htmlFor="mb-area-search" className="sr-only">
            {placeholder}
          </label>
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="mb-area-search"
              ref={inputRef}
              type="text"
              inputMode="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Results — scrolls internally, always stays above the keyboard */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-2"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {filtered.length > 0 ? (
            filtered.map((loc) => {
              const selected = loc === value;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    onSelect(loc);
                    closeSheet();
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-colors min-h-[44px] ${
                    selected
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-700 active:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <MapPin
                      size={15}
                      className={selected ? "text-purple-600 shrink-0" : "text-gray-300 shrink-0"}
                    />
                    <span className="truncate">{loc}</span>
                  </span>
                  {selected && (
                    <CheckCircle2 size={16} className="text-purple-600 shrink-0" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-4 py-10 text-center text-sm font-medium text-gray-500">
              <span className="block text-2xl mb-2">🤔</span>
              No matching locations found.
              <br />
              Check your spelling!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}