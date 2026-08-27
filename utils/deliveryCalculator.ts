import { Shop } from "@/data/config";
import {
  getDistanceFromBase,
  getDistanceFromBaseCoords,
  getDistanceBetweenCoords,
  getDistanceBetweenLocations,
  SKARDU_LOCATIONS,
} from "@/data/location";

const FUEL_PRICE_PER_LITER = 343.10;
const BIKE_AVERAGE_KM_PER_LITER = 35
const BASE_PROFIT = 170;

// Extra flat fee per additional pickup stop beyond the first, on top of the
// distance-based fuel cost. This exists because visiting an extra stop
// (restaurant OR mart) costs the rider real time (parking, walking in,
// waiting, picking/packing) even when stops happen to be geographically
// close together — pure distance-based pricing alone doesn't capture that.
const EXTRA_STOP_HANDLING_FEE = 20;

// Used when a hotel/area name isn't found in SKARDU_LOCATIONS.
const DEFAULT_HOTEL_DISTANCE_KM = 4.0;

function safeCoordDistance(value: number, fallback: number): number {
  return typeof value === "number" && !Number.isNaN(value) && value >= 0 ? value : fallback;
}

/**
 * Computes a shop's (or mart's — same shape) distance from the office using
 * its lat/lng coordinates (via getDistanceFromBaseCoords, which does the
 * Haversine calculation), with a safety net if coordinates are missing.
 */
function getStopDistanceFromHub(stop: Shop): number {
  const dist = getDistanceFromBaseCoords({ lat: stop.lat, lng: stop.lng });

  if (typeof dist !== "number" || Number.isNaN(dist) || dist < 0) {
    console.warn(
      `calculateDeliveryFee: invalid computed distance for stop "${stop?.name ?? "unknown"}" (got ${dist}). Falling back to 0.`
    );
    return 0;
  }

  return dist;
}

// ---- Route optimization -------------------------------------------------
//
// The rider's trip is: Office -> [pickup stops, in SOME order] -> Customer
// -> Office. Which order the pickup stops should be visited in depends on
// their real-world geography — a mart sitting right next to restaurant A
// should be picked up on the same detour, not treated as a separate trip.
// So instead of assuming shopsInCart's array order IS the visiting order,
// we search for the shortest total distance across all valid orderings.
//
// For small stop counts (almost always 1-4, occasionally more) an exact
// brute-force search over every permutation is both fast and guaranteed
// optimal. Beyond MAX_EXACT_PERMUTATION_STOPS we fall back to a greedy
// nearest-neighbor heuristic so the fee calculation never hangs, at the
// cost of a (usually small) chance of a slightly non-optimal route.

const MAX_EXACT_PERMUTATION_STOPS = 7; // 7! = 5,040 — comfortably fast

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

/**
 * Total km for Office -> stops[0] -> stops[1] -> ... -> Customer -> Office,
 * for one specific ordering of `stops`.
 */
function routeDistanceForOrder(orderedStops: Shop[], hotelName: string): number {
  let total = 0;

  // Office -> first stop
  total += getStopDistanceFromHub(orderedStops[0]);

  // stop[i] -> stop[i+1]
  for (let i = 0; i < orderedStops.length - 1; i++) {
    const legDist = getDistanceBetweenCoords(
      { lat: orderedStops[i].lat, lng: orderedStops[i].lng },
      { lat: orderedStops[i + 1].lat, lng: orderedStops[i + 1].lng }
    );
    total += safeCoordDistance(legDist, 0);
  }

  // last stop -> customer -> office
  const lastStop = orderedStops[orderedStops.length - 1];
  const customerCoords = SKARDU_LOCATIONS[hotelName];

  let lastToCustomer: number;
  let customerToOffice: number;

  if (customerCoords) {
    lastToCustomer = getDistanceBetweenCoords(
      { lat: lastStop.lat, lng: lastStop.lng },
      customerCoords
    );
    customerToOffice = getDistanceFromBase(hotelName);
  } else {
    console.warn(
      `calculateDeliveryFee: unrecognized location "${hotelName}". Defaulting to ${DEFAULT_HOTEL_DISTANCE_KM}km for both legs.`
    );
    lastToCustomer = DEFAULT_HOTEL_DISTANCE_KM;
    customerToOffice = DEFAULT_HOTEL_DISTANCE_KM;
  }

  total += safeCoordDistance(lastToCustomer, DEFAULT_HOTEL_DISTANCE_KM);
  total += safeCoordDistance(customerToOffice, DEFAULT_HOTEL_DISTANCE_KM);

  return total;
}

