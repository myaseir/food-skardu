"use client";

import Image from "next/image";
import Link from "next/link";
import { Fraunces, Inter } from "next/font/google";
import ShopStatusBadge from "@/components/ShopStatusBadge";
import CategoryNav from "@/components/CategoryNav";
import CartDrawer from "@/components/CartDrawer";
import {
  useRestaurantPage,
  getEffectivePrice,
  hasValidDiscount,
  type Category,
  type MenuItem,
  type Menu,
} from "@/hooks/useRestaurantPage";

// Fraunces gives the bakery a handcrafted, patisserie feel for names and
// headings; Inter stays clean and legible for prices, buttons and body text.
const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

interface AlJannatTemplateProps {
  shop: any;
  menu: Menu;
}

// A repeating scalloped edge — the crimped rim of a pie crust / the lid of a
// pastry box — separating the header from the menu. This is the one
// deliberately characterful element; everything else stays quiet around it.
function ScallopDivider({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      className="w-full h-4 block"
    >
      <path
        d="M0,0 C4,6 8,6 12,0 C16,6 20,6 24,0 C28,6 32,6 36,0 C40,6 44,6 48,0 C52,6 56,6 60,0 C64,6 68,6 72,0 C76,6 80,6 84,0 C88,6 92,6 96,0 C98,3 100,3 100,0 L100,0 L0,0 Z"
        fill={color}
      />
    </svg>
  );
}

