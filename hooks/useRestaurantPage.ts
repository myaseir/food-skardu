"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/useCart";
import { useAvailability } from "@/hooks/useAvailability";
import { getOpenStatusText } from "@/utils/shopStatus";

export interface Variant {
  name: string;
  price: number;
  discountPrice?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  desc?: string;
  image?: string;
  sound?: string; // optional per-item sound effect / voice line path
  variants?: Variant[];
}

export interface Category {
  name: string;
  emoji?: string; // optional decorative emoji shown next to the category heading
  items: MenuItem[];
}

export interface Menu {
  name: string;
  logo?: string;
  categories: Category[];
}

export type SelectedItem = MenuItem & { category: string };

// A discount only counts if it's a positive number strictly less than the
// original price — protects against bad data (e.g. discountPrice higher
// than price, or 0/negative values).
export function getEffectivePrice(price: number, discountPrice?: number): number {
  const hasDiscount = typeof discountPrice === "number" && discountPrice > 0 && discountPrice < price;
  return hasDiscount ? discountPrice : price;
}

export function hasValidDiscount(price: number, discountPrice?: number): boolean {
  return typeof discountPrice === "number" && discountPrice > 0 && discountPrice < price;
}

export function useRestaurantPage(shop: any, menu: Menu, shopId: string) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const { items, addItem } = useCart();
  const { checkShopStatus } = useAvailability();

  const isShopOpen = checkShopStatus(shop);
  const statusText = getOpenStatusText(shop);
  const cartTotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  // Scroll-spy: watch each category section and track whichever one is
  // most visible near the top of the viewport, so CategoryNav can bold it.
  useEffect(() => {
    const sections = menu.categories
      .map((cat) => document.getElementById(cat.name))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveCategory(visible[0].target.id);
        }
      },
      {
        rootMargin: "-140px 0px -70% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [menu]);

  // Close the modal with a small closing animation, then clear state.
  const closeModal = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setSelectedItem(null);
      setSelectedVariant(null);
      setIsClosing(false);
    }, 150);
  };

  // Tapping a card opens the full details view.
  const handleCardClick = (item: MenuItem, catName: string) => {
    if (!isShopOpen) return;
    setSelectedItem({ ...item, category: catName });
    setSelectedVariant(item.variants && item.variants.length > 0 ? item.variants[0] : null);
  };

  // Quick-add: simple items add straight to cart; items with variants fall
  // back to opening the details modal since there's no single price to add.
  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem, catName: string) => {
    e.stopPropagation();
    if (!isShopOpen) return;

    if (item.variants && item.variants.length > 0) {
      handleCardClick(item, catName);
      return;
    }

    const effectivePrice = getEffectivePrice(item.price, item.discountPrice);
    addItem({ ...item, price: effectivePrice, shopId, category: catName });
  };

  // Handles "Add to Cart" from inside the details modal, for both simple
  // items and variant items.
  const confirmAdd = () => {
    if (!isShopOpen || !selectedItem) return;

    if (selectedItem.variants && selectedItem.variants.length > 0) {
      if (!selectedVariant) return;
      const effectivePrice = getEffectivePrice(selectedVariant.price, selectedVariant.discountPrice);

      addItem({
        ...selectedItem,
        id: `${selectedItem.id}-${selectedVariant.name}`,
        name: `${selectedItem.name} (${selectedVariant.name})`,
        price: effectivePrice,
        shopId,
        category: selectedItem.category,
      });
    } else {
      const effectivePrice = getEffectivePrice(selectedItem.price, selectedItem.discountPrice);
      addItem({ ...selectedItem, price: effectivePrice, shopId, category: selectedItem.category });
    }

    closeModal();
  };

  const selectedHasVariants = !!(selectedItem?.variants && selectedItem.variants.length > 0);
  const modalDisplayPrice = selectedHasVariants
    ? selectedVariant
      ? getEffectivePrice(selectedVariant.price, selectedVariant.discountPrice)
      : 0
    : selectedItem
    ? getEffectivePrice(selectedItem.price, selectedItem.discountPrice)
    : 0;

  return {
    isCartOpen,
    setIsCartOpen,
    activeCategory,
    selectedItem,
    selectedVariant,
    setSelectedVariant,
    isClosing,
    isShopOpen,
    statusText,
    cartTotal,
    items,
    selectedHasVariants,
    modalDisplayPrice,
    closeModal,
    handleCardClick,
    handleQuickAdd,
    confirmAdd,
  };
}