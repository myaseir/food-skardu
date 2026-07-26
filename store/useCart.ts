import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Define the shape of an individual product
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  desc?: string;
  shopId?: string;
  category?: string;
  quantity?: number; // Tracks how many of this item are in the cart
}

// 2. Define the shape of the store's state and actions
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  removeSingleItem: (id: string) => void; // Decreases quantity by 1
  clearCart: () => void;
}

// 3. Create the store wrapped in the 'persist' middleware
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      // Multi-restaurant carts are now allowed — items from different
      // shopIds simply coexist in the same cart. The delivery calculator
      // (calculateDeliveryFee) handles pricing the multi-stop trip; this
      // store no longer needs to enforce a single-restaurant rule.
      addItem: (item) => set((state) => {
        // Check if this exact item (same id) already exists in the cart.
        // NOTE: if two different restaurants happen to reuse the same
        // item id (e.g. both use "1" for their first menu item), this
        // would incorrectly match them as the same line. If that's
        // possible in your data, match on `i.id === item.id && i.shopId === item.shopId`
        // instead — see commented-out version below.
        const existingItem = state.items.find((i) => i.id === item.id);
        
        if (existingItem) {
          // If it exists, increase its quantity by 1
          return {
            items: state.items.map((i) =>
              i.id === item.id 
                ? { ...i, quantity: (i.quantity || 1) + 1 } 
                : i
            ),
          };
        }

        // New item — could be from a new restaurant or an existing one,
        // doesn't matter now. Just add it.
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),

      // ---- Safer alternative if item IDs aren't guaranteed unique across shops ----
      // addItem: (item) => set((state) => {
      //   const existingItem = state.items.find(
      //     (i) => i.id === item.id && i.shopId === item.shopId
      //   );
      //
      //   if (existingItem) {
      //     return {
      //       items: state.items.map((i) =>
      //         i.id === item.id && i.shopId === item.shopId
      //           ? { ...i, quantity: (i.quantity || 1) + 1 }
      //           : i
      //       ),
      //     };
      //   }
      //
      //   return { items: [...state.items, { ...item, quantity: 1 }] };
      // }),
      
      // Completely removes the item row regardless of quantity
      removeItem: (id) => set((state) => ({ 
        items: state.items.filter((i) => i.id !== id) 
      })),

      // Decreases quantity by 1. If it hits 0, it removes the item completely.
      removeSingleItem: (id) => set((state) => {
        const existingItem = state.items.find((i) => i.id === id);
        
        if (existingItem && (existingItem.quantity || 1) > 1) {
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: (i.quantity || 1) - 1 } : i
            ),
          };
        }
        
        // If quantity is 1 (or undefined), remove it from the array
        return { items: state.items.filter((i) => i.id !== id) };
      }),
      
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'food-skardu-cart', // The unique key name in localStorage
      storage: createJSONStorage(() => localStorage), // Explicitly use localStorage
    }
  )
);