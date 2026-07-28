"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getShopById, getMenuByShopId } from "@/lib/dataService";
import ShopStatusBadge from "@/components/ShopStatusBadge";
import CategoryNav from "@/components/CategoryNav";
import { useCart } from "@/store/useCart";
import CartDrawer from "@/components/CartDrawer";
import { useAvailability } from "@/hooks/useAvailability";
import { getOpenStatusText } from "@/utils/shopStatus";

interface Variant {
  name: string;
  price: number;
  discountPrice?: number;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  desc?: string;
  image?: string;
  variants?: Variant[];
}

interface Category {
  name: string;
  items: MenuItem[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// A discount only counts if it's a positive number strictly less than the
// original price — protects against bad data (e.g. discountPrice higher
// than price, or 0/negative values).
function getEffectivePrice(price: number, discountPrice?: number): number {
  const hasDiscount = typeof discountPrice === "number" && discountPrice > 0 && discountPrice < price;
  return hasDiscount ? discountPrice : price;
}

function hasValidDiscount(price: number, discountPrice?: number): boolean {
  return typeof discountPrice === "number" && discountPrice > 0 && discountPrice < price;
}

export default function RestaurantPageClient({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [data, setData] = useState<{ shop: any; menu: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { items, addItem } = useCart();
  const { checkShopStatus } = useAvailability();

  // selectedItem doubles as the "item details" modal state — it opens for
  // every item on tap, and additionally shows a variant picker when the
  // item has variants.
  const [selectedItem, setSelectedItem] = useState<(MenuItem & { category: string }) | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const cartTotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  useEffect(() => {
    async function fetchData() {
      try {
        const shopData = await getShopById(id);
        const menuData = await getMenuByShopId(id);

        if (!shopData || !menuData) {
          setLoading(false);
          return;
        }

        setData({ shop: shopData, menu: menuData });
      } catch (error) {
        console.error("Failed to load restaurant data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Scroll-spy: watch each category section and track whichever one is
  // most visible near the top of the viewport, so CategoryNav can bold it.
  useEffect(() => {
    if (!data) return;

    const sections = data.menu.categories
      .map((cat: Category) => document.getElementById(cat.name))
      .filter((el: HTMLElement | null): el is HTMLElement => el !== null);

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

    sections.forEach((section: HTMLElement) => observer.observe(section));

    return () => observer.disconnect();
  }, [data]);

  // Close the modal with a small closing animation, then clear state.
  // Used by both the "X" button and a backdrop click.
  const closeModal = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setSelectedItem(null);
      setSelectedVariant(null);
      setIsClosing(false);
    }, 150);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-semibold animate-pulse uppercase tracking-widest text-sm">
          Loading Menu...
        </p>
      </div>
    );
  }

  if (!data) return notFound();

  const { shop, menu } = data;
  const isShopOpen = checkShopStatus(shop);
  // Same per-shop hours logic RestaurantList's card text uses — returns
  // e.g. "Opens at 6:00 PM", or null if manually closed (shop.isActive
  // === false) or always open. Keeps this page's closed banner honest
  // instead of a hardcoded time range for every shop.
  const statusText = getOpenStatusText(shop);

  // Tapping anywhere on the card opens the full details view (with a subtle
  // zoom-in animation) — this is where the untruncated description lives.
  const handleCardClick = (item: MenuItem, catName: string) => {
    if (!isShopOpen) return;
    setSelectedItem({ ...item, category: catName });
    setSelectedVariant(item.variants && item.variants.length > 0 ? item.variants[0] : null);
  };

  // The "+" button is the fast quick-add path. For simple items (no
  // variants) it adds straight to the cart with no modal, preserving the
  // one-tap convenience. Items with variants can't be quick-added — there's
  // no single price to add — so it falls back to opening the same details
  // view the card tap uses.
  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem, catName: string) => {
    e.stopPropagation();
    if (!isShopOpen) return;

    if (item.variants && item.variants.length > 0) {
      handleCardClick(item, catName);
      return;
    }

    const effectivePrice = getEffectivePrice(item.price, item.discountPrice);
    addItem({ ...item, price: effectivePrice, shopId: id, category: catName });
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
        shopId: id,
        category: selectedItem.category,
      });
    } else {
      const effectivePrice = getEffectivePrice(selectedItem.price, selectedItem.discountPrice);
      addItem({ ...selectedItem, price: effectivePrice, shopId: id, category: selectedItem.category });
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

  return (
    <main className="min-h-screen bg-gray-50 pb-24 relative font-sans antialiased">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm relative">
        <Link
          href="/"
          className="absolute top-6 left-6 z-30 bg-white/80 backdrop-blur-md p-2 rounded-full border border-gray-100 shadow-sm hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="max-w-3xl mx-auto flex items-center gap-4 pl-10">
          {menu.logo ? (
            <Image
              src={menu.logo}
              alt={menu.name}
              width={80}
              height={80}
              className={`rounded-2xl border object-cover ${!isShopOpen ? "grayscale opacity-60" : ""}`}
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl border bg-gray-100 flex items-center justify-center text-gray-300 text-[9px] font-semibold uppercase tracking-widest text-center px-1">
              No Logo
            </div>
          )}
          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${!isShopOpen ? "text-gray-500" : "text-gray-900"}`}>
              {menu.name}
            </h1>
            <ShopStatusBadge shop={shop} />
          </div>
        </div>
      </div>

      {/* Closed banner — uses this shop's actual configured hours instead
          of a fixed time range, so it's accurate for every shop rather
          than only the one that happens to open 8 AM–9 PM. Falls back to
          a plain message when the shop has been manually closed (no
          hours to show in that case). */}
      {!isShopOpen && (
        <div className="bg-gray-800 text-white text-center py-2.5 px-4">
          <p className="text-xs font-semibold uppercase tracking-widest">
            {statusText ? `Currently Closed \u00B7 ${statusText}` : "Currently Closed"}
          </p>
        </div>
      )}

      <CategoryNav categories={menu.categories} activeCategory={activeCategory} />

      {/* Menu */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {menu.categories.map((cat: Category) => (
          <section key={cat.name} id={cat.name} className="scroll-mt-24 mb-12">
            <h2 className={`text-lg font-bold mb-6 tracking-tight ${!isShopOpen ? "text-gray-500" : "text-gray-900"}`}>
              {cat.name}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {cat.items.map((item: MenuItem) => {
                const isVariant = item.variants && item.variants.length > 0;

                const simpleHasDiscount = !isVariant && hasValidDiscount(item.price, item.discountPrice);
                const simpleEffectivePrice = !isVariant
                  ? getEffectivePrice(item.price, item.discountPrice)
                  : item.price;

                let variantEffectivePrices: number[] = [];
                let variantAnyDiscount = false;
                let variantCheapestOriginal = 0;

                if (isVariant) {
                  variantEffectivePrices = item.variants!.map((v) => getEffectivePrice(v.price, v.discountPrice));
                  variantAnyDiscount = item.variants!.some((v) => hasValidDiscount(v.price, v.discountPrice));

                  let cheapestIndex = 0;
                  for (let i = 1; i < variantEffectivePrices.length; i++) {
                    if (variantEffectivePrices[i] < variantEffectivePrices[cheapestIndex]) cheapestIndex = i;
                  }
                  variantCheapestOriginal = item.variants![cheapestIndex].price;
                }

                const displayPrice = isVariant
                  ? `Rs. ${Math.min(...variantEffectivePrices)}`
                  : `Rs. ${simpleEffectivePrice}`;

                const showBadge = isShopOpen && (simpleHasDiscount || variantAnyDiscount);

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={isShopOpen ? 0 : -1}
                    aria-disabled={!isShopOpen}
                    onClick={() => handleCardClick(item, cat.name)}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && isShopOpen) {
                        handleCardClick(item, cat.name);
                      }
                    }}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 flex flex-col ${
                      isShopOpen
                        ? "hover:shadow-lg cursor-pointer active:scale-[0.98]"
                        : "cursor-not-allowed"
                    }`}
                  >
                    <div className="relative">
                      <div className="relative w-full aspect-square rounded-t-2xl overflow-hidden bg-gray-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className={`object-cover ${!isShopOpen ? "grayscale opacity-60" : ""}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-semibold uppercase tracking-widest">
                            No Image
                          </div>
                        )}

                        {showBadge && (
                          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">
                            Sale
                          </span>
                        )}

                        {!isShopOpen && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="bg-white/90 text-gray-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                              Closed
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(e, item, cat.name)}
                        disabled={!isShopOpen}
                        aria-label={
                          isShopOpen
                            ? isVariant
                              ? `Choose options for ${item.name}`
                              : `Add ${item.name} to cart`
                            : `${item.name} unavailable, shop closed`
                        }
                        className={`absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full text-white font-bold text-lg flex items-center justify-center shadow-lg border-4 border-white transition-all ${
                          isShopOpen
                            ? "bg-purple-600 hover:bg-purple-700 active:scale-90"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        +
                      </button>
                    </div>

                    <div className="p-3 pt-5 flex flex-col flex-grow text-left">
                      <h3 className={`font-semibold text-sm leading-snug tracking-tight line-clamp-2 ${!isShopOpen ? "text-gray-500" : "text-gray-900"}`}>
                        {item.name}
                      </h3>
                      {item.desc && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{item.desc}</p>
                      )}
                      {/* Price always shows — even when the shop is closed —
                          so people can still browse rates. Color drops to
                          gray to keep the "unavailable" feel, and the card
                          itself stays unclickable (handleCardClick/
                          handleQuickAdd both bail out when !isShopOpen). */}
                      <div className="flex items-center gap-2 mt-auto pt-3">
                        <p className={`font-bold text-sm ${isShopOpen ? "text-purple-600" : "text-gray-500"}`}>
                          {displayPrice}
                        </p>
                        {simpleHasDiscount && (
                          <p className="text-gray-400 text-xs font-medium line-through">
                            Rs. {item.price}
                          </p>
                        )}
                        {isVariant && variantAnyDiscount && (
                          <p className="text-gray-400 text-xs font-medium line-through">
                            Rs. {variantCheapestOriginal}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Item Details Modal — opens with a zoom-in animation on tap.
          Clicking the dark backdrop (anywhere outside the white card)
          closes it, same as the "X" button — the card itself stops the
          click from reaching the backdrop so clicks inside stay open. */}
      {selectedItem && isShopOpen && (
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
            {selectedItem.image && (
              <div className="relative w-full h-48 bg-gray-100 flex-shrink-0">
                <Image src={selectedItem.image} alt={selectedItem.name} fill className="object-cover" />
              </div>
            )}

            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-2 gap-3">
                <h2 className="text-2xl font-extrabold tracking-tight leading-tight text-gray-900">
                  {selectedItem.name}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-gray-500 flex-shrink-0"
                  aria-label="Close details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {selectedItem.desc && (
                <p className="text-gray-500 mb-6 text-sm leading-relaxed whitespace-pre-line">
                  {selectedItem.desc}
                </p>
              )}

              {selectedHasVariants ? (
                <>
                  <h3 className="font-bold text-base mb-3 text-gray-900">Select Size / Option</h3>
                  <div className="space-y-3 mb-2">
                    {selectedItem.variants?.map((variant) => {
                      const variantDiscounted = hasValidDiscount(variant.price, variant.discountPrice);
                      const variantEffective = getEffectivePrice(variant.price, variant.discountPrice);

                      return (
                        <label
                          key={variant.name}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedVariant?.name === variant.name
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-100 hover:border-purple-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="variant"
                              value={variant.name}
                              checked={selectedVariant?.name === variant.name}
                              onChange={() => setSelectedVariant(variant)}
                              className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-600 focus:ring-2"
                            />
                            <span className="font-semibold text-gray-800">{variant.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-purple-600">Rs. {variantEffective}</span>
                            {variantDiscounted && (
                              <span className="text-gray-400 text-xs font-medium line-through">
                                Rs. {variant.price}
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 pt-1">
                  <span className="font-extrabold text-2xl text-purple-600">
                    Rs. {getEffectivePrice(selectedItem.price, selectedItem.discountPrice)}
                  </span>
                  {hasValidDiscount(selectedItem.price, selectedItem.discountPrice) && (
                    <span className="text-gray-400 text-sm font-medium line-through">
                      Rs. {selectedItem.price}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] flex-shrink-0">
              <button
                onClick={confirmAdd}
                disabled={selectedHasVariants && !selectedVariant}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-base hover:bg-purple-700 active:scale-95 transition-all flex justify-between px-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <span>Add to Cart</span>
                <span>Rs. {modalDisplayPrice}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Drawer Button */}
      {items.length > 0 && (
        <div className="fixed bottom-6 left-0 w-full px-6 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-purple-600 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center active:scale-95 transition-transform"
          >
            <div className="bg-white/20 px-3 py-1 rounded-lg font-bold text-sm">
              {items.reduce((sum, item) => sum + (item.quantity || 1), 0)} items
            </div>
            <span className="font-bold uppercase tracking-widest text-sm">View Cart</span>
            <span className="font-bold">Rs. {cartTotal}</span>
          </button>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}