import { Shop } from "@/data/config";
import { SKARDU_LOCATIONS } from "@/data/location";

const FUEL_PRICE_PER_LITER = 299;
const BIKE_AVERAGE_KM_PER_LITER = 55;
const BASE_PROFIT = 100;

export const calculateDeliveryFee = (shop: Shop, hotelName: string) => {
  const hotelDist = SKARDU_LOCATIONS[hotelName] || 5.0; // Default to 5km if hotel not found
  const restDist = shop.distanceFromHub;

  // Total trip: Office -> Restaurant -> Hotel -> Office
  const totalTripDistance = restDist + (restDist + hotelDist) + hotelDist; 
  
  const litersNeeded = totalTripDistance / BIKE_AVERAGE_KM_PER_LITER;
  const fuelCost = litersNeeded * FUEL_PRICE_PER_LITER;
  
  const totalFee = fuelCost + BASE_PROFIT;
  
  // Return rounded to the nearest 10
  return Math.ceil(totalFee / 10) * 10;
};