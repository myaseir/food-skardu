// utils/deliveryCalculator.ts
//
// This file is now a thin layer on top of data/deliveryDistanceTime.ts,
// which owns the manual raw-distance tables (data/deliveryRawDistances.ts)
// and all the fee/time math.
//
// COORDINATE / HAVERSINE CALCULATION HAS BEEN REMOVED. There is no more
// fallback to lat/lng-based distance — data/location.ts is no longer used
// anywhere in this file. If a restaurant/destination combo hasn't been
// manually measured yet, the functions below return null and the caller
// is responsible for showing something like "delivery not available to
// this location yet" instead of guessing a distance.
//
// RIDE & COURIER FARE CALCULATION HAS BEEN REMOVED ENTIRELY. Customers can
// place a ride/courier order without seeing a fare up front — the admin
// tells the customer the fare manually when confirming the order. There is
// intentionally no calculateRideFare / calculateParcelFare / calculateTripDistance
// here anymore. If your order-creation code still imports those, just stop
// passing a fare (e.g. store `fare: null` / "Pending admin confirmation").

import { Shop } from "@/data/config";
import {
  calculateManualDeliveryEstimate,
  getOfficeToRestaurantDistanceTime,
  ManualDeliveryEstimate,
} from "@/utils/deliveryDistanceTime";

// ---------------------------------------------------------------------
// Checkout delivery fee (restaurant/mart cart -> destination)
// ---------------------------------------------------------------------

/**
 * Full checkout estimate (distance, time, fee) for one or more
 * pickup stops (restaurants and/or marts — same shape) being delivered
 * to a single destination (area or hotel).
 *
 * Returns null if this combo hasn't been manually measured yet (no
 * coordinate fallback anymore) — the caller should treat that as
 * "delivery isn't available to this destination from this stop yet"
 * and block/hide checkout for it rather than showing a made-up fee.
 */
export const calculateDeliveryEstimate = (
  stopsInCart: Shop[],
  hotelName: string
): ManualDeliveryEstimate | null => {
  if (!stopsInCart || stopsInCart.length === 0) return null;
  const names = stopsInCart.map((s) => s.name);
  return calculateManualDeliveryEstimate(names, hotelName);
};

/**
 * Convenience wrapper if you just need the fee number (e.g. for a price
 * badge) rather than the full breakdown. Returns null when unmeasured.
 */
export const calculateDeliveryFee = (stopsInCart: Shop[], hotelName: string): number | null => {
  const estimate = calculateDeliveryEstimate(stopsInCart, hotelName);
  return estimate ? estimate.fee : null;
};

// ---------------------------------------------------------------------
// Estimated delivery time shown on restaurant/mart cards, BEFORE the
// customer has picked a destination — so this can only use the single
// Office -> Stop leg from the manual table (Table 3), since neither the
// drop-off location nor any other cart stops are known yet.
// ---------------------------------------------------------------------

/**
 * Rough time estimate for a shop (restaurant or mart), shown while
 * browsing (before a delivery destination is chosen). Returns null if
 * the Office -> Stop leg hasn't been manually measured for this shop yet
 * — the caller should hide/omit the time badge in that case rather than
 * showing a guessed number.
 */
export const estimateDeliveryTime = (shop: Shop): { min: number; max: number; label: string } | null => {
  const leg = getOfficeToRestaurantDistanceTime(shop.name);
  if (!leg || leg.estimated_minutes === null) return null;

  // Same prep/dispatch buffers used in the manual checkout estimate, kept
  // here so the pre-destination badge and the final checkout estimate
  // don't disagree with each other.
  const PREP_BUFFER_MIN_MINUTES = 20;
  const PREP_BUFFER_MAX_MINUTES = 30;
  const DISPATCH_BUFFER_MIN_MINUTES = 5;
  const DISPATCH_BUFFER_MAX_MINUTES = 8;

  const min = Math.round(PREP_BUFFER_MIN_MINUTES + DISPATCH_BUFFER_MIN_MINUTES + leg.estimated_minutes);
  const max = Math.max(
    Math.round(PREP_BUFFER_MAX_MINUTES + DISPATCH_BUFFER_MAX_MINUTES + leg.estimated_minutes),
    min + 5
  );

  return { min, max, label: `${min}-${max} min` };
};