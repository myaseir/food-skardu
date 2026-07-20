import { Shop } from "@/data/config";
import { SKARDU_LOCATIONS } from "@/data/location";

const FUEL_PRICE_PER_LITER = 299;
const BIKE_AVERAGE_KM_PER_LITER = 55;
const BASE_PROFIT = 100;

// Used when a hotel/area name isn't found in SKARDU_LOCATIONS.
const DEFAULT_HOTEL_DISTANCE_KM = 5.0;

/**
 * Calculates the delivery fee for a given shop + drop-off location.
 *
 * Trip model: Hub -> Restaurant -> Hotel -> Hub
 * (i.e. the rider returns to the hub between the restaurant and the
 * hotel legs). This assumes the hub sits roughly on the route between
 * pickup and drop-off points. If the restaurant and hotel are close to
 * each other but both far from the hub, this will overestimate the
 * true distance traveled.
 */
export const calculateDeliveryFee = (shop: Shop, hotelName: string): number => {
  const restDist = shop.distanceFromHub;

  if (typeof restDist !== "number" || Number.isNaN(restDist) || restDist < 0) {
    console.warn(
      `calculateDeliveryFee: invalid distanceFromHub for shop "${shop?.name ?? "unknown"}" (got ${restDist}). Falling back to 0.`
    );
  }
  const safeRestDist = typeof restDist === "number" && !Number.isNaN(restDist) && restDist >= 0
    ? restDist
    : 0;

  // Use ?? instead of || so a legitimate 0km distance isn't overwritten
  // by the default (0 is falsy but a perfectly valid distance).
  const knownHotelDist = SKARDU_LOCATIONS[hotelName];
  const hotelDistWasFound = knownHotelDist !== undefined && !Number.isNaN(knownHotelDist);

  if (!hotelDistWasFound) {
    console.warn(
      `calculateDeliveryFee: unrecognized location "${hotelName}". Defaulting to ${DEFAULT_HOTEL_DISTANCE_KM}km.`
    );
  }

  const hotelDist = hotelDistWasFound ? knownHotelDist : DEFAULT_HOTEL_DISTANCE_KM;

  // Total trip: Hub -> Restaurant -> Hotel -> Hub
  // = restDist + (restDist + hotelDist) + hotelDist
  // = 2 * (restDist + hotelDist)
  const totalTripDistance = safeRestDist + (safeRestDist + hotelDist) + hotelDist;

  const litersNeeded = totalTripDistance / BIKE_AVERAGE_KM_PER_LITER;
  const fuelCost = litersNeeded * FUEL_PRICE_PER_LITER;

  const totalFee = fuelCost + BASE_PROFIT;

  // Round up to the nearest 10 (protects margin; never rounds down).
  return Math.ceil(totalFee / 10) * 10;
};

// ---- Estimated delivery time (for restaurant cards) ----
//
// This is a rough, honest estimate shown BEFORE the customer has picked
// a delivery address — so unlike calculateDeliveryFee (which uses the
// full Hub -> Restaurant -> Hotel -> Hub trip), this only estimates the
// Hub -> Restaurant leg, since the drop-off location isn't known yet at
// the point a restaurant card is being browsed.
//
// The estimate has THREE parts, not just two:
//   1. Kitchen prep time      — cooking the food
//   2. Human/dispatch buffer  — order confirmation + rider getting to
//                                the restaurant in the first place
//                                (riders aren't idling outside 24/7)
//   3. Travel + traffic time  — the actual ride, at a conservative
//                                real-world speed that accounts for
//                                stops, congestion, and road conditions
//
// Without #2 and #3's traffic buffer, estimates read as unrealistically
// fast (e.g. "20-30 min") compared to how deliveries actually go in
// practice. This version targets roughly "30-45 min" for a typical
// ~4-5km restaurant, which better matches real-world delivery times.

const KITCHEN_PREP_MIN_MINUTES = 15; // fastest realistic prep time
const KITCHEN_PREP_MAX_MINUTES = 18; // slower/busy kitchen prep time

// Order confirmation + rider dispatch time — the gap between the order
// being placed and the rider actually starting to ride.
const DISPATCH_BUFFER_MIN_MINUTES = 8;  // rider already nearby / quick confirm
const DISPATCH_BUFFER_MAX_MINUTES = 15; // rider busy elsewhere / slow confirm, traffic stops

// Local bike speed range on Skardu's roads/terrain — kept conservative
// so the estimate doesn't overpromise.
const BIKE_SPEED_SLOW_KMH = 20; // worst case: traffic, unpaved stretches
const BIKE_SPEED_FAST_KMH = 30; // best case: clear road, short distance

// Round to the nearest 1 minute. IMPORTANT: this used to round to the
// nearest 5, but since most restaurants in a small town are within a
// similar distance band, that coarser rounding was collapsing genuinely
// different distances (e.g. 3.8km vs 4.6km) into the exact same
// displayed range. Rounding to 1 minute keeps the label clean while
// still reflecting real per-restaurant differences.
function roundToNearestMinute(minutes: number): number {
  return Math.round(minutes);
}

/**
 * Estimates a delivery time range in minutes for a shop, based on its
 * distance from the hub plus prep time and a human/traffic delay buffer.
 *
 * Returns { min, max, label } where label is ready to render directly,
 * e.g. "30-45 min".
 */
export const estimateDeliveryTime = (shop: Shop): { min: number; max: number; label: string } => {
  const restDist = shop.distanceFromHub;
  const safeRestDist = typeof restDist === "number" && !Number.isNaN(restDist) && restDist >= 0
    ? restDist
    : 0;

  // Travel time: distance / speed * 60 (convert hours -> minutes).
  // Fast speed -> shortest travel time (best case, feeds the "min" side).
  // Slow speed -> longest travel time (worst case, feeds the "max" side).
  const travelTimeFastMin = (safeRestDist / BIKE_SPEED_FAST_KMH) * 60;
  const travelTimeSlowMin = (safeRestDist / BIKE_SPEED_SLOW_KMH) * 60;

  const rawMin = KITCHEN_PREP_MIN_MINUTES + DISPATCH_BUFFER_MIN_MINUTES + travelTimeFastMin;
  const rawMax = KITCHEN_PREP_MAX_MINUTES + DISPATCH_BUFFER_MAX_MINUTES + travelTimeSlowMin;

  const min = roundToNearestMinute(rawMin);
  // Guard against min === max after rounding (e.g. very close restaurants)
  // so the range always shows a believable spread.
  const max = Math.max(roundToNearestMinute(rawMax), min + 5);

  return {
    min,
    max,
    label: `${min}-${max} min`,
  };
};