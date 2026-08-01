"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { products } from "../data/products";
import { useAvailability } from "../hooks/useAvailability";
import { useCart } from "@/store/useCart";
import { formatPrice } from "@/lib/utils";
import ProductCard, { ProductCardProps } from "./ProductCard";

// Official Panda Mart style categories
export const MART_CATEGORIES = [
  "All",
  "Fresh Produce",
  "Meat",
  "Dairy & Eggs",
  "Bakery & Breakfast",
  "Groceries",
  "Snacks & Chips",
  "Sweets & Chocolates",
  "Cold Beverages",
  "Tea & Coffee",
  "Household & Cleaning",
  "Personal Care",
  "Pharmacy & Wellness",
  "Baby Care",
  "Pet Care",
  "Stationery & Office",
];

// ---- Mart-only timing config ----
// Fully isolated from data/config.ts and the restaurant shops array.
// Change these two values any time to adjust mart hours.
const MART_OPEN_HOUR = 8; // 8 AM
const MART_CLOSE_HOUR = 4; // 4 AM (next day)

function getMartStatus() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = MART_OPEN_HOUR * 60;
  const closeMinutes = MART_CLOSE_HOUR * 60;

  // Overnight window: closing time is numerically earlier than opening
  // time (8 AM -> 4 AM), so "open" means past opening time OR still
  // before closing time (the part of the window after midnight).
  const isOvernight = closeMinutes <= openMinutes;
  const isOpen = isOvernight
    ? currentMinutes >= openMinutes || currentMinutes < closeMinutes
    : currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  const formatHour = (h: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:00 ${period}`;
  };

  return {
    isOpen,
    openText: formatHour(MART_OPEN_HOUR),
    closeText: formatHour(MART_CLOSE_HOUR),
  };
}

interface ProductGridProps {
  // Opens the shared CartDrawer owned by HomeClient — mirrors the
  // restaurant page's floating "View Cart" button, which needs the same
  // parent-owned drawer state.
  onCartClick?: () => void;
}

export default function ProductGrid({ onCartClick }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { isCategoryAvailable } = useAvailability();
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const { items, addItem } = useCart() as any;

  // ---- Item details modal state ----
  const [selectedProduct, setSelectedProduct] = useState<ProductCardProps | null>(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  const closeModal = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setSelectedProduct(null);
      setIsClosing(false);
    }, 150);
  };

  const openModal = (product: ProductCardProps) => {
    setSelectedProduct(product);
    setSelectedQty(1);
  };

  const confirmAddFromModal = () => {
    if (!selectedProduct) return;
    const hasDiscount =
      typeof selectedProduct.discountPrice === "number" &&
      selectedProduct.discountPrice > 0 &&
      selectedProduct.discountPrice < selectedProduct.price;
    const finalPrice = hasDiscount ? selectedProduct.discountPrice! : selectedProduct.price;

    const payload = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: finalPrice,
      image: selectedProduct.image,
      category: selectedProduct.category,
      shopId: selectedProduct.shopId || "mart-1",
    };

    for (let i = 0; i < selectedQty; i++) {
      addItem(payload);
    }
    closeModal();
  };

  // Let a normal mouse wheel scroll the category bar horizontally.
  // Mice only send vertical wheel deltas, so without this, desktop
  // users with no trackpad/touchscreen have no way to move the bar.
  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const scrollCategories = (direction: "left" | "right") => {
    const el = categoryScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -240 : 240, behavior: "smooth" });
  };

  // Re-check every minute so the grid auto-closes/opens without a page refresh
  const [martStatus, setMartStatus] = useState(getMartStatus());
  useEffect(() => {
    const interval = setInterval(() => {
      setMartStatus(getMartStatus());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    // Mart is closed entirely outside operating hours — nothing to show.
    if (!martStatus.isOpen) return [];

    return products.filter((p) => {
      // 1. Basic Availability Check (category-level toggle, e.g. category disabled centrally)
      if (!isCategoryAvailable(p.category)) return false;

      // 2. Search Logic
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());

      // 3. Category Logic
      if (selectedCategory === "All") {
        return MART_CATEGORIES.includes(p.category) && matchesSearch;
      }

      return p.category === selectedCategory && matchesSearch;
    });
  }, [selectedCategory, search, isCategoryAvailable, martStatus.isOpen]);

  // Floating cart bar totals — mirrors the restaurant page's floating button.
  const cartCount = items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0);
  const cartTotal = items.reduce((sum: number, i: any) => sum + i.price * (i.quantity || 1), 0);

  const modalHasDiscount =
    !!selectedProduct &&
    typeof selectedProduct.discountPrice === "number" &&
    selectedProduct.discountPrice > 0 &&
    selectedProduct.discountPrice < selectedProduct.price;
  const modalUnitPrice = selectedProduct
    ? modalHasDiscount
      ? selectedProduct.discountPrice!
      : selectedProduct.price
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-6 py-8 pb-28">
      {/* Search Bar - Professional rounded design */}
      <div className="px-6 md:px-0 mb-6">
        <div className="relative max-w-xl">
          <input
            value={search}
            className="w-full p-4 pl-12 pr-10 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-purple-600 focus:bg-white transition-all font-medium text-gray-900"
            placeholder="Search for reliable mart items..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="absolute left-4 top-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search.length > 0 && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Panda Mart Style Category Slider */}
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md py-4 border-b border-gray-100 mb-8">
        <div className="relative group">
          {/* Left arrow - desktop only, mouse users need a click target since a mouse wheel can't swipe */}
          <button
            type="button"
            onClick={() => scrollCategories("left")}
            aria-label="Scroll categories left"
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={categoryScrollRef}
            className="flex overflow-x-auto gap-3 px-6 no-scrollbar pb-2 scroll-smooth cursor-grab active:cursor-grabbing"
          >
            {MART_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 ease-in-out ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Right arrow - desktop only */}
          <button
            type="button"
            onClick={() => scrollCategories("right")}
            aria-label="Scroll categories right"
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-6 md:px-0">
        {!martStatus.isOpen ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 mx-6 md:mx-0">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase">Mart is Closed</h3>
            <p className="text-gray-500 font-medium text-sm mt-1">
              We're open daily from {martStatus.openText} to {martStatus.closeText}. Please check back soon.
            </p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} {...p} onSelect={openModal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 mx-6 md:mx-0">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase">No items found</h3>
            <p className="text-gray-500 font-medium text-sm mt-1">Try selecting a different category or search term.</p>
          </div>
        )}
      </div>

      {/* Item Details Modal — same zoom-in / backdrop-close pattern as the
          restaurant menu item modal, minus the variant picker (mart
          products don't have variants). */}
      {selectedProduct && (
        <div
          onClick={closeModal}
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4 transition-opacity duration-150 ${
            isClosing ? "opacity-0" : "opacity-100 animate-in fade-in duration-200"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl transition-all duration-150 ${
              isClosing
                ? "opacity-0 scale-95"
                : "opacity-100 scale-100 animate-in zoom-in-95 slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200"
            }`}
          >
            <div className="relative w-full h-56 bg-gray-100 flex-shrink-0 flex items-center justify-center">
              {modalHasDiscount && (
                <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">
                  Sale
                </span>
              )}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white transition-colors rounded-full text-gray-600 shadow-sm"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
              {selectedProduct.image ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-300 text-xs font-black uppercase tracking-widest">Preview</span>
              )}
            </div>

            <div className="p-6 overflow-y-auto">
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-2">
                {selectedProduct.category}
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight leading-tight text-gray-900 mb-3">
                {selectedProduct.name}
              </h2>

              <div className="flex items-center gap-3">
                <span className="font-extrabold text-2xl text-purple-600">
                  {formatPrice(modalUnitPrice)}
                </span>
                {modalHasDiscount && (
                  <span className="text-gray-400 text-sm font-medium line-through">
                    {formatPrice(selectedProduct.price)}
                  </span>
                )}
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center justify-between mt-6">
                <span className="font-bold text-sm text-gray-700">Quantity</span>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
                  <button
                    onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-sm text-purple-600 hover:bg-purple-50 active:scale-90 transition-all"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-[1.5rem] text-center font-black text-base text-gray-900">
                    {selectedQty}
                  </span>
                  <button
                    onClick={() => setSelectedQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-sm text-purple-600 hover:bg-purple-50 active:scale-90 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] flex-shrink-0">
              <button
                onClick={confirmAddFromModal}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-base hover:bg-purple-700 active:scale-95 transition-all flex justify-between px-6"
              >
                <span>Add to Cart</span>
                <span>{formatPrice(modalUnitPrice * selectedQty)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Bar — same pattern as the restaurant page's floating
          "View Cart" button, opening the shared CartDrawer owned by HomeClient. */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-0 w-full px-6 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button
            onClick={() => onCartClick?.()}
            className="w-full max-w-7xl mx-auto bg-purple-600 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center active:scale-95 transition-transform"
          >
            <div className="bg-white/20 px-3 py-1 rounded-lg font-bold text-sm flex items-center gap-1.5">
              <ShoppingBag size={14} />
              {cartCount} items
            </div>
            <span className="font-bold uppercase tracking-widest text-sm">View Cart</span>
            <span className="font-bold">{formatPrice(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}