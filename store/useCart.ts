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
      
      addItem: (item) => set((state) => {
        // 1. Check if trying to add from a different restaurant
        const hasDifferentShop = state.items.length > 0 && state.items[0].shopId !== item.shopId;

        if (hasDifferentShop) {
          // Different restaurant: WIPE cart, add new item with quantity 1
          return { items: [{ ...item, quantity: 1 }] };
        }

        // 2. Same restaurant: Check if item is already in the cart
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

        // 3. If it's a completely new item, add it with quantity 1
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
      
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