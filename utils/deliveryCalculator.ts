import { Shop } from "@/data/config";
import {
  getDistanceFromBase,
  getDistanceFromBaseCoords,
  getDistanceBetweenCoords,
  getDistanceBetweenLocations,
  SKARDU_LOCATIONS,
} from "@/data/location";

const FUEL_PRICE_PER_LITER = 327;
const BIKE_AVERAGE_KM_PER_LITER = 40;
const BASE_PROFIT = 100;

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

/**
 * Calculates the delivery fee for a given shop + drop-off location.
 *
 * Trip model: Office -> Restaurant -> Customer -> Office (one loop).
 * Unlike the previous version, the middle leg (Restaurant -> Customer)
 * is now the REAL coordinate-based distance between the two points —
 * not an approximation that routed back through the office. That old
 * approximation overestimated cost whenever the restaurant and customer
 * were close to each other but both far from the office.
 */
export const calculateDeliveryFee = (shop: Shop, hotelName: string): number => {
  const officeToRestaurant = getShopDistanceFromHub(shop);

  const customerCoords = SKARDU_LOCATIONS[hotelName];

  let restaurantToCustomer: number;
  let customerToOffice: number;

  if (customerCoords) {
    restaurantToCustomer = getDistanceBetweenCoords(
      { lat: shop.lat, lng: shop.lng },
      customerCoords
    );
    customerToOffice = getDistanceFromBase(hotelName);
  } else {
    console.warn(
      `calculateDeliveryFee: unrecognized location "${hotelName}". Defaulting to ${DEFAULT_HOTEL_DISTANCE_KM}km for both legs.`
    );
    restaurantToCustomer = DEFAULT_HOTEL_DISTANCE_KM;
    customerToOffice = DEFAULT_HOTEL_DISTANCE_KM;
  }

  // Safety net in case any leg comes back malformed.
  const safeOfficeToRestaurant = typeof officeToRestaurant === "number" && !Number.isNaN(officeToRestaurant) && officeToRestaurant >= 0
    ? officeToRestaurant
    : 0;
  const safeRestaurantToCustomer = typeof restaurantToCustomer === "number" && !Number.isNaN(restaurantToCustomer) && restaurantToCustomer >= 0
    ? restaurantToCustomer
    : DEFAULT_HOTEL_DISTANCE_KM;
  const safeCustomerToOffice = typeof customerToOffice === "number" && !Number.isNaN(customerToOffice) && customerToOffice >= 0
    ? customerToOffice
    : DEFAULT_HOTEL_DISTANCE_KM;

  const totalTripDistance = safeOfficeToRestaurant + safeRestaurantToCustomer + safeCustomerToOffice;

  const litersNeeded = totalTripDistance / BIKE_AVERAGE_KM_PER_LITER;
  const fuelCost = litersNeeded * FUEL_PRICE_PER_LITER;

  const totalFee = fuelCost + BASE_PROFIT;

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
// full Office -> Restaurant -> Customer -> Office trip), this only
// estimates the Office -> Restaurant leg, since the drop-off location
// isn't known yet at the point a restaurant card is being browsed.
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
 * distance from the office plus prep time and a human/traffic delay buffer.
 *
 * Returns { min, max, label } where label is ready to render directly,
 * e.g. "30-45 min".
 */
export const estimateDeliveryTime = (shop: Shop): { min: number; max: number; label: string } => {
  const safeRestDist = getShopDistanceFromHub(shop);

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