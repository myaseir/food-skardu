// data/deliveryDistanceTime.ts
//
// CALCULATION layer for MealBear's manually-measured delivery data. This
// file owns NO raw numbers itself — every table lives in
// data/deliveryRawDistances.ts. This file just fetches from there and
// does the lookups/math (route ordering, fee, time estimates).
//
// Still fully independent from data/location.ts (Haversine coordinates)
// — nothing here touches that file either.

import {
  DistanceTimeEntry,
  DestinationType,
  DestinationToOfficeEntry,
  RESTAURANT_TO_RESTAURANT,
  RESTAURANT_TO_AREA,
  OFFICE_TO_RESTAURANT,
  AREA_TO_OFFICE,
  DESTINATION_EXTRA_CHARGE,
} from "@/data/deliveryRawDistances";

export type { DistanceTimeEntry, DestinationType, DestinationToOfficeEntry };

// ---------------------------------------------------------------------
// Single-leg lookups
// ---------------------------------------------------------------------

/** Restaurant -> destination area/hotel (Table 2). Returns null if unmeasured/unknown. */
export function getRestaurantToAreaDistanceTime(
  restaurantName: string,
  destinationName: string
): DistanceTimeEntry | null {
  return RESTAURANT_TO_AREA[restaurantName]?.[destinationName] ?? null;
}

/** Office -> restaurant (Table 3). Returns null if unmeasured/unknown. */
export function getOfficeToRestaurantDistanceTime(restaurantName: string): DistanceTimeEntry | null {
  return OFFICE_TO_RESTAURANT[restaurantName] ?? null;
}

/** Destination (area OR hotel) -> office (Table 4). Returns null if unmeasured/unknown. */
export function getAreaToOfficeDistanceTime(destinationName: string): DestinationToOfficeEntry | null {
  return AREA_TO_OFFICE[destinationName] ?? null;
}

/**
 * Restaurant <-> restaurant leg (Table 1). Only one direction is
 * required to be entered per pair — this checks A->B first, then falls
 * back to B->A, since road distance is effectively symmetric.
 */
export function getRestaurantToRestaurantDistanceTime(
  restaurantA: string,
  restaurantB: string
): DistanceTimeEntry | null {
  if (restaurantA === restaurantB) return { distance_km: 0, estimated_minutes: 0 };
  return (
    RESTAURANT_TO_RESTAURANT[restaurantA]?.[restaurantB] ??
    RESTAURANT_TO_RESTAURANT[restaurantB]?.[restaurantA] ??
    null
  );
}

/**
 * Looks up Restaurant -> Destination distance/time. Destination type
 * (area vs hotel) doesn't matter here since Table 2 already covers both
 * — kept as a thin, clearly-named wrapper for readability at call sites.
 */
export function getRestaurantToDestinationDistanceTime(
  restaurantName: string,
  destinationName: string
): DistanceTimeEntry | null {
  return getRestaurantToAreaDistanceTime(restaurantName, destinationName);
}

/**
 * Manual one-off extra surcharge for a destination (area or hotel),
 * e.g. a hotel that's hard to access, needs extra coordination with
 * security/reception, sits up a bad road, etc.
 *
 * This is NEVER part of the fuel-cost math — it's looked up and added
 * on separately in calculateManualDeliveryEstimate, after the fuel/fee
 * math is done, and split 50/50 between rider and platform. Returns 0
 * if no charge has been set for this destination.
 */
export function getDestinationExtraCharge(destinationName: string): number {
  return DESTINATION_EXTRA_CHARGE[destinationName] ?? 0;
}

// ---------------------------------------------------------------------
// Single-restaurant trip: Office -> Restaurant -> Destination -> Office
// ---------------------------------------------------------------------

export interface ManualTripDistanceTime {
  officeToRestaurant: DistanceTimeEntry | null;
  restaurantToDestination: DistanceTimeEntry | null;
  destinationToOffice: DistanceTimeEntry | null;
  /** Sum of all legs' distance_km, or null if any leg is missing. */
  totalDistanceKm: number | null;
  /** Sum of all legs' estimated_minutes, or null if any leg is missing. */
  totalEstimatedMinutes: number | null;
}

