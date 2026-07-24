// components/RideParcelForm.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Bike,
  Package,
  MapPin,
  Phone,
  ArrowRight,
  CircleDot,
  ChevronDown,
  Check,
  Loader2,
  CheckCircle2,
  Clock,
  Plus,
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

type SubmitStatus = "idle" | "sending" | "error";

type Mode = "ride" | "parcel";
type Field = "pickup" | "dropoff";
type LocationCategory = "area" | "hotel";
// A valid location name is any key in either SKARDU_AREAS or SKARDU_HOTELS.
// (Deliberately plain `string`, not `keyof typeof SKARDU_AREAS` — that
// widens to include `symbol` for index-signature types, which then breaks
// rendering the value directly as JSX text.)
type Area = string;

type BookingSummary = {
  mode: Mode;
  pickupArea: Area;
  pickupAddress: string;
  dropoffArea: Area;
  dropoffAddress: string;
  price: number | null;
  distanceKm: number | null;
  senderPhone: string;
  receiverPhone: string;
};

/**
 * Custom area picker.
 * Replaces the native <select> so we control the dropdown's max-height
 * and get a real scrollbar instead of the list overflowing the viewport
 * on small phone screens (and looking oversized on laptop).
 */
function AreaSelect({
  label,
  value,
  onChange,
  category,
  onCategoryChange,
  isOpen,
  onOpen,
  onClose,
}: {
  label: string;
  value: Area;
  onChange: (a: Area) => void;
  category: LocationCategory;
  onCategoryChange: (c: LocationCategory) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Only the selected category's names are shown — switching category
  // clears whatever was picked from the other list (handled by the parent).
  const options = useMemo(
    () =>
      Object.keys(category === "area" ? SKARDU_AREAS : SKARDU_HOTELS).sort((a, b) =>
        a.localeCompare(b)
      ),
    [category]
  );

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </label>
        <div className="flex shrink-0 gap-0.5 rounded-full bg-gray-100 p-0.5">
          {(["area", "hotel"] as LocationCategory[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                if (c !== category) onCategoryChange(c);
              }}
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                category === c
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {c === "area" ? "Area" : "Hotel"}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => (isOpen ? onClose() : onOpen())}
        className="flex w-full min-w-0 items-center justify-between gap-2 mt-1 bg-transparent text-left focus:outline-none"
      >
        <span
          className={`truncate text-sm font-semibold ${
            value ? "text-gray-900" : "text-gray-400 font-normal"
          }`}
        >
          {value || (category === "area" ? "Select area" : "Select hotel")}
        </span>
        <ChevronDown
          size={15}
          strokeWidth={2.5}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-56 sm:max-h-64 overflow-y-auto overscroll-contain rounded-xl border border-gray-100 bg-white py-1 shadow-lg shadow-gray-300/40"
          role="listbox"
        >
          {options.length === 0 ? (
            <p className="px-3.5 py-2.5 text-sm text-gray-400">No {category}s found.</p>
          ) : (
            options.map((name) => {
              const selected = name === value;
              return (
                <button
                  key={name}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(name);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm transition-colors ${
                    selected
                      ? "bg-purple-50 font-semibold text-purple-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{name}</span>
                  {selected && <Check size={14} className="shrink-0 text-purple-600" />}
                </button>
              );
            })
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
  const [pickupCategory, setPickupCategory] = useState<LocationCategory>("area");

  const [dropoffArea, setDropoffArea] = useState<Area>("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [dropoffCategory, setDropoffCategory] = useState<LocationCategory>("area");

  // Switching category (Area <-> Hotel) clears whatever name was picked,
  // since it belonged to the other list and is no longer valid here.
  function handlePickupCategoryChange(c: LocationCategory) {
    setPickupCategory(c);
    setPickupArea("");
  }
  function handleDropoffCategoryChange(c: LocationCategory) {
    setDropoffCategory(c);
    setDropoffArea("");
  }

  const [senderPhone, setSenderPhone] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  // Only one area dropdown open at a time.
  const [openField, setOpenField] = useState<Field | null>(null);

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorDetail, setErrorDetail] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] = useState<BookingSummary | null>(null);


  // Round trip: office -> pickup -> dropoff -> office.
  // Same trip shape (and same fuel-cost pricing) as food delivery —
  // see @/utils/delivery-calculator.
  const distanceKm = useMemo(() => {
    if (!pickupArea || !dropoffArea) return null;
    return calculateTripDistance(pickupArea, dropoffArea);
  }, [pickupArea, dropoffArea]);

  const price = useMemo(() => {
    if (!pickupArea || !dropoffArea) return null;
    return mode === "ride"
      ? calculateRideFare(pickupArea, dropoffArea)
      : calculateParcelFare(pickupArea, dropoffArea);
  }, [mode, pickupArea, dropoffArea]);

  const canSubmit =
    pickupArea &&
    pickupAddress.trim() &&
    dropoffArea &&
    dropoffAddress.trim() &&
    (mode === "ride" || (senderPhone.trim() && receiverPhone.trim()));

  async function handleSubmit() {
    if (!canSubmit || status === "sending") return;

    setStatus("sending");

    const templateParams = {
      mode: mode === "ride" ? "Ride" : "Courier",
      pickup_area: pickupArea,
      pickup_address: pickupAddress,
      dropoff_area: dropoffArea,
      dropoff_address: dropoffAddress,
      distance_km: distanceKm !== null ? distanceKm.toFixed(1) : "",
      price: price !== null && price > 0 ? `Rs. ${price}` : "On request",
      sender_phone: mode === "parcel" ? senderPhone : "",
      receiver_phone: mode === "parcel" ? receiverPhone : "",
      time: new Date().toLocaleString(),
    };

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_RIDE_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

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
        senderPhone,
        receiverPhone,
      });
      setStatus("idle");
      setPickupArea("");
      setPickupAddress("");
      setDropoffArea("");
      setDropoffAddress("");
      setSenderPhone("");
      setReceiverPhone("");
    } catch (err) {
      console.error("EmailJS send failed:", err);
      const detail =
        err && typeof err === "object" && "text" in err
          ? String((err as { text?: unknown }).text)
          : err instanceof Error
          ? err.message
          : "Unknown error";
      setErrorDetail(detail);
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
      distanceKm: bookedDistanceKm,
      senderPhone: bookedSenderPhone,
      receiverPhone: bookedReceiverPhone,
    } = confirmedBooking;

    return (
      <div className="w-full max-w-md mx-auto">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/60 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 px-5 pt-7 pb-6 text-center">
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
          <div className="px-5 py-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-1 shrink-0 w-4">
                <CircleDot size={14} className="text-purple-600" strokeWidth={2.5} />
                <div className="w-px flex-1 my-1 border-l-2 border-dashed border-purple-200" />
                <MapPin size={14} className="text-purple-600 fill-purple-100" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Pickup
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {bookedPickupArea}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{bookedPickupAddress}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Drop-off
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {bookedDropoffArea}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{bookedDropoffAddress}</div>
                </div>
              </div>
            </div>

            {bookedMode === "parcel" && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Sender
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {bookedSenderPhone}
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Receiver
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {bookedReceiverPhone}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between rounded-xl bg-purple-50 px-4 py-3">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-purple-700">
                  Fixed Price
                </span>
                {/* {bookedDistanceKm !== null && (
                  <span className="block text-[11px] text-purple-500">
                    ~{bookedDistanceKm.toFixed(1)} km round trip
                  </span>
                )} */}
              </div>
              <span className="text-lg font-black text-purple-700">
                {bookedPrice !== null && bookedPrice > 0 ? `Rs. ${bookedPrice}` : "On request"}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          We'll contact you shortly to confirm your {bookedMode === "ride" ? "ride" : "courier"}.
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
      {/* Mode toggle */}
      <div className="relative grid grid-cols-2 gap-1 mb-7 bg-purple-50 p-1 rounded-2xl">
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
      <div className="relative rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/60 mb-4 overflow-visible">
        {/* Connector line between the two dots */}
        <div className="absolute left-[27px] top-[38px] bottom-[38px] w-px border-l-2 border-dashed border-purple-200" />

        {/* Pickup */}
        <div className="relative flex gap-3 p-4 pb-3">
          <div className="flex flex-col items-center pt-2 shrink-0 w-5">
            <CircleDot size={18} className="text-purple-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <AreaSelect
              label="Pickup"
              value={pickupArea}
              onChange={setPickupArea}
              category={pickupCategory}
              onCategoryChange={handlePickupCategoryChange}
              isOpen={openField === "pickup"}
              onOpen={() => setOpenField("pickup")}
              onClose={() => setOpenField((f) => (f === "pickup" ? null : f))}
            />
            <textarea
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="House #, landmark, street..."
              className="w-full mt-1.5 text-sm text-gray-600 placeholder:text-gray-400 bg-gray-50 rounded-lg p-2.5 resize-none border border-transparent focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
              rows={1}
            />
          </div>
        </div>

        <div className="mx-4 border-t border-dashed border-gray-100" />

        {/* Dropoff */}
        <div className="relative flex gap-3 p-4 pt-3">
          <div className="flex flex-col items-center pt-2 shrink-0 w-5">
            <MapPin size={18} className="text-purple-600 fill-purple-100" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <AreaSelect
              label="Drop-off"
              value={dropoffArea}
              onChange={setDropoffArea}
              category={dropoffCategory}
              onCategoryChange={handleDropoffCategoryChange}
              isOpen={openField === "dropoff"}
              onOpen={() => setOpenField("dropoff")}
              onClose={() => setOpenField((f) => (f === "dropoff" ? null : f))}
            />
            <textarea
              value={dropoffAddress}
              onChange={(e) => setDropoffAddress(e.target.value)}
              placeholder="House #, landmark, street..."
              className="w-full mt-1.5 text-sm text-gray-600 placeholder:text-gray-400 bg-gray-50 rounded-lg p-2.5 resize-none border border-transparent focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
              rows={1}
            />
          </div>
        </div>
      </div>

      {/* Parcel contact details */}
      {mode === "parcel" && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm shadow-gray-200/60 min-w-0">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <Phone size={11} /> Sender
            </label>
            <input
              type="tel"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="w-full min-w-0 mt-1 text-sm font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
            />
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm shadow-gray-200/60 min-w-0">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <Phone size={11} /> Receiver
            </label>
            <input
              type="tel"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="w-full min-w-0 mt-1 text-sm font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Price summary */}
      {price !== null && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 p-4 mb-4 flex items-center justify-between shadow-md shadow-purple-600/25">
          <div className="absolute -right-4 -top-4 opacity-10">
            {mode === "ride" ? <Bike size={90} /> : <Package size={90} />}
          </div>
          <div className="relative">
            <span className="block text-xs font-bold uppercase tracking-wider text-purple-100">
              Fixed Price
            </span>
            {/* {distanceKm !== null && (
              <span className="block text-[11px] text-purple-200">
                ~{distanceKm.toFixed(1)} km round trip
              </span>
            )} */}
          </div>
          <span className="relative text-xl font-black text-white">
            {price > 0 ? `Rs. ${price}` : "On request"}
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