/** Greedy nearest-neighbor fallback for large stop counts. */
function nearestNeighborOrder(stops: Shop[]): Shop[] {
  const remaining = [...stops];
  const ordered: Shop[] = [];
  let currentCoords: { lat: number; lng: number } | null = null;

  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const d = currentCoords
        ? safeCoordDistance(
            getDistanceBetweenCoords(currentCoords, { lat: remaining[i].lat, lng: remaining[i].lng }),
            0
          )
        : getStopDistanceFromHub(remaining[i]);

      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }

    const next = remaining.splice(bestIdx, 1)[0];
    ordered.push(next);
    currentCoords = { lat: next.lat, lng: next.lng };
  }

  return ordered;
}

/**
 * Finds the shortest total trip distance across every valid visiting order
 * of `stops` (exact for small counts, greedy heuristic beyond that).
 */
function findOptimalRouteDistance(stops: Shop[], hotelName: string): number {
  if (stops.length === 0) return 0;
  if (stops.length === 1) return routeDistanceForOrder(stops, hotelName);

  if (stops.length <= MAX_EXACT_PERMUTATION_STOPS) {
    let minDist = Infinity;
    for (const order of permutations(stops)) {
      const d = routeDistanceForOrder(order, hotelName);
      if (d < minDist) minDist = d;
    }
    return minDist;
  }

  // Too many stops to brute-force — greedy nearest-neighbor instead.
  return routeDistanceForOrder(nearestNeighborOrder(stops), hotelName);
}

/**
 * Calculates the delivery fee for an order spanning any mix of pickup
 * stops — one restaurant, several restaurants, a mart, or restaurants
 * plus a mart together. Mart is just another stop with coordinates, same
 * as a restaurant; there's no separate "mart trip" or fixed leg order.
 *
 * Trip model: Office -> stops (cheapest order) -> Customer -> Office.
 *
 * `stopsInCart` must be the DISTINCT shops/mart represented in the cart
 * (order doesn't matter — the function finds the cheapest order itself).
 * Pass a single-item array for a normal one-stop order — the formula then
 * collapses to the original Office -> Stop -> Customer -> Office trip,
 * with zero extra-stop fee.
 */
export const calculateDeliveryFee = (stopsInCart: Shop[], hotelName: string): number => {
  if (!stopsInCart || stopsInCart.length === 0) return 0;

  const totalTripDistance = findOptimalRouteDistance(stopsInCart, hotelName);

  const litersNeeded = totalTripDistance / BIKE_AVERAGE_KM_PER_LITER;
  const fuelCost = litersNeeded * FUEL_PRICE_PER_LITER;

  // Extra stops beyond the first each add a flat handling fee — counts
  // any stop type (restaurant or mart) the same way.
 const extraStops = Math.max(stopsInCart.length - 1, 0);
  const handlingFee = extraStops * EXTRA_STOP_HANDLING_FEE;

  // --- NEW: Distance Surcharge Logic ---
  // Increase the fare based on how far the total trip is, without touching the fuel cost.
  let distanceSurcharge = 0;
  
  if (totalTripDistance >= 25) {
    distanceSurcharge = 200; // E.g., Kachura, Shangrila (Very far)
  } else if (totalTripDistance >= 15) {
    distanceSurcharge = 100; // E.g., Airport, Hussainabad (Medium-far)
  } 
  // Anything under 8km gets 0 surcharge (keeps local delivery cheap)

  const totalFee = fuelCost + BASE_PROFIT + handlingFee + distanceSurcharge;

  // TEMP DEBUG — remove once you've confirmed the numbers look right.
  console.log("[calculateDeliveryFee]", {
    stops: stopsInCart.map((s) => s.name),
    totalTripDistance: totalTripDistance.toFixed(2) + " km",
    fuelCost: fuelCost.toFixed(2),
    extraStops,
    handlingFee,
    totalFeeBeforeRounding: totalFee.toFixed(2),
    finalRoundedFee: Math.ceil(totalFee / 10) * 10,
  });

  // Round up to the nearest 10 (protects margin; never rounds down).
  return Math.ceil(totalFee / 10) * 10;
};

// ---- Ride & Courier fare (bike taxi / parcel delivery) --------------------
//
// Reuses the exact same fuel-cost pricing model as calculateDeliveryFee,
// rather than an arbitrary flat "base + per-km" rate. All trip pricing in
// the app is now grounded in one real cost driver (fuel), computed off the
// same trip shape: Office -> Pickup -> Drop-off -> Office.
//
// Ride and Courier keep SEPARATE profit-margin constants in case you want
// them to diverge later (e.g. courier carrying more hassle/liability than
// a plain ride). Both currently match the food-delivery margin (100).

