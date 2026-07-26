import { Shop } from "@/data/config";
import {
  getDistanceFromBase,
  getDistanceFromBaseCoords,
  getDistanceBetweenCoords,
  getDistanceBetweenLocations,
  SKARDU_LOCATIONS,
} from "@/data/location";

const FUEL_PRICE_PER_LITER = 327;
const BIKE_AVERAGE_KM_PER_LITER = 45;
const BASE_PROFIT = 100;

// Extra flat fee per additional restaurant beyond the first, on top of the
// distance-based fuel cost. This exists because visiting an extra restaurant
// costs the rider real time (parking, walking in, waiting for food) even
// when the restaurants happen to be geographically close together — pure
// distance-based pricing alone doesn't capture that cost.
const EXTRA_STOP_HANDLING_FEE = 20;

// Used when a hotel/area name isn't found in SKARDU_LOCATIONS.
const DEFAULT_HOTEL_DISTANCE_KM = 3.0;

/**
 * Computes a shop's distance from the office using its lat/lng coordinates
 * (via getDistanceFromBaseCoords, which does the Haversine calculation),
 * with a safety net in case the coordinates are missing or malformed.
 */
function getShopDistanceFromHub(shop: Shop): number {
  const dist = getDistanceFromBaseCoords({ lat: shop.lat, lng: shop.lng });

  if (typeof dist !== "number" || Number.isNaN(dist) || dist < 0) {
    console.warn(
      `calculateDeliveryFee: invalid computed distance for shop "${shop?.name ?? "unknown"}" (got ${dist}). Falling back to 0.`
    );
    return 0;
  }

  return dist;
}

function safeCoordDistance(value: number, fallback: number): number {
  return typeof value === "number" && !Number.isNaN(value) && value >= 0 ? value : fallback;
}

/**
 * Calculates the delivery fee for a multi-restaurant order + one drop-off.
 *
 * Trip model: Office -> Restaurant[0] -> Restaurant[1] -> ... -> Restaurant[N-1]
 *             -> Customer -> Office (one rider, one loop, one fee).
 *
 * `shopsInCart` must be the DISTINCT shops represented in the cart, in the
 * order the customer added them (first item's shop = first stop). Pass a
 * single-item array for a normal one-restaurant order — the formula then
 * collapses to the original Office -> Restaurant -> Customer -> Office trip,
 * with zero extra-stop fee.
 */
export const calculateDeliveryFee = (shopsInCart: Shop[], hotelName: string): number => {
  if (!shopsInCart || shopsInCart.length === 0) return 0;

  let totalTripDistance = 0;

  // Leg 1: Office -> first restaurant
  totalTripDistance += getShopDistanceFromHub(shopsInCart[0]);

  // Legs between consecutive restaurants: Restaurant[i] -> Restaurant[i+1]
  for (let i = 0; i < shopsInCart.length - 1; i++) {
    const legDist = getDistanceBetweenCoords(
      { lat: shopsInCart[i].lat, lng: shopsInCart[i].lng },
      { lat: shopsInCart[i + 1].lat, lng: shopsInCart[i + 1].lng }
    );
    totalTripDistance += safeCoordDistance(legDist, 0);
  }

  // Final legs: last restaurant -> customer -> office
  const lastShop = shopsInCart[shopsInCart.length - 1];
  const customerCoords = SKARDU_LOCATIONS[hotelName];

  let lastToCustomer: number;
  let customerToOffice: number;

  if (customerCoords) {
    lastToCustomer = getDistanceBetweenCoords(
      { lat: lastShop.lat, lng: lastShop.lng },
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

  totalTripDistance += safeCoordDistance(lastToCustomer, DEFAULT_HOTEL_DISTANCE_KM);
  totalTripDistance += safeCoordDistance(customerToOffice, DEFAULT_HOTEL_DISTANCE_KM);

  const litersNeeded = totalTripDistance / BIKE_AVERAGE_KM_PER_LITER;
  const fuelCost = litersNeeded * FUEL_PRICE_PER_LITER;

  // Extra stops beyond the first restaurant each add a flat handling fee.
  const extraStops = Math.max(shopsInCart.length - 1, 0);
  const handlingFee = extraStops * EXTRA_STOP_HANDLING_FEE;

  const totalFee = fuelCost + BASE_PROFIT + handlingFee;

  // TEMP DEBUG — remove once you've confirmed the numbers look right.
  console.log("[calculateDeliveryFee]", {
    shops: shopsInCart.map((s) => s.name),
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

// ---- Estimated delivery time (for restaurant cards) ----
//
// This is a rough, honest estimate shown BEFORE the customer has picked
// a delivery address — so unlike calculateDeliveryFee (which uses the
// full Office -> Restaurant(s) -> Customer -> Office trip), this only
// estimates the Office -> Restaurant leg for ONE shop, since neither the
// drop-off location nor any other restaurants in the cart are known yet
// at the point a restaurant card is being browsed.

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
 * Estimates a delivery time range in minutes for a shop, based on its
 * distance from the office plus prep time and a human/traffic delay buffer.
 *
 * Returns { min, max, label } where label is ready to render directly,
 * e.g. "30-45 min".
 */
export const estimateDeliveryTime = (shop: Shop): { min: number; max: number; label: string } => {
  const safeRestDist = getShopDistanceFromHub(shop);

  const travelTimeFastMin = (safeRestDist / BIKE_SPEED_FAST_KMH) * 60;
  const travelTimeSlowMin = (safeRestDist / BIKE_SPEED_SLOW_KMH) * 60;

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