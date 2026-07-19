"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/store/useCart";
import { useAvailability } from "@/hooks/useAvailability";
import { shops } from "@/data/config";

/**
 * Mount this once near the root of the app (e.g. in app/layout.tsx).
 * Catches the case where a cart was saved to localStorage while a shop
 * was open, and the site is then reopened after that shop has closed —
 * the stale items would otherwise sit in the cart, fully orderable,
 * with nothing else in the app re-checking their validity.
 *
 * IMPORTANT: zustand's `persist` middleware rehydrates from
 * localStorage *asynchronously*, after the first render. A plain
 * `useEffect(() => {...}, [])` fires before hydration finishes, sees
 * items === [], and never re-checks once the real cart appears. This
 * version waits for `items` to actually have content before making
 * its one-time decision.
 */
export default function CartValidator() {
  const { items, clearCart } = useCart() as any;
  const { checkShopStatus } = useAvailability();
  const hasValidated = useRef(false);

  useEffect(() => {
    if (hasValidated.current) return;
    if (!items || items.length === 0) return; // empty, or not yet rehydrated — wait

    hasValidated.current = true;

    const shop = shops.find((s) => s.id === items[0].shopId);
    const stillOpen = shop && checkShopStatus(shop);

    if (!stillOpen) {
      clearCart();
    }
  }, [items, checkShopStatus, clearCart]);

  return null;
}