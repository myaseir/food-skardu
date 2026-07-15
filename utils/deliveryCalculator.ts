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