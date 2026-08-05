"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";
import { Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { getMenuByShopId } from "@/lib/dataService";
import { useAvailability } from "@/hooks/useAvailability";
import { shops, Shop } from "@/data/config";

export default function CartDrawer({ isOpen, onClose }: any) {
  const { items, removeItem, addItem, removeSingleItem, clearCart } = useCart() as any;
  const { checkShopStatus } = useAvailability();
  const router = useRouter();

  // Tracks the checkout navigation so the drawer can stay open (with a
  // loading state on the button) until the /checkout route has actually
  // finished rendering. Without this, closing the drawer on click and
  // letting <Link> navigate async meant slow connections would show a
  // flash of the home page underneath while /checkout was still loading.
  const [isNavigatingToCheckout, startCheckoutTransition] = useTransition();

  // Distinct list of every shop (restaurant or mart) represented in the
  // cart — carts can now span multiple shops, so this replaces the old
  // "just look at items[0].shopId" logic.
  const shopsInCart = useMemo(() => {
    if (items.length === 0) return [];
    const seen = new Set<string>();
    const result: Shop[] = [];
    for (const item of items) {
      if (!seen.has(item.shopId)) {
        const shop = shops.find((s) => s.id === item.shopId);
        if (shop) {
          result.push(shop);
          seen.add(item.shopId);
        }
      }
    }
    return result;
  }, [items]);

  // Live check: is EVERY shop in the cart currently open? A multi-shop
  // cart is only orderable if all of its shops are open — re-evaluates
  // on every render the drawer is open, since a shop can close while the
  // user is browsing the cart.
  const closedShops = useMemo(
    () => shopsInCart.filter((shop) => !checkShopStatus(shop)),
    [shopsInCart, checkShopStatus]
  );
  const allShopsOpen = closedShops.length === 0;

  // If any shop in the cart closed while the drawer was open (or on load,
  // before CartValidator gets a chance to run), wipe the cart so nothing
  // stale can be ordered.
  useEffect(() => {
    if (shopsInCart.length > 0 && !allShopsOpen) {
      clearCart();
    }
  }, [shopsInCart, allShopsOpen, clearCart]);

  // Tracks whether we've actually kicked off a checkout navigation, so
  // the effect below doesn't fire onClose() on initial mount (a plain
  // ref, not state, since changing it should never trigger a re-render).
  const navigationStartedRef = useRef(false);

  // Once the /checkout transition finishes (isNavigatingToCheckout flips
  // back to false), the new route is ready to be shown, so only THEN do
  // we close the drawer. This is what keeps the cart visible the whole
  // time instead of dropping back to the home page while checkout loads.
  useEffect(() => {
    if (!isNavigatingToCheckout && navigationStartedRef.current) {
      navigationStartedRef.current = false;
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNavigatingToCheckout]);

  const handleContinue = () => {
    navigationStartedRef.current = true;
    startCheckoutTransition(() => {
      router.push("/checkout");
    });
  };

  // Updated Math: Price * Quantity
  const total = items.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0);

  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSuggestions() {
      if (items.length === 0 || !items[0].shopId) {
        setSuggestions([]);
        return;
      }
      const currentShopId = items[0].shopId;

      // "Popular with your order" suggestions only make sense for
      // restaurant menus — mart items live in products.ts, not a
      // menus/*.ts file, so getMenuByShopId() has nothing to fetch for
      // a mart shopId and would throw the "menu file not found" error.
      const shopForSuggestions = shops.find((s) => s.id === currentShopId);
      if (!shopForSuggestions || shopForSuggestions.type !== "restaurant") {
        setSuggestions([]);
        return;
      }

      try {
        const menu = await getMenuByShopId(currentShopId);
        if (!menu) return;

        let allMenuProps: any[] = [];
        menu.categories.forEach((cat: any) => {
          cat.items.forEach((item: any) => {
            allMenuProps.push({ ...item, shopId: currentShopId, category: cat.name });
          });
        });

        const inCartIds = items.map((i: any) => i.id);
        let availableItems = allMenuProps.filter(i => !inCartIds.includes(i.id));

        const addOnKeywords = ['side', 'beverage', 'drink', 'dessert', 'add-on', 'extras'];
        let logicallySuitable = availableItems.filter(i => 
          addOnKeywords.some(keyword => i.category.toLowerCase().includes(keyword))
        );

        if (logicallySuitable.length < 3) {
          const cheaperItems = availableItems.filter(i => i.price < 400 && !logicallySuitable.find(ls => ls.id === i.id));
          logicallySuitable = [...logicallySuitable, ...cheaperItems];
        }

        setSuggestions(logicallySuitable.slice(0, 4));
      } catch (error) {
        console.error("Failed to load suggestions", error);
      }
    }
    fetchSuggestions();
  }, [items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="h-full w-full max-w-md bg-gray-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm z-10">
          <h2 className="text-xl font-black uppercase tracking-tighter">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors">✕</button>
        </div>

        {closedShops.length > 0 && (
          <div className="bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wide px-6 py-3 text-center">
            {closedShops.map((s) => s.name).join(", ")} {closedShops.length > 1 ? "are" : "is"} currently closed. Your cart has been cleared.
          </div>
        )}
        
        {/* SCROLLABLE AREA */}
        <div className="flex-grow overflow-y-auto flex flex-col">
          
          <div className="bg-white px-6 py-2 mb-4 flex-grow overflow-y-auto max-h-[400px]">
            {items.length === 0 ? (
              <p className="py-8 text-center text-gray-500 font-bold uppercase text-sm">Your cart is empty.</p>
            ) : (
              items.map((item: any, index: number) => (
                <div key={`${item.id}-${index}`} className="flex gap-4 py-4 border-b border-gray-100 items-center">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                    <p className="font-black text-purple-600 text-xs">Rs. {item.price * (item.quantity || 1)}</p>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button onClick={() => removeSingleItem(item.id)} className="p-1 hover:bg-gray-200 rounded"><Minus size={14}/></button>
                    <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => addItem(item)} className="p-1 hover:bg-gray-200 rounded"><Plus size={14}/></button>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Slider sticks to the bottom of the list */}
          {suggestions.length > 0 && (
            <div className="bg-white py-6 mt-auto">
              <h3 className="px-6 font-black uppercase text-sm mb-4 text-gray-900">Popular with your order</h3>
              <div className="flex overflow-x-auto gap-4 px-6 pb-4 no-scrollbar">
                {suggestions.map((addon) => (
                  <div key={addon.id} className="shrink-0 w-32 border border-gray-100 rounded-2xl p-2 flex flex-col gap-2 shadow-sm bg-white">
                    <div className="relative w-full h-20 rounded-xl overflow-hidden bg-gray-50">
                      {addon.image && <Image src={addon.image} alt={addon.name} fill className="object-cover" />}
                    </div>
                    <p className="font-bold text-xs truncate text-gray-800">{addon.name}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="font-black text-purple-600 text-xs">Rs. {addon.price}</p>
                      <button onClick={() => addItem(addon)} className="bg-purple-50 text-purple-600 p-1.5 rounded-full hover:bg-purple-600 hover:text-white transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="bg-white p-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Subtotal</span>
              <span className="font-black text-lg text-gray-900">Rs. {total}</span>
            </div>
            {allShopsOpen ? (
              <button
                onClick={handleContinue}
                disabled={isNavigatingToCheckout}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-700 disabled:opacity-70 transition-colors"
              >
                {isNavigatingToCheckout ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            ) : (
              <button disabled className="w-full flex items-center justify-center bg-gray-300 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest cursor-not-allowed">
                Shop Closed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}