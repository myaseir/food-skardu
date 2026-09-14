// components/RideParcelForm.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Bike,
  Package,
  MapPin,
  Phone,
  User,
  ArrowRight,
  CircleDot,
  Check,
  Loader2,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  X,
  Sparkles,
  Building2,
  LandPlot,
  ChevronRight,
  Home,
} from "lucide-react";
import {
  SKARDU_AREAS,
  SKARDU_HOTELS,
} from "@/data/location";

import { useUserLocation } from "@/contexts/LocationContext";

type SubmitStatus = "idle" | "sending" | "error";

type Mode = "ride" | "parcel";
type Field = "pickup" | "dropoff";
type LocationCategory = "area" | "hotel";
// A valid location name is any key in either SKARDU_AREAS or SKARDU_HOTELS,
// OR any free-text location the person typed in themselves.
// (Deliberately plain `string`, not `keyof typeof SKARDU_AREAS` — that
// widens to include `symbol` for index-signature types, which then breaks
// rendering the value directly as JSX text.)
type Area = string;

type LocationOption = { name: string; category: LocationCategory };

// Combined directory of every known area + hotel, built once at module
// scope. Both the desktop combobox and the mobile bottom sheet search
// across this same directory, grouped by category, so the two surfaces
// never drift out of sync with each other.
const ALL_AREAS: LocationOption[] = Object.keys(SKARDU_AREAS)
  .map((name) => ({ name, category: "area" as const }))
  .sort((a, b) => a.name.localeCompare(b.name));

const ALL_HOTELS: LocationOption[] = Object.keys(SKARDU_HOTELS)
  .map((name) => ({ name, category: "hotel" as const }))
  .sort((a, b) => a.name.localeCompare(b.name));

const KNOWN_LOCATION_NAMES = new Set([...ALL_AREAS, ...ALL_HOTELS].map((l) => l.name));
const TOTAL_LOCATION_COUNT = ALL_AREAS.length + ALL_HOTELS.length;

type BookingSummary = {
  mode: Mode;
  pickupArea: Area;
  pickupAddress: string;
  dropoffArea: Area;
  dropoffAddress: string;
  riderName: string;
  riderPhone: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
};

function matchAndSort(list: LocationOption[], needle: string): LocationOption[] {
  if (!needle) return list;
  return list
    .filter((o) => o.name.toLowerCase().includes(needle))
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(needle) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(needle) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.name.localeCompare(b.name);
    });
}

function findExactMatch(needle: string): LocationOption | undefined {
  if (!needle) return undefined;
  return [...ALL_AREAS, ...ALL_HOTELS].find((o) => o.name.toLowerCase() === needle);
}

/**
 * Searchable location picker — desktop version.
 *
 * Typing filters the combined area + hotel directory live. Results are
 * grouped under sticky "Areas" / "Hotels" headers so the full, unlimited
 * list stays navigable instead of turning into one long undifferentiated
 * scroll. If nothing in the directory matches what was typed, an extra
 * row lets the person use their own text as a custom location (e.g. a
 * village or street the directory doesn't have yet) — pricing is handled
 * manually over WhatsApp regardless of whether the location is known.
 */