const RIDE_BASE_PROFIT = 100;
const PARCEL_BASE_PROFIT = 100;

// Used when a pickup/drop-off name isn't found in SKARDU_LOCATIONS.
const DEFAULT_TRIP_LEG_DISTANCE_KM = 5.0;

function safeDistance(value: number, fallback: number): number {
  return typeof value === "number" && !Number.isNaN(value) && value >= 0 ? value : fallback;
}

/**
 * Total trip distance in km for Office -> Pickup -> Drop-off -> Office.
 * Exposed on its own (not just baked into the fare) so the UI can show
 * riders/senders the distance their fare is based on.
 */
export const calculateTripDistance = (pickupName: string, dropoffName: string): number => {
  let officeToPickup: number;
  let pickupToDropoff: number;
  let dropoffToOffice: number;

  try {
    officeToPickup = getDistanceFromBase(pickupName);
    pickupToDropoff = getDistanceBetweenLocations(pickupName, dropoffName);
    dropoffToOffice = getDistanceFromBase(dropoffName);
  } catch (err) {
    console.warn(
      `calculateTripDistance: unrecognized pickup/drop-off ("${pickupName}" / "${dropoffName}"). Defaulting each leg to ${DEFAULT_TRIP_LEG_DISTANCE_KM}km.`
    );
    officeToPickup = DEFAULT_TRIP_LEG_DISTANCE_KM;
    pickupToDropoff = DEFAULT_TRIP_LEG_DISTANCE_KM;
    dropoffToOffice = DEFAULT_TRIP_LEG_DISTANCE_KM;
  }

  return (
    safeDistance(officeToPickup, DEFAULT_TRIP_LEG_DISTANCE_KM) +
    safeDistance(pickupToDropoff, DEFAULT_TRIP_LEG_DISTANCE_KM) +
    safeDistance(dropoffToOffice, DEFAULT_TRIP_LEG_DISTANCE_KM)
  );
};

function calculateTripFare(pickupName: string, dropoffName: string, baseProfit: number): number {
  const totalTripDistance = calculateTripDistance(pickupName, dropoffName);

  const litersNeeded = totalTripDistance / BIKE_AVERAGE_KM_PER_LITER;
  const fuelCost = litersNeeded * FUEL_PRICE_PER_LITER;
  const totalFee = fuelCost + baseProfit;

  // Round up to the nearest 10 (protects margin; never rounds down) —
  // same convention as calculateDeliveryFee.
  return Math.ceil(totalFee / 10) * 10;
}

/** Fare for a bike-taxi ride: Office -> Pickup -> Drop-off -> Office. */
export const calculateRideFare = (pickupName: string, dropoffName: string): number =>
  calculateTripFare(pickupName, dropoffName, RIDE_BASE_PROFIT);

/** Fare for a parcel/courier trip: Office -> Pickup -> Drop-off -> Office. */
export const calculateParcelFare = (pickupName: string, dropoffName: string): number =>
  calculateTripFare(pickupName, dropoffName, PARCEL_BASE_PROFIT);

// ---- Estimated delivery time (for restaurant/mart cards) ----
//
// This is a rough, honest estimate shown BEFORE the customer has picked
// a delivery address — so unlike calculateDeliveryFee (which uses the
// full Office -> Stops -> Customer -> Office trip), this only estimates
// the Office -> Stop leg for ONE shop, since neither the drop-off location
// nor any other stops in the cart are known yet while browsing.

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

function roundToNearestMinute(minutes: number): number {
  return Math.round(minutes);
}

/**
 * Estimates a delivery time range in minutes for a shop (or mart — same
 * shape), based on its distance from the office plus prep time and a
 * human/traffic delay buffer.
 *
 * Returns { min, max, label } where label is ready to render directly,
 * e.g. "30-45 min".
 */
export const estimateDeliveryTime = (shop: Shop): { min: number; max: number; label: string } => {
  const safeStopDist = getStopDistanceFromHub(shop);

  const travelTimeFastMin = (safeStopDist / BIKE_SPEED_FAST_KMH) * 60;
  const travelTimeSlowMin = (safeStopDist / BIKE_SPEED_SLOW_KMH) * 60;

  const rawMin = KITCHEN_PREP_MIN_MINUTES + DISPATCH_BUFFER_MIN_MINUTES + travelTimeFastMin;
  const rawMax = KITCHEN_PREP_MAX_MINUTES + DISPATCH_BUFFER_MAX_MINUTES + travelTimeSlowMin;

  const min = roundToNearestMinute(rawMin);
  const max = Math.max(roundToNearestMinute(rawMax), min + 5);

  return {
    min,
    max,
    label: `${min}-${max} min`,
  };
};