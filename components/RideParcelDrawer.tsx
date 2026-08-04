// components/RideParcelForm.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
} from "lucide-react";
import {
  SKARDU_AREAS,
  SKARDU_HOTELS,
} from "@/data/location";

import {
  calculateRideFare,
  calculateParcelFare,
  calculateTripDistance,
} from "@/utils/deliveryCalculator";
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
// scope. The picker searches across both groups together instead of
// forcing the person to pick a tab first, then displays results grouped
// by category so a long, unfiltered list still stays easy to scan.
const ALL_AREAS: LocationOption[] = Object.keys(SKARDU_AREAS)
  .map((name) => ({ name, category: "area" as const }))
  .sort((a, b) => a.name.localeCompare(b.name));

const ALL_HOTELS: LocationOption[] = Object.keys(SKARDU_HOTELS)
  .map((name) => ({ name, category: "hotel" as const }))
  .sort((a, b) => a.name.localeCompare(b.name));

const KNOWN_LOCATION_NAMES = new Set([...ALL_AREAS, ...ALL_HOTELS].map((l) => l.name));

type BookingSummary = {
  mode: Mode;
  pickupArea: Area;
  pickupAddress: string;
  dropoffArea: Area;
  dropoffAddress: string;
  price: number | null;
  distanceKm: number | null;
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

/**
 * Searchable location picker.
 *
 * Typing filters the combined area + hotel directory live. Results are
 * grouped under sticky "Areas" / "Hotels" headers so the full, unlimited
 * list stays navigable instead of turning into one long undifferentiated
 * scroll. If nothing in the directory matches what was typed, an extra
 * row lets the person use their own text as a custom location (e.g. a
 * village or street the directory doesn't have yet) — pricing simply
 * falls back to "On request" for anything outside the known list.
 */
function AreaCombobox({
  label,
  value,
  onChange,
  isOpen,
  onOpen,
  onClose,
  placeholder,
}: {
  label: string;
  value: Area;
  onChange: (a: Area) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  placeholder: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(value);

  // Keep the input's text in sync with the committed value whenever the
  // field isn't actively being edited (e.g. after "Book Another" resets it).
  useEffect(() => {
    if (!isOpen) setQuery(value);
  }, [value, isOpen]);

  const trimmed = query.trim();
  const trimmedLower = trimmed.toLowerCase();

  const matchedAreas = useMemo(() => matchAndSort(ALL_AREAS, trimmedLower), [trimmedLower]);
  const matchedHotels = useMemo(() => matchAndSort(ALL_HOTELS, trimmedLower), [trimmedLower]);
  const totalMatches = matchedAreas.length + matchedHotels.length;

  const exactMatch = trimmedLower
    ? [...ALL_AREAS, ...ALL_HOTELS].find((o) => o.name.toLowerCase() === trimmedLower)
    : undefined;
  const showCustomOption = trimmed.length > 0 && !exactMatch;
  const isCustomSelected = value !== "" && !KNOWN_LOCATION_NAMES.has(value);

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

  // Commits whatever was typed (as a custom location) when the field loses
  // focus without an explicit selection, instead of silently discarding it.
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {groupLabel}
          </span>
          <span className="text-[10px] font-semibold text-gray-300">· {items.length}</span>
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

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </label>
        {isCustomSelected && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600">
            Custom
          </span>
        )}
      </div>

      <div className="relative mt-1.5 flex items-center">
        <Search size={13} strokeWidth={2.5} className="pointer-events-none absolute left-0 text-gray-300" />
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
          className="w-full min-w-0 bg-transparent py-1 pl-5 pr-5 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none"
        />
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
            className="absolute right-0 text-gray-300 transition-colors hover:text-gray-500"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 sm:max-h-80 overflow-y-auto overscroll-contain rounded-2xl border border-gray-100 bg-white py-1 shadow-xl shadow-gray-300/40"
          role="listbox"
        >
          {totalMatches === 0 && !showCustomOption ? (
            <div className="px-4 py-6 text-center">
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

  // Only one location dropdown open at a time.
  const [openField, setOpenField] = useState<Field | null>(null);

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorDetail, setErrorDetail] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] = useState<BookingSummary | null>(null);

  // Captured silently in the background by LocationProvider (see app/layout.tsx)
  // and kept live via watchPosition — never shown in the UI, just piggy-backed
  // onto the booking email so the rider can jump straight to a pin instead of
  // relying on the area name alone.
  const { location: userLocation } = useUserLocation();

  // Fixed pricing only applies when both ends are in our known directory.
  // A custom, freely-typed location falls back to "On request" instead of
  // guessing a fare for a place we have no coordinates for.
  const pickupKnown = pickupArea !== "" && KNOWN_LOCATION_NAMES.has(pickupArea);
  const dropoffKnown = dropoffArea !== "" && KNOWN_LOCATION_NAMES.has(dropoffArea);
  const bothAreasSelected = Boolean(pickupArea && dropoffArea);
  const bothKnown = pickupKnown && dropoffKnown;

  // Round trip: office -> pickup -> dropoff -> office.
  // Same trip shape (and same fuel-cost pricing) as food delivery —
  // see @/utils/delivery-calculator.
  const distanceKm = useMemo(() => {
    if (!bothKnown) return null;
    try {
      return calculateTripDistance(pickupArea, dropoffArea);
    } catch {
      return null;
    }
  }, [bothKnown, pickupArea, dropoffArea]);

  const price = useMemo(() => {
    if (!bothKnown) return null;
    try {
      return mode === "ride"
        ? calculateRideFare(pickupArea, dropoffArea)
        : calculateParcelFare(pickupArea, dropoffArea);
    } catch {
      return null;
    }
  }, [bothKnown, mode, pickupArea, dropoffArea]);

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
      distance_km: distanceKm !== null ? distanceKm.toFixed(1) : "",
      price: price !== null && price > 0 ? `Rs. ${price}` : "On request",
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
        price,
        distanceKm,
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
      price: bookedPrice,
      riderName: bookedRiderName,
      riderPhone: bookedRiderPhone,
      senderName: bookedSenderName,
      senderPhone: bookedSenderPhone,
      receiverName: bookedReceiverName,
      receiverPhone: bookedReceiverPhone,
    } = confirmedBooking;

    return (
      <div className="w-full max-w-md mx-auto">
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm shadow-gray-200/60 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 px-6 pt-8 pb-7 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
              <CheckCircle2 size={30} className="text-white" strokeWidth={2} />
            </div>
            <h2 className="text-lg font-black uppercase tracking-wide text-white">
              Booking Received
            </h2>
            <p className="mt-1 text-sm text-purple-100">
              {bookedMode === "ride" ? "Your ride" : "Your courier"} request has been received.
            </p>
          </div>

          {/* Status pill */}
          <div className="flex items-center justify-center gap-2 border-b border-dashed border-gray-100 bg-amber-50 px-4 py-3">
            <Clock size={14} className="text-amber-600" strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Pending confirmation
            </span>
          </div>

          {/* Summary */}
          <div className="px-6 py-5">
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-1 shrink-0 w-4">
                <CircleDot size={14} className="text-purple-600" strokeWidth={2.5} />
                <div className="w-px flex-1 my-1 border-l-2 border-dashed border-purple-200" />
                <MapPin size={14} className="text-purple-600 fill-purple-100" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0 space-y-4">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Pickup
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {bookedPickupArea}
                  </div>
                  {bookedPickupAddress.trim() && (
                    <div className="text-xs text-gray-500 truncate">{bookedPickupAddress}</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Drop-off
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {bookedDropoffArea}
                  </div>
                  {bookedDropoffAddress.trim() && (
                    <div className="text-xs text-gray-500 truncate">{bookedDropoffAddress}</div>
                  )}
                </div>
              </div>
            </div>

            {bookedMode === "ride" && (
              <div className="mt-5 rounded-xl bg-gray-50 p-3.5 min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Your Name
                </div>
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {bookedRiderName}
                </div>
                <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Your Phone
                </div>
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {bookedRiderPhone}
                </div>
              </div>
            )}

            {bookedMode === "parcel" && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3.5 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Sender
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {bookedSenderName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{bookedSenderPhone}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3.5 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Receiver
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {bookedReceiverName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{bookedReceiverPhone}</div>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between rounded-xl bg-purple-50 px-4 py-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Fixed Price
              </span>
              <span className="text-lg font-black text-purple-700">
                {bookedPrice !== null && bookedPrice > 0 ? `Rs. ${bookedPrice}` : "On request"}
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
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-purple-600 py-3.5 text-sm font-black uppercase tracking-wide text-purple-600 transition-colors hover:bg-purple-50 active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={2.5} />
          Book Another
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand mark */}
      <div className="mb-7 flex items-center justify-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-md shadow-purple-600/30">
          <Sparkles size={16} strokeWidth={2.5} />
        </div>
        <div className="text-center leading-none">
          <p className="text-sm font-black uppercase tracking-widest text-purple-700">
            Meal Bear
          </p>
          <p className="mt-1 text-[11px] font-semibold text-gray-400">
            Rides &amp; Courier · Skardu
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="relative grid grid-cols-2 gap-1 mb-6 bg-purple-50 p-1 rounded-2xl">
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-purple-600 shadow-md shadow-purple-600/30 transition-transform duration-300 ease-out ${
            mode === "parcel" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
          }`}
        />
        <button
          type="button"
          onClick={() => setMode("ride")}
          className={`relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-colors duration-200 ${
            mode === "ride" ? "text-white" : "text-purple-900/50"
          }`}
        >
          <Bike size={16} strokeWidth={2.5} /> Ride
        </button>
        <button
          type="button"
          onClick={() => setMode("parcel")}
          className={`relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-colors duration-200 ${
            mode === "parcel" ? "text-white" : "text-purple-900/50"
          }`}
        >
          <Package size={16} strokeWidth={2.5} /> Courier
        </button>
      </div>

      {/* Route card: pickup + dropoff joined by a connector line */}
      <div className="relative rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/60 mb-5 overflow-visible">
        {/* Connector line between the two dots */}
        <div className="absolute left-[31px] top-[42px] bottom-[42px] w-px border-l-2 border-dashed border-purple-200" />

        {/* Pickup */}
        <div className="relative flex gap-3.5 p-5 pb-4">
          <div className="flex flex-col items-center pt-2 shrink-0 w-5">
            <CircleDot size={18} className="text-purple-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <AreaCombobox
              label="Pickup"
              value={pickupArea}
              onChange={setPickupArea}
              isOpen={openField === "pickup"}
              onOpen={() => setOpenField("pickup")}
              onClose={() => setOpenField((f) => (f === "pickup" ? null : f))}
              placeholder="Search area or hotel..."
            />
            <textarea
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="House #, landmark, street... (optional)"
              className="w-full mt-2 text-sm text-gray-600 placeholder:text-gray-400 bg-gray-50 rounded-lg p-2.5 resize-none border border-transparent focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
              rows={1}
            />
          </div>
        </div>

        <div className="mx-5 border-t border-dashed border-gray-100" />

        {/* Dropoff */}
        <div className="relative flex gap-3.5 p-5 pt-4">
          <div className="flex flex-col items-center pt-2 shrink-0 w-5">
            <MapPin size={18} className="text-purple-600 fill-purple-100" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <AreaCombobox
              label="Drop-off"
              value={dropoffArea}
              onChange={setDropoffArea}
              isOpen={openField === "dropoff"}
              onOpen={() => setOpenField("dropoff")}
              onClose={() => setOpenField((f) => (f === "dropoff" ? null : f))}
              placeholder="Search area or hotel..."
            />
            <textarea
              value={dropoffAddress}
              onChange={(e) => setDropoffAddress(e.target.value)}
              placeholder="House #, landmark, street... (optional)"
              className="w-full mt-2 text-sm text-gray-600 placeholder:text-gray-400 bg-gray-50 rounded-lg p-2.5 resize-none border border-transparent focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
              rows={1}
            />
          </div>
        </div>
      </div>

      {/* Ride contact details */}
      {mode === "ride" && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm shadow-gray-200/60 min-w-0">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <User size={11} /> Your Name
            </label>
            <input
              type="text"
              value={riderName}
              onChange={(e) => setRiderName(e.target.value)}
              placeholder="Full name"
              className="w-full min-w-0 mt-1.5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
            />
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm shadow-gray-200/60 min-w-0">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <Phone size={11} /> Your Phone
            </label>
            <input
              type="tel"
              value={riderPhone}
              onChange={(e) => setRiderPhone(e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="w-full min-w-0 mt-1.5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Parcel contact details */}
      {mode === "parcel" && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm shadow-gray-200/60 min-w-0">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <User size={11} /> Sender Name
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Full name"
              className="w-full min-w-0 mt-1.5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
            />
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm shadow-gray-200/60 min-w-0">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <Phone size={11} /> Sender Phone
            </label>
            <input
              type="tel"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="w-full min-w-0 mt-1.5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
            />
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm shadow-gray-200/60 min-w-0">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <User size={11} /> Receiver Name
            </label>
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="Full name"
              className="w-full min-w-0 mt-1.5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
            />
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm shadow-gray-200/60 min-w-0">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <Phone size={11} /> Receiver Phone
            </label>
            <input
              type="tel"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="w-full min-w-0 mt-1.5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Price summary */}
      {bothAreasSelected && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 p-4.5 mb-5 flex items-center justify-between shadow-md shadow-purple-600/25">
          <div className="absolute -right-4 -top-4 opacity-10">
            {mode === "ride" ? <Bike size={90} /> : <Package size={90} />}
          </div>
          <div className="relative">
            <span className="block text-xs font-bold uppercase tracking-wider text-purple-100">
              Fixed Price
            </span>
            {!bothKnown && (
              <span className="block text-[11px] text-purple-200">
                Custom location · we&rsquo;ll confirm by phone
              </span>
            )}
          </div>
          <span className="relative text-xl font-black text-white">
            {price !== null && price > 0 ? `Rs. ${price}` : "On request"}
          </span>
        </div>
      )}

      <button
        disabled={!canSubmit || status === "sending"}
        onClick={handleSubmit}
        className="group w-full py-4 rounded-2xl bg-purple-600 text-white font-black uppercase text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all duration-200 hover:bg-purple-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-purple-600"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            {mode === "ride" ? "Book Ride" : "Book Courier"}
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </>
        )}
      </button>

      {status === "error" && (
        <p className="mt-3 text-center text-sm font-semibold text-red-600">
          Something went wrong sending your booking{errorDetail ? `: ${errorDetail}` : ""}. Please try again.
        </p>
      )}
    </div>
  );
}