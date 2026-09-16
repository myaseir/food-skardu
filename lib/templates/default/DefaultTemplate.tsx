"use client";

import Image from "next/image";
import Link from "next/link";
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

interface DefaultTemplateProps {
  shop: any;
  menu: Menu;
}

export default function DefaultTemplate({ shop, menu }: DefaultTemplateProps) {
  const id = shop.id;
  const page = useRestaurantPage(shop, menu, id);

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
              className={`rounded-2xl border object-cover ${!page.isShopOpen ? "grayscale opacity-60" : ""}`}
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl border bg-gray-100 flex items-center justify-center text-gray-300 text-[9px] font-semibold uppercase tracking-widest text-center px-1">
              No Logo
            </div>
          )}
          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${!page.isShopOpen ? "text-gray-500" : "text-gray-900"}`}>
              {menu.name}
            </h1>
            <ShopStatusBadge shop={shop} />
          </div>
        </div>
      </div>

      {/* Closed banner — uses this shop's actual configured hours instead
          of a fixed time range, so it's accurate for every shop. */}
      {!page.isShopOpen && (
        <div className="bg-gray-800 text-white text-center py-2.5 px-4">
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
            <h2 className={`text-lg font-bold mb-6 tracking-tight ${!page.isShopOpen ? "text-gray-500" : "text-gray-900"}`}>
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
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 flex flex-col ${
                      page.isShopOpen
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
                            className={`object-cover ${!page.isShopOpen ? "grayscale opacity-60" : ""}`}
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

                        {!page.isShopOpen && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="bg-white/90 text-gray-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
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
                        className={`absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full text-white font-bold text-lg flex items-center justify-center shadow-lg border-4 border-white transition-all ${
                          page.isShopOpen
                            ? "bg-purple-600 hover:bg-purple-700 active:scale-90"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        +
                      </button>
                    </div>

                    <div className="p-3 pt-5 flex flex-col flex-grow text-left">
                      <h3 className={`font-semibold text-sm leading-snug tracking-tight line-clamp-2 ${!page.isShopOpen ? "text-gray-500" : "text-gray-900"}`}>
                        {item.name}
                      </h3>
                      {item.desc && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{item.desc}</p>
                      )}
                      {/* Price always shows — even when the shop is closed —
                          so people can still browse rates. */}
                      <div className="flex items-center gap-2 mt-auto pt-3">
                        <p className={`font-bold text-sm ${page.isShopOpen ? "text-purple-600" : "text-gray-500"}`}>
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

      {/* Item Details Modal */}
      {page.selectedItem && page.isShopOpen && (
        <div
          onClick={page.closeModal}
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4 transition-opacity duration-150 ${
            page.isClosing ? "opacity-0" : "opacity-100 animate-in fade-in duration-200"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl transition-all duration-150 ${
              page.isClosing
                ? "opacity-0 scale-95"
                : "opacity-100 scale-100 animate-in zoom-in-95 slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200"
            }`}
          >
            {page.selectedItem.image && (
              <div className="relative w-full h-48 bg-gray-100 flex-shrink-0">
                <Image src={page.selectedItem.image} alt={page.selectedItem.name} fill className="object-cover" />
              </div>
            )}

            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-2 gap-3">
                <h2 className="text-2xl font-extrabold tracking-tight leading-tight text-gray-900">
                  {page.selectedItem.name}
                </h2>
                <button
                  onClick={page.closeModal}
                  className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-gray-500 flex-shrink-0"
                  aria-label="Close details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {page.selectedItem.desc && (
                <p className="text-gray-500 mb-6 text-sm leading-relaxed whitespace-pre-line">
                  {page.selectedItem.desc}
                </p>
              )}

              {page.selectedHasVariants ? (
                <>
                  <h3 className="font-bold text-base mb-3 text-gray-900">Select Size / Option</h3>
                  <div className="space-y-3 mb-2">
                    {page.selectedItem.variants?.map((variant) => {
                      const variantDiscounted = hasValidDiscount(variant.price, variant.discountPrice);
                      const variantEffective = getEffectivePrice(variant.price, variant.discountPrice);

                      return (
                        <label
                          key={variant.name}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            page.selectedVariant?.name === variant.name
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-100 hover:border-purple-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="variant"
                              value={variant.name}
                              checked={page.selectedVariant?.name === variant.name}
                              onChange={() => page.setSelectedVariant(variant)}
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
                    Rs. {getEffectivePrice(page.selectedItem.price, page.selectedItem.discountPrice)}
                  </span>
                  {hasValidDiscount(page.selectedItem.price, page.selectedItem.discountPrice) && (
                    <span className="text-gray-400 text-sm font-medium line-through">
                      Rs. {page.selectedItem.price}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] flex-shrink-0">
              <button
                onClick={page.confirmAdd}
                disabled={page.selectedHasVariants && !page.selectedVariant}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-base hover:bg-purple-700 active:scale-95 transition-all flex justify-between px-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            className="w-full bg-purple-600 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center active:scale-95 transition-transform"
          >
            <div className="bg-white/20 px-3 py-1 rounded-lg font-bold text-sm">
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