export default function AlJannatTemplate({ shop, menu }: AlJannatTemplateProps) {
  const id = shop.id;
  const page = useRestaurantPage(shop, menu, id);

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen pb-24 relative antialiased`}
      style={{ backgroundColor: "#F6EEDF", fontFamily: "var(--font-body)" }}
    >
      {/* Header */}
      <div className="relative" style={{ backgroundColor: "#FFFBF3" }}>
        <div className="p-6">
          <Link
            href="/"
            className="absolute top-6 left-6 z-30 p-2 rounded-full border shadow-sm transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.8)", borderColor: "#ECD9C6" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#6E2A3A">
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
                className={`rounded-2xl border-2 object-cover ${!page.isShopOpen ? "grayscale opacity-60" : ""}`}
                style={{ borderColor: "#ECD9C6" }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-center px-1"
                style={{ borderColor: "#ECD9C6", backgroundColor: "#F6EEDF", color: "#C4A987" }}
              >
                <span className="text-[9px] font-semibold uppercase tracking-widest">No Logo</span>
              </div>
            )}
            <div>
              <h1
                className={`text-3xl tracking-tight ${!page.isShopOpen ? "opacity-60" : ""}`}
                style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "#3D1620" }}
              >
                {menu.name}
              </h1>
              <ShopStatusBadge shop={shop} />
            </div>
          </div>
        </div>
        <ScallopDivider color="#F6EEDF" />
      </div>

      {/* Closed banner */}
      {!page.isShopOpen && (
        <div className="text-center py-2.5 px-4" style={{ backgroundColor: "#3D1620", color: "#F6EEDF" }}>
          <p className="text-xs font-semibold uppercase tracking-widest">
            {page.statusText ? `Currently Closed \u00B7 ${page.statusText}` : "Currently Closed"}
          </p>
        </div>
      )}

      <CategoryNav categories={menu.categories} activeCategory={page.activeCategory} />

      {/* Menu */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {menu.categories.map((cat: Category) => (
          <section key={cat.name} id={cat.name} className="scroll-mt-24 mb-12">
            <h2
              className={`text-xl mb-6 tracking-tight ${!page.isShopOpen ? "opacity-60" : ""}`}
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "#3D1620" }}
            >
              {cat.name}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {cat.items.map((item: MenuItem) => {
                const isVariant = !!(item.variants && item.variants.length > 0);

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

                const showBadge = page.isShopOpen && (simpleHasDiscount || variantAnyDiscount);

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={page.isShopOpen ? 0 : -1}
                    aria-disabled={!page.isShopOpen}
                    onClick={() => page.handleCardClick(item, cat.name)}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && page.isShopOpen) {
                        page.handleCardClick(item, cat.name);
                      }
                    }}
                    className={`rounded-2xl border shadow-sm transition-all duration-200 flex flex-col ${
                      page.isShopOpen ? "hover:shadow-md cursor-pointer active:scale-[0.98]" : "cursor-not-allowed"
                    }`}
                    style={{ backgroundColor: "#FFFBF3", borderColor: "#ECD9C6" }}
                  >
                    <div className="relative">
                      <div className="relative w-full aspect-square rounded-t-2xl overflow-hidden" style={{ backgroundColor: "#F6EEDF" }}>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className={`object-cover ${!page.isShopOpen ? "grayscale opacity-60" : ""}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#C4A987" }}>
                            No Image
                          </div>
                        )}

                        {showBadge && (
                          <span
                            className="absolute top-2 left-2 z-10 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg"
                            style={{ backgroundColor: "#C68A3D", color: "#FFFBF3" }}
                          >
                            Sale
                          </span>
                        )}

                        {!page.isShopOpen && (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(61,22,32,0.35)" }}>
                            <span
                              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                              style={{ backgroundColor: "rgba(255,251,243,0.9)", color: "#3D1620" }}
                            >
                              Closed
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => page.handleQuickAdd(e, item, cat.name)}
                        disabled={!page.isShopOpen}
                        aria-label={
                          page.isShopOpen
                            ? isVariant
                              ? `Choose options for ${item.name}`
                              : `Add ${item.name} to cart`
                            : `${item.name} unavailable, shop closed`
                        }
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full font-bold text-lg flex items-center justify-center shadow-lg border-4 transition-all active:scale-90"
                        style={{
                          backgroundColor: page.isShopOpen ? "#6E2A3A" : "#C4A987",
                          borderColor: "#FFFBF3",
                          color: "#FFFBF3",
                          cursor: page.isShopOpen ? "pointer" : "not-allowed",
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div className="p-3 pt-5 flex flex-col flex-grow text-left">
                      <h3
                        className={`text-sm leading-snug tracking-tight line-clamp-2 ${!page.isShopOpen ? "opacity-60" : ""}`}
                        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "#3D1620" }}
                      >
                        {item.name}
                      </h3>
                      {item.desc && (
                        <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: "#8A7B6B" }}>
                          {item.desc}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-auto pt-3">
                        <p className="font-bold text-sm" style={{ color: page.isShopOpen ? "#6E2A3A" : "#B79E82" }}>
                          {displayPrice}
                        </p>
                        {simpleHasDiscount && (
                          <p className="text-xs font-medium line-through" style={{ color: "#C4A987" }}>
                            Rs. {item.price}
                          </p>
                        )}
                        {isVariant && variantAnyDiscount && (
                          <p className="text-xs font-medium line-through" style={{ color: "#C4A987" }}>
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

      {/* Item Details Modal */}
      {page.selectedItem && page.isShopOpen && (
        <div
          onClick={page.closeModal}
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 transition-opacity duration-150 ${
            page.isClosing ? "opacity-0" : "opacity-100 animate-in fade-in duration-200"
          }`}
          style={{ backgroundColor: "rgba(61,22,32,0.45)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl transition-all duration-150 ${
              page.isClosing
                ? "opacity-0 scale-95"
                : "opacity-100 scale-100 animate-in zoom-in-95 slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200"
            }`}
            style={{ backgroundColor: "#FFFBF3" }}
          >
            {page.selectedItem.image && (
              <div className="relative w-full h-48 flex-shrink-0" style={{ backgroundColor: "#F6EEDF" }}>
                <Image src={page.selectedItem.image} alt={page.selectedItem.name} fill className="object-cover" />
              </div>
            )}

            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-2 gap-3">
                <h2
                  className="text-2xl tracking-tight leading-tight"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "#3D1620" }}
                >
                  {page.selectedItem.name}
                </h2>
                <button
                  onClick={page.closeModal}
                  className="p-2 transition-colors rounded-full flex-shrink-0"
                  style={{ backgroundColor: "#F6EEDF", color: "#6E2A3A" }}
                  aria-label="Close details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {page.selectedItem.desc && (
                <p className="mb-6 text-sm leading-relaxed whitespace-pre-line" style={{ color: "#8A7B6B" }}>
                  {page.selectedItem.desc}
                </p>
              )}

              {page.selectedHasVariants ? (
                <>
                  <h3 className="font-bold text-base mb-3" style={{ color: "#3D1620" }}>
                    Select Size / Option
                  </h3>
                  <div className="space-y-3 mb-2">
                    {page.selectedItem.variants?.map((variant) => {
                      const variantDiscounted = hasValidDiscount(variant.price, variant.discountPrice);
                      const variantEffective = getEffectivePrice(variant.price, variant.discountPrice);
                      const isSelected = page.selectedVariant?.name === variant.name;

                      return (
                        <label
                          key={variant.name}
                          className="flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all"
                          style={{
                            borderColor: isSelected ? "#6E2A3A" : "#ECD9C6",
                            backgroundColor: isSelected ? "#F6EEDF" : "transparent",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="variant"
                              value={variant.name}
                              checked={isSelected}
                              onChange={() => page.setSelectedVariant(variant)}
                              className="w-5 h-5"
                              style={{ accentColor: "#6E2A3A" }}
                            />
                            <span className="font-semibold" style={{ color: "#3D1620" }}>
                              {variant.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold" style={{ color: "#6E2A3A" }}>
                              Rs. {variantEffective}
                            </span>
                            {variantDiscounted && (
                              <span className="text-xs font-medium line-through" style={{ color: "#C4A987" }}>
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
                  <span className="font-extrabold text-2xl" style={{ color: "#6E2A3A" }}>
                    Rs. {getEffectivePrice(page.selectedItem.price, page.selectedItem.discountPrice)}
                  </span>
                  {hasValidDiscount(page.selectedItem.price, page.selectedItem.discountPrice) && (
                    <span className="text-sm font-medium line-through" style={{ color: "#C4A987" }}>
                      Rs. {page.selectedItem.price}
                    </span>
                  )}
                </div>
              )}

              {/* Customization fields — e.g. "Message on Cake" */}
              {page.selectedItem.customizations && page.selectedItem.customizations.length > 0 && (
                <div className="mt-6 space-y-4">
                  {page.selectedItem.customizations.map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-sm font-semibold mb-2" style={{ color: "#3D1620" }}>
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type="text"
                        maxLength={field.maxLength}
                        placeholder={field.placeholder}
                        value={page.customValues[field.id] || ""}
                        onChange={(e) =>
                          page.setCustomValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                        }
                        className="w-full p-3 rounded-xl border-2 focus:outline-none text-sm"
                        style={{ borderColor: "#ECD9C6", color: "#3D1620" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#6E2A3A")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#ECD9C6")}
                      />
                      {field.maxLength && (
                        <p className="text-[11px] mt-1 text-right" style={{ color: "#C4A987" }}>
                          {(page.customValues[field.id] || "").length}/{field.maxLength}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] flex-shrink-0" style={{ backgroundColor: "#FFFBF3", borderColor: "#ECD9C6" }}>
              <button
                onClick={page.confirmAdd}
                disabled={page.selectedHasVariants && !page.selectedVariant}
                className="w-full py-4 rounded-xl font-bold text-base transition-all flex justify-between px-6 active:scale-95 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: page.selectedHasVariants && !page.selectedVariant ? "#E4D7C4" : "#6E2A3A",
                  color: "#FFFBF3",
                }}
              >
                <span>Add to Cart</span>
                <span>Rs. {page.modalDisplayPrice}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Drawer Button */}
      {page.items.length > 0 && (
        <div className="fixed bottom-6 left-0 w-full px-6 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button
            onClick={() => page.setIsCartOpen(true)}
            className="w-full p-4 rounded-2xl shadow-2xl flex justify-between items-center active:scale-95 transition-transform"
            style={{ backgroundColor: "#6E2A3A", color: "#FFFBF3" }}
          >
            <div className="px-3 py-1 rounded-lg font-bold text-sm" style={{ backgroundColor: "rgba(255,251,243,0.2)" }}>
              {page.items.reduce((sum, item) => sum + (item.quantity || 1), 0)} items
            </div>
            <span className="font-bold uppercase tracking-widest text-sm">View Cart</span>
            <span className="font-bold">Rs. {page.cartTotal}</span>
          </button>
        </div>
      )}

      <CartDrawer isOpen={page.isCartOpen} onClose={() => page.setIsCartOpen(false)} />
    </main>
  );
}