export function getManualTripDistanceTime(
  restaurantName: string,
  destinationName: string
): ManualTripDistanceTime {
  const officeToRestaurant = getOfficeToRestaurantDistanceTime(restaurantName);
  const restaurantToDestination = getRestaurantToDestinationDistanceTime(restaurantName, destinationName);
  const destinationToOffice = getAreaToOfficeDistanceTime(destinationName);

  const legs = [officeToRestaurant, restaurantToDestination, destinationToOffice];
  const allMeasured = legs.every(
    (leg) => leg !== null && leg.distance_km !== null && leg.estimated_minutes !== null
  );

  return {
    officeToRestaurant,
    restaurantToDestination,
    destinationToOffice,
    totalDistanceKm: allMeasured
      ? legs.reduce((sum, leg) => sum + (leg!.distance_km as number), 0)
      : null,
    totalEstimatedMinutes: allMeasured
      ? legs.reduce((sum, leg) => sum + (leg!.estimated_minutes as number), 0)
      : null,
  };
}

// ---------------------------------------------------------------------
// Multi-restaurant trip: Office -> [restaurants, cheapest order] -> Destination -> Office
// ---------------------------------------------------------------------
// Now possible thanks to Table 1 (Restaurant -> Restaurant). Mirrors the
// route-optimization approach in utils/deliveryCalculator.ts: brute-force
// every visiting order for small stop counts (always fast in practice —
// carts rarely have more than 2-3 restaurants) and pick the cheapest.

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

export interface ManualMultiStopTripDistanceTime {
  /** The cheapest visiting order found for the restaurant stops. */
  orderedRestaurants: string[];
  totalDistanceKm: number | null;
  totalEstimatedMinutes: number | null;
}

/**
 * Total distance/time for Office -> stops (cheapest order) -> Destination
 * -> Office, for a cart with one or more restaurants. Returns null totals
 * if ANY required leg (any Office->Restaurant, any Restaurant<->Restaurant
 * for the chosen order, the final Restaurant->Destination, or
 * Destination->Office) hasn't been measured yet.
 */
export function getManualMultiStopTripDistanceTime(
  restaurantNames: string[],
  destinationName: string
): ManualMultiStopTripDistanceTime {
  if (restaurantNames.length === 0) {
    return { orderedRestaurants: [], totalDistanceKm: null, totalEstimatedMinutes: null };
  }

  if (restaurantNames.length === 1) {
    const trip = getManualTripDistanceTime(restaurantNames[0], destinationName);
    return {
      orderedRestaurants: restaurantNames,
      totalDistanceKm: trip.totalDistanceKm,
      totalEstimatedMinutes: trip.totalEstimatedMinutes,
    };
  }

  const candidateOrders =
    restaurantNames.length <= MAX_EXACT_PERMUTATION_STOPS
      ? permutations(restaurantNames)
      : [restaurantNames]; // beyond that, just use the given order — carts this large aren't realistic here

  let best: { order: string[]; km: number; min: number } | null = null;

  for (const order of candidateOrders) {
    const officeToFirst = getOfficeToRestaurantDistanceTime(order[0]);
    if (!officeToFirst || officeToFirst.distance_km === null || officeToFirst.estimated_minutes === null) {
      continue;
    }

    let km = officeToFirst.distance_km;
    let min = officeToFirst.estimated_minutes;
    let orderIsFullyMeasured = true;

    for (let i = 0; i < order.length - 1; i++) {
      const leg = getRestaurantToRestaurantDistanceTime(order[i], order[i + 1]);
      if (!leg || leg.distance_km === null || leg.estimated_minutes === null) {
        orderIsFullyMeasured = false;
        break;
      }
      km += leg.distance_km;
      min += leg.estimated_minutes;
    }
    if (!orderIsFullyMeasured) continue;

    const lastToDestination = getRestaurantToDestinationDistanceTime(order[order.length - 1], destinationName);
    const destinationToOffice = getAreaToOfficeDistanceTime(destinationName);
    if (
      !lastToDestination ||
      lastToDestination.distance_km === null ||
      lastToDestination.estimated_minutes === null ||
      !destinationToOffice ||
      destinationToOffice.distance_km === null ||
      destinationToOffice.estimated_minutes === null
    ) {
      continue;
    }

    km += lastToDestination.distance_km + destinationToOffice.distance_km;
    min += lastToDestination.estimated_minutes + destinationToOffice.estimated_minutes;

    if (!best || km < best.km) {
      best = { order, km, min };
    }
  }

  if (!best) {
    return { orderedRestaurants: restaurantNames, totalDistanceKm: null, totalEstimatedMinutes: null };
  }

  return {
    orderedRestaurants: best.order,
    totalDistanceKm: best.km,
    totalEstimatedMinutes: best.min,
  };
}

