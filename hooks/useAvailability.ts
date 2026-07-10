import { shops, categoryConfig, Shop } from "@/data/config";

/**
 * Custom hook to determine if a shop or category is currently active.
 * Uses the config.ts file as the single source of truth.
 */
export const useAvailability = () => {
  
  const checkShopStatus = (shop: Shop & { isActive?: boolean }): boolean => {
    // NEW: Master Override Switch. 
    // If you add `isActive: false` to the mart in config.ts, it closes immediately.
    if (shop.isActive === false) return false;

    // 1. If always open, skip calculations (Protects your restaurant logic)
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
    if (openMinutes > closeMinutes) {
      return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
    }

    // 5. Standard daily hours (Handles Mart 08:00 to 17:00 perfectly)
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  };

  const isCategoryAvailable = (catName: string): boolean => {
    // RESTAURANT LOGIC: If the category is explicitly in your config, respect that toggle.
    if (categoryConfig && categoryConfig[catName] !== undefined) {
      return !!categoryConfig[catName].isAvailable;
    }
    
    // MART LOGIC: If the category is NOT in config (like "Fresh Food & Dairy"),
    // default to true so it doesn't get hidden. 
    return true;
  };

  return { 
    checkShopStatus, 
    isCategoryAvailable 
  };
};