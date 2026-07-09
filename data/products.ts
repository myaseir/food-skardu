export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  shopId: string; // Must match the ID in data/config.ts
}

export const products: Product[] = [
  // FOOD CATEGORY
  { id: "p1", name: "Margherita Pizza", price: 1200, category: "Food", shopId: "rest-1" },
  { id: "p2", name: "BBQ Platter", price: 2500, category: "Food", shopId: "rest-2" },
  
  // MART CATEGORY
  { id: "m1", name: "Fresh Milk (1L)", price: 250, category: "Mart", shopId: "mart-1" },
  { id: "m2", name: "Basmati Rice (5kg)", price: 1800, category: "Mart", shopId: "mart-1" },

  // HARDWARE CATEGORY
  { id: "h1", name: "Hammer", price: 800, category: "Hardware", shopId: "mart-1" },
  
  // Add your remaining thousands of items here...
];