// ---------------------------------------------------------------------
// Checkout-facing estimate: distance + time + delivery fee
// ---------------------------------------------------------------------
//
// FEE MODEL — same fuel-cost philosophy as utils/deliveryCalculator.ts's
// calculateDeliveryFee: fuel cost for the full round trip (rider's real
// cost) + base profit, rounded up to the nearest 10. Just fed from
// manually-measured km instead of Haversine km.
//
// On top of that base fee, a destination MAY carry a manual extra
// charge (Table 5, DESTINATION_EXTRA_CHARGE) — e.g. a hard-to-reach
// hotel. That extra charge is:
//   - looked up AFTER the fuel cost is computed, so it never affects
//     the fuel math itself
//   - added AFTER the base fee is rounded to the nearest 10, so it's a
//     clean, separate line item rather than getting folded into that
//     rounding step
//   - split 50/50 between the rider and the platform (not treated as
//     rider fuel cost — it's pure margin/coordination money)
//
// TIME MODEL — the customer only waits through prep + dispatch + all
// rider travel UP TO the destination (Office->Restaurant(s), plus any
// Restaurant<->Restaurant legs, plus Restaurant->Destination). The final
// Destination->Office leg is the rider's trip home and isn't part of
// what the customer is waiting for, so it's excluded from the time
// estimate (it's still counted in the fee, since it's a real cost).

const MANUAL_FUEL_PRICE_PER_LITER = 358.77;
const MANUAL_BIKE_AVERAGE_KM_PER_LITER = 35;
const MANUAL_BASE_PROFIT = 150;
const MANUAL_EXTRA_STOP_HANDLING_FEE = 30; // matches EXTRA_STOP_HANDLING_FEE in deliveryCalculator.ts

const PREP_BUFFER_MIN_MINUTES = 20;
const PREP_BUFFER_MAX_MINUTES = 30;
const DISPATCH_BUFFER_MIN_MINUTES = 5;
const DISPATCH_BUFFER_MAX_MINUTES = 8;

export interface ManualDeliveryEstimate {
  /** Restaurant(s) -> Destination distance only, i.e. excludes the return-to-office leg. */
  distanceKm: number;
  /** Total distance for the rider's full round trip (used for the fee, not shown to the customer). */
  totalRoundTripKm: number;
  minMinutes: number;
  maxMinutes: number;
  timeLabel: string; // e.g. "28-38 min"
  /** Final total fee charged to the customer, INCLUDING the destination extra charge (if any). */
  fee: number;
  /** Cheapest visiting order found for multi-restaurant carts (same as input for single-restaurant). */
  orderedRestaurants: string[];

  estimatedFuelCost: number;
  riderCommission: number;
  platformShare: number;
  totalRiderPayment: number;

  /**
   * Manual per-destination surcharge (Table 5) included in `fee`, but
   * broken out separately here so the UI can show it as its own line
   * item (e.g. "Access surcharge: Rs 300") if desired. 0 if none set.
   * This amount is NOT part of fuel cost — it's split 50/50 between
   * riderCommission and platformShare above.
   */
  extraCharge: number;
}