function AreaCombobox({
  value,
  onChange,
  isOpen,
  onOpen,
  onClose,
  placeholder,
  label,
}: {
  value: Area;
  onChange: (a: Area) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  placeholder: string;
  label: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(value);

  useEffect(() => {
    if (!isOpen) setQuery(value);
  }, [value, isOpen]);

  const trimmed = query.trim();
  const trimmedLower = trimmed.toLowerCase();

  const matchedAreas = useMemo(() => matchAndSort(ALL_AREAS, trimmedLower), [trimmedLower]);
  const matchedHotels = useMemo(() => matchAndSort(ALL_HOTELS, trimmedLower), [trimmedLower]);
  const totalMatches = matchedAreas.length + matchedHotels.length;

  const exactMatch = useMemo(() => findExactMatch(trimmedLower), [trimmedLower]);
  const showCustomOption = trimmed.length > 0 && !exactMatch;

  function selectOption(name: string) {
    setQuery(name);
    onChange(name);
    onClose();
  }

  function useCustomLocation() {
    if (!trimmed) return;
    setQuery(trimmed);
    onChange(trimmed);
    onClose();
  }

  function commitAndClose() {
    if (trimmed) {
      if (trimmed !== value) onChange(trimmed);
    } else if (value) {
      onChange("");
    }
    onClose();
  }

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        commitAndClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") commitAndClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, trimmed, value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!trimmed) return;
      if (exactMatch) selectOption(exactMatch.name);
      else useCustomLocation();
    }
  }

  function renderGroup(items: LocationOption[], icon: React.ReactNode, groupLabel: string) {
    if (items.length === 0) return null;
    return (
      <div>
        <div className="sticky top-0 z-10 flex items-center gap-1.5 bg-white/95 px-3.5 py-1.5 backdrop-blur-sm">
          {icon}
          <span className="text-[10px] font-semibold tracking-wide text-gray-400">
            {groupLabel} · {items.length}
          </span>
        </div>
        {items.map((opt) => {
          const selected = opt.name === value;
          return (
            <button
              key={opt.name}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => selectOption(opt.name)}
              className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm transition-colors ${
                selected
                  ? "bg-purple-50 font-semibold text-purple-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="truncate">{opt.name}</span>
              {selected && <Check size={14} className="shrink-0 text-purple-600" />}
            </button>
          );
        })}
      </div>
    );
  }

  const isCustomSelected = value !== "" && !KNOWN_LOCATION_NAMES.has(value);

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <div
        className={`flex items-center gap-2.5 rounded-xl border bg-gray-50 px-3.5 py-3 transition-colors ${
          isOpen ? "border-purple-400 ring-2 ring-purple-100" : "border-gray-200"
        }`}
      >
        <Search size={15} strokeWidth={2.25} className="shrink-0 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? query : value}
          onFocus={() => {
            onOpen();
            requestAnimationFrame(() => inputRef.current?.select());
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) onOpen();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          aria-label={label}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
        />
        {isCustomSelected && !isOpen && (
          <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
            Custom
          </span>
        )}
        {(isOpen ? query : value) && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Clear ${label.toLowerCase()}`}
            onClick={() => {
              setQuery("");
              onChange("");
              inputRef.current?.focus();
            }}
            className="shrink-0 text-gray-300 transition-colors hover:text-gray-500"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-2xl border border-gray-100 bg-white py-1 shadow-xl shadow-gray-300/40 sm:max-h-80"
          role="listbox"
        >
          {totalMatches === 0 && !showCustomOption ? (
            <div className="px-4 py-6 text-center">
              <span className="mb-1.5 block text-xl">🤔</span>
              <p className="text-sm font-semibold text-gray-500">No matches yet</p>
              <p className="mt-0.5 text-xs text-gray-400">Keep typing to search areas &amp; hotels.</p>
            </div>
          ) : (
            <>
              {renderGroup(
                matchedAreas,
                <LandPlot size={11} strokeWidth={2.5} className="text-gray-300" />,
                "Areas"
              )}
              {renderGroup(
                matchedHotels,
                <Building2 size={11} strokeWidth={2.5} className="text-blue-300" />,
                "Hotels"
              )}
              {showCustomOption && (
                <div className="sticky bottom-0 border-t border-dashed border-gray-100 bg-white">
                  <button
                    type="button"
                    onClick={useCustomLocation}
                    className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-50"
                  >
                    <Plus size={14} strokeWidth={2.5} className="shrink-0" />
                    <span className="truncate">
                      Use &ldquo;{trimmed}&rdquo; as a custom location
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Mobile location picker — bottom sheet.
 *
 * Same directory, grouping, and "custom location" fallback as the
 * desktop combobox above, but presented full-screen: a slide-up sheet
 * with its own sticky search bar, internally-scrolling grouped results,
 * body scroll lock, and Android back-button handling (first back press
 * drops the keyboard, second press closes the sheet).
 */
function AreaMobileSheet({
  isOpen,
  onClose,
  label,
  placeholder,
  value,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  placeholder: string;
  value: Area;
  onSelect: (a: Area) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const consumedByUsRef = useRef(false);

  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Body scroll lock — restores exact scroll position on close.
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

  // Android back-button handling: first press dismisses the keyboard,
  // second press closes the sheet.
  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ mbAreaSheet: true }, "");
    const handlePopState = () => {
      if (document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        window.history.pushState({ mbAreaSheet: true }, "");
        return;
      }
      consumedByUsRef.current = true;
      onClose();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const closeSheet = useCallback(() => {
    inputRef.current?.blur();
    if (window.history.state?.mbAreaSheet && !consumedByUsRef.current) {
      window.history.back();
    } else {
      consumedByUsRef.current = false;
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeSheet]);

  if (!isOpen) return null;

  const trimmed = query.trim();
  const trimmedLower = trimmed.toLowerCase();
  const matchedAreas = matchAndSort(ALL_AREAS, trimmedLower);
  const matchedHotels = matchAndSort(ALL_HOTELS, trimmedLower);
  const totalMatches = matchedAreas.length + matchedHotels.length;
  const exactMatch = findExactMatch(trimmedLower);
  const showCustomOption = trimmed.length > 0 && !exactMatch;

  function selectOption(name: string) {
    onSelect(name);
    closeSheet();
  }

  function useCustomLocation() {
    if (!trimmed) return;
    onSelect(trimmed);
    closeSheet();
  }

  function renderGroup(items: LocationOption[], icon: React.ReactNode, groupLabel: string) {
    if (items.length === 0) return null;
    return (
      <div>
        <div className="sticky top-0 z-10 flex items-center gap-1.5 bg-white/95 px-4 py-2 backdrop-blur-sm">
          {icon}
          <span className="text-[10px] font-semibold tracking-wide text-gray-400">
            {groupLabel} · {items.length}
          </span>
        </div>
        {items.map((opt) => {
          const selected = opt.name === value;
          return (
            <button
              key={opt.name}
              type="button"
              onClick={() => selectOption(opt.name)}
              className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-colors ${
                selected
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-700 active:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                {opt.category === "hotel" ? (
                  <Building2 size={15} className={selected ? "shrink-0 text-purple-600" : "shrink-0 text-blue-300"} />
                ) : (
                  <LandPlot size={15} className={selected ? "shrink-0 text-purple-600" : "shrink-0 text-gray-300"} />
                )}
                <span className="truncate">{opt.name}</span>
              </span>
              {selected && <CheckCircle2 size={16} className="shrink-0 text-purple-600" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-[999] flex flex-col justify-end md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200" onClick={closeSheet} />

      {/* Sheet */}
      <div
        className="relative flex flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-300"
        style={{ height: "94dvh", maxHeight: "94dvh" }}
      >
        {/* Drag handle */}
        <div className="flex shrink-0 justify-center pb-1 pt-2.5">
          <div className="h-1.5 w-10 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-5 pb-3 pt-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50">
              <MapPin size={15} className="text-purple-600" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-bold text-gray-900">{label}</h2>
              <p className="text-[11px] font-medium text-gray-400">
                {TOTAL_LOCATION_COUNT} locations · Areas &amp; hotels
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSheet}
            aria-label="Close"
            className="-mr-2 shrink-0 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search input */}
        <div className="shrink-0 px-5 py-3">
          <label htmlFor={`mb-search-${label}`} className="sr-only">
            {placeholder}
          </label>
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id={`mb-search-${label}`}
              ref={inputRef}
              type="text"
              inputMode="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-10 text-sm font-medium text-gray-800 transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-2"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {totalMatches === 0 && !showCustomOption ? (
            <div className="px-4 py-12 text-center">
              <span className="mb-2 block text-3xl">🤔</span>
              <p className="text-sm font-semibold text-gray-600">No matching locations found.</p>
              <p className="mt-1 text-xs text-gray-400">Check your spelling, or try a nearby landmark.</p>
            </div>
          ) : (
            <>
              {renderGroup(matchedAreas, <LandPlot size={11} strokeWidth={2.5} className="text-gray-300" />, "Areas")}
              {renderGroup(matchedHotels, <Building2 size={11} strokeWidth={2.5} className="text-blue-300" />, "Hotels")}
              {showCustomOption && (
                <div className="sticky bottom-0 mt-1 border-t border-dashed border-gray-100 bg-white px-1 pb-1 pt-1">
                  <button
                    type="button"
                    onClick={useCustomLocation}
                    className="flex min-h-[48px] w-full items-center gap-2.5 rounded-xl px-3.5 py-3.5 text-left text-sm font-semibold text-purple-700 transition-colors active:bg-purple-50"
                  >
                    <Plus size={16} strokeWidth={2.5} className="shrink-0" />
                    <span className="truncate">
                      Use &ldquo;{trimmed}&rdquo; as a custom location
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Responsive wrapper around a single pickup/dropoff field: renders the
 * desktop searchable combobox on md+ screens, and a tappable field that
 * opens the mobile bottom sheet on small screens. Both surfaces are
 * styled as the same boxed input, so a location field never looks like
 * a different kind of control than the address field beneath it.
 */
function LocationField({
  field,
  label,
  value,
  onChange,
  placeholder,
  openField,
  setOpenField,
  mobileSheetField,
  setMobileSheetField,
}: {
  field: Field;
  label: string;
  value: Area;
  onChange: (a: Area) => void;
  placeholder: string;
  openField: Field | null;
  setOpenField: React.Dispatch<React.SetStateAction<Field | null>>;
  mobileSheetField: Field | null;
  setMobileSheetField: (f: Field | null) => void;
}) {
  const isCustomSelected = value !== "" && !KNOWN_LOCATION_NAMES.has(value);

  return (
    <>
      {/* Desktop: inline searchable combobox */}
      <div className="hidden md:block">
        <AreaCombobox
          label={label}
          value={value}
          onChange={onChange}
          isOpen={openField === field}
          onOpen={() => setOpenField(field)}
          onClose={() => setOpenField((f) => (f === field ? null : f))}
          placeholder={placeholder}
        />
      </div>

      {/* Mobile: tap to open bottom sheet — styled to match the boxed
          input look used everywhere else, so it doesn't read as a
          different kind of control than the address field below it. */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileSheetField(field)}
          className="flex w-full items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-left transition-colors active:bg-gray-100"
        >
          <Search size={15} strokeWidth={2.25} className="shrink-0 text-gray-400" />
          <span
            className={`min-w-0 flex-1 truncate text-sm ${
              value ? "font-medium text-gray-900" : "text-gray-400"
            }`}
          >
            {value || placeholder}
          </span>
          {isCustomSelected && (
            <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
              Custom
            </span>
          )}
          <ChevronRight size={15} strokeWidth={2.5} className="shrink-0 text-gray-300" />
        </button>
      </div>

      <AreaMobileSheet
        isOpen={mobileSheetField === field}
        onClose={() => setMobileSheetField(null)}
        label={label}
        placeholder={placeholder}
        value={value}
        onSelect={onChange}
      />
    </>
  );
}

/**
 * One stop in the route: the icon marker + its "Pickup"/"Drop-off"
 * label, the location field, and the optional address details field —
 * grouped together with even spacing so the two inputs read as one
 * unit instead of competing for space.
 */
function RouteStop({
  icon,
  label,
  field,
  area,
  onAreaChange,
  address,
  onAddressChange,
  openField,
  setOpenField,
  mobileSheetField,
  setMobileSheetField,
}: {
  icon: React.ReactNode;
  label: string;
  field: Field;
  area: Area;
  onAreaChange: (a: Area) => void;
  address: string;
  onAddressChange: (a: string) => void;
  openField: Field | null;
  setOpenField: React.Dispatch<React.SetStateAction<Field | null>>;
  mobileSheetField: Field | null;
  setMobileSheetField: (f: Field | null) => void;
}) {
  return (
    <div className="flex gap-3.5">
      <div className="flex w-5 shrink-0 flex-col items-center pt-3">{icon}</div>
      <div className="min-w-0 flex-1 space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <LocationField
          field={field}
          label={label}
          value={area}
          onChange={onAreaChange}
          placeholder="Search area or hotel..."
          openField={openField}
          setOpenField={setOpenField}
          mobileSheetField={mobileSheetField}
          setMobileSheetField={setMobileSheetField}
        />
        <div className="flex items-center gap-2.5 rounded-xl border border-transparent bg-gray-50/70 px-3.5 py-2.5 transition-colors focus-within:border-purple-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-100">
          <Home size={14} strokeWidth={2.25} className="shrink-0 text-gray-300" />
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="House #, landmark, street... (optional)"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-gray-600 placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * One name + phone row, used inside the contact card. Sharing one row
 * component keeps ride mode's single contact and courier mode's two
 * contacts visually identical instead of drifting into separate styles.
 */
function ContactRow({
  title,
  name,
  onNameChange,
  phone,
  onPhoneChange,
}: {
  title: string;
  name: string;
  onNameChange: (v: string) => void;
  phone: string;
  onPhoneChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          <User size={11} /> {title} Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Full name"
          className="mt-1.5 w-full min-w-0 text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-300 focus:outline-none"
        />
      </div>
      <div className="min-w-0">
        <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          <Phone size={11} /> {title} Phone
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="03xx-xxxxxxx"
          className="mt-1.5 w-full min-w-0 text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-300 focus:outline-none"
        />
      </div>
    </div>
  );
}

export default function RideParcelForm() {
  const [mode, setMode] = useState<Mode>("ride");

  const [pickupArea, setPickupArea] = useState<Area>("");
  const [pickupAddress, setPickupAddress] = useState("");

  const [dropoffArea, setDropoffArea] = useState<Area>("");
  const [dropoffAddress, setDropoffAddress] = useState("");

  // Ride mode needs a single contact name + number; courier keeps
  // sender + receiver, each with their own name + number.
  const [riderName, setRiderName] = useState("");
  const [riderPhone, setRiderPhone] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  // Only one desktop dropdown, and separately only one mobile sheet,
  // open at a time.
  const [openField, setOpenField] = useState<Field | null>(null);
  const [mobileSheetField, setMobileSheetField] = useState<Field | null>(null);

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorDetail, setErrorDetail] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] = useState<BookingSummary | null>(null);

  // Captured silently in the background by LocationProvider (see app/layout.tsx)
  // and kept live via watchPosition — never shown in the UI, just piggy-backed
  // onto the booking email so the rider can jump straight to a pin instead of
  // relying on the area name alone.
  const { location: userLocation } = useUserLocation();

  // Fare calculation is deferred for ride/courier bookings — no calculator
  // is wired in yet. Every booking goes through as "price to be confirmed
  // on WhatsApp" regardless of whether the location is a known area/hotel
  // or something the person typed themselves.
  const bothAreasSelected = Boolean(pickupArea && dropoffArea);

  // The exact house/street address is a nice-to-have, not a requirement —
  // the rider can always call to pin down the exact spot. Only the area
  // (which drives pricing), a name, and a phone number are mandatory.
  const canSubmit = Boolean(
    pickupArea &&
      dropoffArea &&
      (mode === "ride"
        ? riderName.trim() && riderPhone.trim()
        : senderName.trim() &&
          senderPhone.trim() &&
          receiverName.trim() &&
          receiverPhone.trim())
  );

  async function handleSubmit() {
    if (!canSubmit || status === "sending") return;

    setStatus("sending");

    const hasCoords = userLocation !== null;
    const mapsLink = hasCoords
      ? `https://www.google.com/maps?q=${userLocation!.latitude},${userLocation!.longitude}`
      : "";

    const templateParams = {
      mode: mode === "ride" ? "Ride" : "Courier",
      pickup_area: pickupArea,
      pickup_address: pickupAddress.trim() || "Not provided",
      dropoff_area: dropoffArea,
      dropoff_address: dropoffAddress.trim() || "Not provided",
      price: "On request",
      rider_name: mode === "ride" ? riderName : "",
      rider_phone: mode === "ride" ? riderPhone : "",
      sender_name: mode === "parcel" ? senderName : "",
      sender_phone: mode === "parcel" ? senderPhone : "",
      receiver_name: mode === "parcel" ? receiverName : "",
      receiver_phone: mode === "parcel" ? receiverPhone : "",
      customer_lat: hasCoords ? userLocation!.latitude.toFixed(6) : "Not available",
      customer_lng: hasCoords ? userLocation!.longitude.toFixed(6) : "Not available",
      location_link: mapsLink || "Not available",
      time: new Date().toLocaleString(),
    };

    try {
      const res = await fetch("/api/book-ride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateParams),
      });

      if (!res.ok) throw new Error("Booking request failed");

      // Save what was booked so the confirmation screen can show it,
      // then clear the form and switch views.
      setConfirmedBooking({
        mode,
        pickupArea,
        pickupAddress,
        dropoffArea,
        dropoffAddress,
        riderName,
        riderPhone,
        senderName,
        senderPhone,
        receiverName,
        receiverPhone,
      });
      setStatus("idle");
      setPickupArea("");
      setPickupAddress("");
      setDropoffArea("");
      setDropoffAddress("");
      setRiderName("");
      setRiderPhone("");
      setSenderName("");
      setSenderPhone("");
      setReceiverName("");
      setReceiverPhone("");
    } catch (err) {
      console.error("Booking request failed:", err);
      setErrorDetail(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  function handleBookAnother() {
    setConfirmedBooking(null);
    setStatus("idle");
    setErrorDetail("");
  }

  // Confirmation screen — shown right after a successful booking so the
  // user isn't left wondering whether anything happened.
  if (confirmedBooking) {
    const {
      mode: bookedMode,
      pickupArea: bookedPickupArea,
      pickupAddress: bookedPickupAddress,
      dropoffArea: bookedDropoffArea,
      dropoffAddress: bookedDropoffAddress,
      riderName: bookedRiderName,
      riderPhone: bookedRiderPhone,
      senderName: bookedSenderName,
      senderPhone: bookedSenderPhone,
      receiverName: bookedReceiverName,
      receiverPhone: bookedReceiverPhone,
    } = confirmedBooking;

    return (
      <div className="mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm shadow-gray-200/60">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 px-6 pb-7 pt-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
              <CheckCircle2 size={30} className="text-white" strokeWidth={2} />
            </div>
            <h2 className="text-lg font-bold text-white">Booking received</h2>
            <p className="mt-1 text-sm text-purple-100">
              {bookedMode === "ride" ? "Your ride" : "Your courier"} request is on its way to us.
            </p>
          </div>

          {/* Status pill */}
          <div className="flex items-center justify-center gap-2 border-b border-dashed border-gray-100 bg-amber-50 px-4 py-3">
            <Clock size={14} className="text-amber-600" strokeWidth={2.5} />
            <span className="text-xs font-semibold text-amber-700">Pending confirmation</span>
          </div>

          {/* Summary */}
          <div className="px-6 py-6">
            <div className="flex gap-3.5">
              <div className="flex w-4 shrink-0 flex-col items-center pt-1">
                <CircleDot size={14} className="text-purple-600" strokeWidth={2.5} />
                <div className="my-1 w-px flex-1 border-l-2 border-dashed border-purple-200" />
                <MapPin size={14} className="fill-purple-100 text-purple-600" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1 space-y-4">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Pickup
                  </div>
                  <div className="truncate text-sm font-semibold text-gray-900">
                    {bookedPickupArea}
                  </div>
                  {bookedPickupAddress.trim() && (
                    <div className="truncate text-xs text-gray-500">{bookedPickupAddress}</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Drop-off
                  </div>
                  <div className="truncate text-sm font-semibold text-gray-900">
                    {bookedDropoffArea}
                  </div>
                  {bookedDropoffAddress.trim() && (
                    <div className="truncate text-xs text-gray-500">{bookedDropoffAddress}</div>
                  )}
                </div>
              </div>
            </div>

            {bookedMode === "ride" && (
              <div className="mt-5 min-w-0 rounded-xl bg-gray-50 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Your name
                </div>
                <div className="truncate text-sm font-semibold text-gray-900">{bookedRiderName}</div>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Your phone
                </div>
                <div className="truncate text-sm font-semibold text-gray-900">{bookedRiderPhone}</div>
              </div>
            )}

            {bookedMode === "parcel" && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="min-w-0 rounded-xl bg-gray-50 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Sender
                  </div>
                  <div className="truncate text-sm font-semibold text-gray-900">
                    {bookedSenderName}
                  </div>
                  <div className="truncate text-xs text-gray-500">{bookedSenderPhone}</div>
                </div>
                <div className="min-w-0 rounded-xl bg-gray-50 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Receiver
                  </div>
                  <div className="truncate text-sm font-semibold text-gray-900">
                    {bookedReceiverName}
                  </div>
                  <div className="truncate text-xs text-gray-500">{bookedReceiverPhone}</div>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-3.5">
              <Sparkles size={14} className="shrink-0 text-purple-600" strokeWidth={2.5} />
              <span className="text-xs font-medium text-purple-700">
                We&rsquo;ll confirm the price on WhatsApp when we call to confirm.
              </span>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          We&rsquo;ll contact you shortly to confirm your {bookedMode === "ride" ? "ride" : "courier"}.
        </p>

        <button
          type="button"
          onClick={handleBookAnother}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-purple-600 py-3.5 text-sm font-bold text-purple-600 transition-colors hover:bg-purple-50 active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={2.5} />
          Book another
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Brand mark */}
      <div className="mb-8 flex items-center justify-center gap-2.5">
        <div className="h-15 w-15 shrink-0 overflow-hidden rounded-xl shadow-md shadow-purple-600/30">
          <img
            src="https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlnZLphO962Ub_SJzR903k14i87FPHsHowAZKIwaLkq_zwtiwmwz366IV0K9jJGp_oRVbNxuWx4TtI4-aJYJOMwR8b8VglQkgrw5BPVnEzWz8bfqpjIvFFvB19NEZF6EnFjr5cajNHhzGm5=s680-w680-h510-rw"
            alt="Meal Bear logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-center leading-none">
          <p className="text-cl font-bold text-purple-700">Meal Bear</p>
          <p className="mt-1 text-[12px] font-medium text-gray-400">Rides &amp; Courier · Skardu</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="relative mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-purple-50 p-1">
        <div
          className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-xl bg-purple-600 shadow-md shadow-purple-600/30 transition-transform duration-300 ease-out ${
            mode === "parcel" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
          }`}
        />
        <button
          type="button"
          onClick={() => setMode("ride")}
          className={`relative z-10 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors duration-200 ${
            mode === "ride" ? "text-white" : "text-purple-900/50"
          }`}
        >
          <Bike size={16} strokeWidth={2.5} /> Ride
        </button>
        <button
          type="button"
          onClick={() => setMode("parcel")}
          className={`relative z-10 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors duration-200 ${
            mode === "parcel" ? "text-white" : "text-purple-900/50"
          }`}
        >
          <Package size={16} strokeWidth={2.5} /> Courier
        </button>
      </div>

      {/* Route card: pickup + dropoff, generously spaced so the location
          and address fields never compete for the same visual line. */}
      <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm shadow-gray-200/60 sm:p-6">
        <RouteStop
          icon={<CircleDot size={18} className="text-purple-600" strokeWidth={2.5} />}
          label="Pickup"
          field="pickup"
          area={pickupArea}
          onAreaChange={setPickupArea}
          address={pickupAddress}
          onAddressChange={setPickupAddress}
          openField={openField}
          setOpenField={setOpenField}
          mobileSheetField={mobileSheetField}
          setMobileSheetField={setMobileSheetField}
        />

        <div className="my-5 border-t border-dashed border-gray-100" />

        <RouteStop
          icon={<MapPin size={18} className="fill-purple-100 text-purple-600" strokeWidth={2} />}
          label="Drop-off"
          field="dropoff"
          area={dropoffArea}
          onAreaChange={setDropoffArea}
          address={dropoffAddress}
          onAddressChange={setDropoffAddress}
          openField={openField}
          setOpenField={setOpenField}
          mobileSheetField={mobileSheetField}
          setMobileSheetField={setMobileSheetField}
        />
      </div>

      {/* Contact details — one card, grouped by a single divider per row
          instead of a grid of separate bordered boxes. */}
      <div className="mb-5 divide-y divide-gray-100 rounded-3xl border border-gray-100 bg-white px-5 shadow-sm shadow-gray-200/60 sm:px-6">
        {mode === "ride" ? (
          <ContactRow
            title="Your"
            name={riderName}
            onNameChange={setRiderName}
            phone={riderPhone}
            onPhoneChange={setRiderPhone}
          />
        ) : (
          <>
            <ContactRow
              title="Sender"
              name={senderName}
              onNameChange={setSenderName}
              phone={senderPhone}
              onPhoneChange={setSenderPhone}
            />
            <ContactRow
              title="Receiver"
              name={receiverName}
              onNameChange={setReceiverName}
              phone={receiverPhone}
              onPhoneChange={setReceiverPhone}
            />
          </>
        )}
      </div>

      {/* Price note — no calculator wired in yet, so every booking is
          confirmed manually over WhatsApp regardless of the route. */}
      {bothAreasSelected && (
        <div className="relative mb-5 flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 p-4.5 shadow-md shadow-purple-600/25">
          <div className="absolute -right-4 -top-4 opacity-10">
            {mode === "ride" ? <Bike size={90} /> : <Package size={90} />}
          </div>
          <div className="relative">
            <span className="block text-xs font-semibold text-purple-100">Price</span>
            <span className="block text-[11px] text-purple-200">
              We&rsquo;ll confirm by phone / WhatsApp
            </span>
          </div>
          <span className="relative text-xl font-bold text-white">On request</span>
        </div>
      )}

      <button
        disabled={!canSubmit || status === "sending"}
        onClick={handleSubmit}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 py-4 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all duration-200 hover:bg-purple-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-purple-600"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            {mode === "ride" ? "Book ride" : "Book courier"}
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </>
        )}
      </button>

      {status === "error" && (
        <p className="mt-3 text-center text-sm font-medium text-red-600">
          Something went wrong sending your booking{errorDetail ? `: ${errorDetail}` : ""}. Please try again.
        </p>
      )}
    </div>
  );
}