import { shops, categoryConfig, Shop } from "@/data/config";

/**
 * Custom hook to determine if a shop or category is currently active.
 * Uses the config.ts file as the single source of truth.
 */
export const useAvailability = () => {
  
  const checkShopStatus = (shop: Shop): boolean => {
    // 1. If always open, skip calculations
    if (shop.alwaysOpen) return true;

    // 2. Get current time in minutes from midnight
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // 3. Parse times
    const [openH, openM] = shop.openTime.split(':').map(Number);
    const [closeH, closeM] = shop.closeTime.split(':').map(Number);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    // 4. Handle overnight logic (e.g., 6 PM to 2 AM)
    // If openTime > closeTime, the shop stays open past midnight
    if (openMinutes > closeMinutes) {
      return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
    }

    // 5. Standard daily hours
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  };

  const isCategoryAvailable = (catName: string): boolean => {
    // Safely check if category exists and is toggled on
    return !!categoryConfig[catName]?.isAvailable;
  };

  return { 
    checkShopStatus, 
    isCategoryAvailable 
  };
};