/**
 * Full checkout estimate (distance, time, fee) for one or more
 * restaurants being delivered to a SINGLE destination (area or hotel),
 * sourced entirely from the manual tables.
 *
 * Accepts either a single restaurant name or an array (for
 * multi-restaurant carts, now supported via Table 1).
 *
 * Returns null when no visiting order has every required leg measured
 * yet — callers should fall back to the existing coordinate-based
 * calculateDeliveryFee/estimate in that case.
 */
export function calculateManualDeliveryEstimate(
  restaurantNames: string | string[],
  destinationName: string
): ManualDeliveryEstimate | null {
  const names = Array.isArray(restaurantNames) ? restaurantNames : [restaurantNames];
  if (names.length === 0) return null;

  const trip = getManualMultiStopTripDistanceTime(names, destinationName);
  if (trip.totalDistanceKm === null || trip.totalEstimatedMinutes === null) return null;

  // Customer-facing distance/time: everything except the final
  // Destination->Office return leg.
  const destinationToOffice = getAreaToOfficeDistanceTime(destinationName);
  if (
    !destinationToOffice ||
    destinationToOffice.distance_km === null ||
    destinationToOffice.estimated_minutes === null
  ) {
    return null; // shouldn't happen if trip.totalDistanceKm is non-null, but keeps this function self-contained
  }

  const customerFacingKm = trip.totalDistanceKm - destinationToOffice.distance_km;
  const travelMinutes = trip.totalEstimatedMinutes - destinationToOffice.estimated_minutes;

  const minMinutes = Math.round(PREP_BUFFER_MIN_MINUTES + DISPATCH_BUFFER_MIN_MINUTES + travelMinutes);
  const maxMinutes = Math.max(
    Math.round(PREP_BUFFER_MAX_MINUTES + DISPATCH_BUFFER_MAX_MINUTES + travelMinutes),
    minMinutes + 5
  );

  // --- Fuel cost (pure distance-based, never touched by the extra charge) ---
  const litersNeeded = trip.totalDistanceKm / MANUAL_BIKE_AVERAGE_KM_PER_LITER;
  const fuelCost = litersNeeded * MANUAL_FUEL_PRICE_PER_LITER;
  const extraStops = Math.max(names.length - 1, 0);
  const handlingFee = extraStops * MANUAL_EXTRA_STOP_HANDLING_FEE;

  // --- Distance Surcharge Logic ---
  let distanceSurcharge = 0;
  if (trip.totalDistanceKm >= 35) {
    distanceSurcharge = 200; // Adjust as needed
  } else if (trip.totalDistanceKm >= 15) {
    distanceSurcharge = 50;
  }

  // Base fee = fuel + profit + handling + distance surcharge, rounded up to nearest 10.
  // The manual destination extra charge is added AFTER this rounding step,
  // so it never gets folded into it.
  const baseFee = Math.ceil((fuelCost + MANUAL_BASE_PROFIT + handlingFee + distanceSurcharge) / 10) * 10;

  const estimatedFuelCost = Math.round(fuelCost);
  const remainingAfterFuel = baseFee - estimatedFuelCost;
  const baseRiderCommission = Math.round(remainingAfterFuel / 2);
  const basePlatformShare = remainingAfterFuel - baseRiderCommission; // avoids a rounding gap between the two halves

  // --- Manual per-destination extra charge (Table 5) — NOT fuel, split 50/50 ---
  const extraCharge = getDestinationExtraCharge(destinationName);
  const riderExtraShare = Math.round(extraCharge / 2);
  const platformExtraShare = extraCharge - riderExtraShare; // avoids a rounding gap, same trick as above

  const fee = baseFee + extraCharge;
  const riderCommission = baseRiderCommission + riderExtraShare;
  const platformShare = basePlatformShare + platformExtraShare;
  const totalRiderPayment = estimatedFuelCost + riderCommission;

  return {
    distanceKm: customerFacingKm,
    totalRoundTripKm: trip.totalDistanceKm,
    minMinutes,
    maxMinutes,
    timeLabel: `${minMinutes}-${maxMinutes} min`,
    fee,
    orderedRestaurants: trip.orderedRestaurants,
    estimatedFuelCost,
    riderCommission,
    platformShare,
    totalRiderPayment,
    extraCharge,
  };
}