import { shops } from "@/data/config";
import { products } from "@/data/products";

// Fetch all available shops (NEW - Added for the Hero Search Bar)
export async function getShops() {
  return shops;
}

// Fetch basic shop info (Name, Open/Close status)
export async function getShopById(id: string) {
  return shops.find((s) => s.id === id);
}

// Keep this for legacy items if you still need to filter raw products
export async function getProductsByShopId(shopId: string) {
  return products.filter((p) => p.shopId === shopId);
}

/**
 * NEW: Dynamically fetches a specific menu file.
 * This is the scalable way to handle menus without cluttering products.ts.
 */
export async function getMenuByShopId(shopId: string) {
  try {
    // This looks for a file named after the shopId inside /data/menus/
    // Example: /data/menus/yakandbull.ts
    const menuData = await import(`@/data/menus/${shopId}`);
    return menuData.menu;
  } catch (error) {
    console.error(`Menu file for ${shopId} not found in data/menus/`);
    return null;
  }
}