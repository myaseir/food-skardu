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

export interface CustomizationField {
  id: string;
  label: string;
  type?: "text" | "textarea" | "number";
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  desc?: string;
  image?: string;
  sound?: string;
  variants?: Variant[];
  customizations?: CustomizationField[];
}

export interface Category {
  name: string;
  emoji?: string;
  items: MenuItem[];
}

export interface Menu {
  name: string;
  logo?: string;
  categories: Category[];
}

export type SelectedItem = MenuItem & { category: string };

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
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  const { items, addItem } = useCart();
  const { checkShopStatus } = useAvailability();

  const isShopOpen = checkShopStatus(shop);
  const statusText = getOpenStatusText(shop);
  const cartTotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

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
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [menu]);

  const closeModal = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setSelectedItem(null);
      setSelectedVariant(null);
      setCustomValues({});
      setIsClosing(false);
    }, 150);
  };

  const handleCardClick = (item: MenuItem, catName: string) => {
    if (!isShopOpen) return;
    setSelectedItem({ ...item, category: catName });
    setSelectedVariant(item.variants && item.variants.length > 0 ? item.variants[0] : null);
    // Start each item's note fields empty (or prefilled if you ever want defaults)
    setCustomValues({});
  };

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem, catName: string) => {
    e.stopPropagation();
    if (!isShopOpen) return;

    // Quick-add bypasses the modal, so items with variants OR customizations
    // (e.g. "Message on Cake") need the full modal to collect that info.
    if ((item.variants && item.variants.length > 0) || (item.customizations && item.customizations.length > 0)) {
      handleCardClick(item, catName);
      return;
    }

    const effectivePrice = getEffectivePrice(item.price, item.discountPrice);
    addItem({ ...item, price: effectivePrice, shopId, category: catName });
  };

  // Builds a readable "Message: Happy Birthday Sara" style notes string
  // from whatever customization fields were filled in.
  const buildNotesFromCustomValues = (item: MenuItem) => {
    if (!item.customizations || item.customizations.length === 0) return undefined;
    const parts = item.customizations
      .map((field) => {
        const val = customValues[field.id]?.trim();
        return val ? `${field.label}: ${val}` : null;
      })
      .filter(Boolean);
    return parts.length > 0 ? parts.join(" \u00B7 ") : undefined;
  };

  const hasMissingRequiredCustomization = (item: MenuItem) => {
    if (!item.customizations) return false;
    return item.customizations.some(
      (field) => field.required && !customValues[field.id]?.trim()
    );
  };

  const confirmAdd = () => {
    if (!isShopOpen || !selectedItem) return;
    if (hasMissingRequiredCustomization(selectedItem)) return;

    const notes = buildNotesFromCustomValues(selectedItem);

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
        ...(notes ? { notes, customValues: { ...customValues } } : {}),
      });
    } else {
      const effectivePrice = getEffectivePrice(selectedItem.price, selectedItem.discountPrice);
      addItem({
        ...selectedItem,
        price: effectivePrice,
        shopId,
        category: selectedItem.category,
        ...(notes ? { notes, customValues: { ...customValues } } : {}),
      });
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

  const confirmDisabled =
    (selectedHasVariants && !selectedVariant) ||
    (selectedItem ? hasMissingRequiredCustomization(selectedItem) : false);

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
    customValues,
    setCustomValues,
    confirmDisabled,
    closeModal,
    handleCardClick,
    handleQuickAdd,
    confirmAdd,
  };
}