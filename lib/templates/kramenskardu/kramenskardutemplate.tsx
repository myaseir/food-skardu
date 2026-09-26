"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Black_Han_Sans, Gothic_A1 } from "next/font/google";
import ShopStatusBadge from "@/components/ShopStatusBadge";
import CategoryNav from "@/components/KRamenCategoryNav";
import CartDrawer from "@/components/CartDrawer";
import {
  useRestaurantPage,
  getEffectivePrice,
  hasValidDiscount,
  type Category,
  type MenuItem,
  type Menu,
} from "@/hooks/useRestaurantPage";

// Body / UI copy font. Gothic A1 ships full Hangul coverage as well as
// Latin, so the same family carries any real Korean accent text supplied
// by the restaurant — no second network font needed just for that.
const bodyFont = Gothic_A1({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

// Bold logotype/heading face — the blocky, high-impact shape behind the
// "K RAMEN" badge and every section banner. Covers Hangul too.
const displayFont = Black_Han_Sans({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-display",
});

const THEME = {
  toastEmoji: "🍜",
  toastLine: "Daebak! Added to cart",
};

// Extra service charge (in Rs.) added when the customer asks for a
// ramen/combo item to be served cooked.
const COOKED_SERVICE_CHARGE = 300;

// Feature-strip icons, cycled by index — matches the poster's
// bowl / pepper / smiley row when the restaurant doesn't supply its own icon.
const FEATURE_ICON_FALLBACK = ["🍜", "🌶️", "😊", "🥢", "🍚", "🔥"];

// Footer feature-bar icons, same idea, separate cycle.
const FOOTER_ICON_FALLBACK = ["🍜", "🔥", "😊", "🥢"];

// Rotating corner-tag palette for menu cards, cycled by category index so
// each category reads as visually distinct the way the poster's colored
// corner tags do — without hard-coding any specific category's meaning.
const TAG_PALETTE = [
  { bg: "#d81f2c", fg: "#f7ecd9" }, // red — e.g. spicy
  { bg: "#e8a33d", fg: "#201510" }, // gold — e.g. creamy
  { bg: "#201510", fg: "#f7ecd9" }, // ink — e.g. beef
  { bg: "#6b4a2f", fg: "#f7ecd9" }, // brown — e.g. miso
  { bg: "#3f7d4a", fg: "#f7ecd9" }, // green — e.g. veggie
  { bg: "#a8141f", fg: "#f7ecd9" }, // deep red
];

// Turns "Boiled Egg" into "boiled-egg" so combo/add-on/drink entries get a
// stable cart id without the restaurant having to supply one.
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Ramen items (any category whose name mentions "ramen") and every combo
// deal go through the cooked/uncooked prompt before they can be added to
// the cart. Add-ons and drinks are left alone.
function isRamenSection(catName: string) {
  const n = catName.toLowerCase();
  return n.includes("ramen") || n === "combo deals";
}

interface KRamenSkarduTemplateProps {
  shop: any;
  menu: Menu;
}

// Small reusable "add your image/art here" slot — used for the hero side
// illustrations, combo/add-on/drink photos. Never renders artwork itself,
// only a labeled box, so nothing is drawn in place of copyrighted
// characters.
function ImageSlot({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#d81f2c]/30 bg-white/40 text-center ${className}`}
    >
      <svg className="w-6 h-6 text-[#d81f2c]/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-[10px] font-bold uppercase tracking-wide text-[#6b5a4a] px-2 leading-snug">{label}</span>
    </div>
  );
}

// A handful of simple, original sakura-petal shapes — decoration only,
// never artwork — scattered around sections the way the poster does.
function SakuraScatter({ className = "", opacity = 0.5 }: { className?: string; opacity?: number }) {
  const spots: [number, number, number][] = [
    [6, 10, 0.8],
    [92, 14, 1],
    [88, 82, 0.7],
    [4, 78, 0.9],
    [50, 4, 0.6],
  ];
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {spots.map(([left, top, scale], i) => (
        <svg
          key={i}
          className="absolute w-8 h-8"
          style={{ left: `${left}%`, top: `${top}%`, opacity, transform: `scale(${scale})` }}
          viewBox="0 0 40 40"
        >
          <g fill="#f3b8c4">
            <circle cx="20" cy="12" r="7" />
            <circle cx="27.5" cy="17" r="7" />
            <circle cx="24.5" cy="25" r="7" />
            <circle cx="15.5" cy="25" r="7" />
            <circle cx="12.5" cy="17" r="7" />
          </g>
        </svg>
      ))}
    </div>
  );
}

export default function KRamenSkarduTemplate({ shop, menu }: KRamenSkarduTemplateProps) {
  const id = shop.id;
  const page = useRestaurantPage(shop, menu, id);

  const [showToast, setShowToast] = useState(false);

  // Tracks the ramen/drink flavor picked on each combo card, keyed by the
  // combo's index in the combos array. Falls back to the first option in
  // each combo's flavor list until the person picks something else.
  const [comboSelections, setComboSelections] = useState<
    Record<number, { ramenId?: string; drinkId?: string }>
  >({});

  // Pending "cooked or uncooked?" prompt. Set whenever the person tries to
  // add a ramen-station item or a combo deal, before it actually reaches
  // the cart flow. `action` remembers whether the original click was the
  // quick-add "+" button or the card itself (which opens the size/variant
  // modal), so we can resume the right path once they answer.
  const [cookPrompt, setCookPrompt] = useState<
    | {
        item: MenuItem;
        catName: string;
        action: "card" | "quickAdd";
        isVariantItem: boolean;
      }
    | null
  >(null);

  const flashToast = () => {
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 1400);
  };

  // Returns a copy of the item with the cooked service charge folded into
  // its price (and every variant's price), plus a distinguishing name/id
  // so a cooked line and an uncooked line never collapse into one cart row.
  const applyCookedCharge = (item: MenuItem, cooked: boolean): MenuItem => {
    const extra = cooked ? COOKED_SERVICE_CHARGE : 0;
    const suffix = cooked ? " (Cooked)" : " (Uncooked)";
    const idSuffix = cooked ? "-cooked" : "-uncooked";

    return {
      ...item,
      id: `${item.id}${idSuffix}`,
      name: `${item.name}${suffix}`,
      price: item.price + extra,
      discountPrice:
        typeof item.discountPrice === "number" ? item.discountPrice + extra : item.discountPrice,
      variants: item.variants
        ? item.variants.map((v) => ({
            ...v,
            price: v.price + extra,
            discountPrice: typeof v.discountPrice === "number" ? v.discountPrice + extra : v.discountPrice,
          }))
        : item.variants,
    } as MenuItem;
  };

  const onItemClick = (item: MenuItem, catName: string) => {
    if (isRamenSection(catName)) {
      setCookPrompt({
        item,
        catName,
        action: "card",
        isVariantItem: !!(item.variants && item.variants.length > 0),
      });
      return;
    }
    page.handleCardClick(item, catName);
  };

  const onQuickAdd = (e: React.MouseEvent, item: MenuItem, catName: string) => {
    e.stopPropagation();
    const isVariantItem = !!(item.variants && item.variants.length > 0);

    if (isRamenSection(catName)) {
      setCookPrompt({ item, catName, action: "quickAdd", isVariantItem });
      return;
    }

    page.handleQuickAdd(e, item, catName);
    if (!isVariantItem) {
      flashToast();
    }
  };

  // Called once the person answers the cooked/uncooked prompt. Resumes
  // whichever flow was interrupted, with the charge already folded in.
  const resolveCookChoice = (cooked: boolean) => {
    if (!cookPrompt) return;
    const adjustedItem = applyCookedCharge(cookPrompt.item, cooked);

    if (cookPrompt.action === "card") {
      page.handleCardClick(adjustedItem, cookPrompt.catName);
    } else {
      const syntheticEvent = { stopPropagation: () => {} } as unknown as React.MouseEvent;
      page.handleQuickAdd(syntheticEvent, adjustedItem, cookPrompt.catName);
      if (!cookPrompt.isVariantItem) {
        flashToast();
      }
    }
    setCookPrompt(null);
  };

  const onConfirmAdd = () => {
    page.confirmAdd();
    flashToast();
  };

  const heroNameKr = (menu as any).nameKr as string | undefined;
  const heroTagline = ((menu as any).tagline as string | undefined) ?? "Taste Korea in the Heart of Skardu";

  // Optional extra sections. Suggested field names only — wire these up to
  // whatever your Menu shape actually calls them. Nothing here is
  // fabricated: each block renders only when real data is supplied.
  const features = (menu as any).features as { label: string; icon?: string }[] | undefined;
  const combos = (menu as any).combos as
    | {
        name: string;
        items: string;
        price: number;
        itemImage?: string;
        drinkImage?: string;
        // Optional: ids from menu.categories items letting the person pick
        // which ramen flavor goes into this combo (e.g. "rm-buldak-original").
        ramenFlavorOptions?: string[];
        // Optional: either category item ids (Korean cans) or plain names
        // from the flat `drinks` array (e.g. "Soft Drinks"), letting the
        // person pick which drink comes with this combo.
        drinkFlavorOptions?: string[];
      }[]
    | undefined;
  const addOns = (menu as any).addOns as { name: string; price: number; image?: string }[] | undefined;
  const drinks = (menu as any).drinks as { name: string; price: number; image?: string }[] | undefined;
  const footerFeatures = (menu as any).footerFeatures as { label: string; icon?: string }[] | undefined;
  const closingLine = ((menu as any).closingLine as string | undefined) ?? "Good Food Brings\nPeople Together";

  // Finds a ramen/drink menu item by id across every category, since a
  // combo's ramenFlavorOptions/drinkFlavorOptions may reference items
  // from either "The Ramen Station" or "Korean Sparkling Refreshment"
  // without knowing which category index they live in.
  const findMenuItemById = (itemId: string): MenuItem | undefined => {
    for (const cat of menu.categories) {
      const found = cat.items.find((it) => it.id === itemId);
      if (found) return found;
    }
    return undefined;
  };

  // drinkFlavorOptions can point at a Korean can (a category item id) or
  // the flat local "Soft Drinks" line (a name from the `drinks` array) —
  // this resolves either shape to a display label.
  const findDrinkLabel = (idOrName: string): string => {
    const menuItem = findMenuItemById(idOrName);
    if (menuItem) return menuItem.name;
    const drinkEntry = drinks?.find((d) => d.name === idOrName);
    return drinkEntry?.name ?? idOrName;
  };

  // Combos, add-ons and drinks aren't part of menu.categories, so they need
  // to be turned into plain MenuItem-shaped objects before they can go
  // through the same handleQuickAdd flow as a regular menu card. Prefixed
  // ids keep them from colliding with real item ids in the cart.
  //
  // When a ramen/drink flavor has been picked for this combo, both the id
  // and the display name fold the choice in — otherwise two different
  // flavor picks on the same combo would collapse into a single cart line,
  // since CartDrawer only ever renders item.name (it never reads item.desc).
  const comboToCartItem = (
    combo: NonNullable<typeof combos>[number],
    ramenChoice?: MenuItem,
    drinkLabel?: string
  ): MenuItem => {
    const pickedBits = [ramenChoice?.name, drinkLabel].filter(Boolean) as string[];
    const idBits = [ramenChoice?.id, drinkLabel ? slugify(drinkLabel) : undefined].filter(Boolean) as string[];

    return {
      id: `combo-${slugify(combo.name)}${idBits.length ? "-" + idBits.join("-") : ""}`,
      name: pickedBits.length ? `${combo.name} (${pickedBits.join(" + ")})` : combo.name,
      price: combo.price,
      desc: combo.items,
      image: combo.itemImage,
    } as MenuItem;
  };

  const addOnToCartItem = (addOn: NonNullable<typeof addOns>[number]): MenuItem =>
    ({
      id: `addon-${slugify(addOn.name)}`,
      name: addOn.name,
      price: addOn.price,
      image: addOn.image,
    } as MenuItem);

  const drinkToCartItem = (drink: NonNullable<typeof drinks>[number]): MenuItem =>
    ({
      id: `drink-${slugify(drink.name)}`,
      name: drink.name,
      price: drink.price,
      image: drink.image,
    } as MenuItem);

  return (
    <main
      className={`${bodyFont.className} ${displayFont.variable} relative min-h-screen bg-[#f7ecd9] pb-28 antialiased overflow-x-hidden`}
    >
      {/* ================= HERO ================= */}
      <header className="relative w-full overflow-hidden border-b-4 border-[#201510]">
        <Link
          href="/"
          className="absolute top-4 left-4 z-30 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-sm hover:bg-black/60 transition-colors"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Full-bleed banner image, edge to edge, top of the hero on every
            breakpoint. Swap the ImageSlot below for a real <Image> once
            the banner photo/illustration is ready. The logo sits centered
            directly on top of it. */}
        <div className="relative w-full bg-[#fbf6ea]">
  {/* Mobile: renders at the image's own natural aspect ratio, so there's
      no forced box to letterbox against — no gap, no crop, no zoom. */}
  <Image
    src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1790329277/WhatsApp_Image_2026-09-25_at_2.40.11_PM_pidot1.jpg"
    alt="K Ramen Skardu"
    width={0}
    height={0}
    sizes="100vw"
    priority
    style={{ width: "100%", height: "auto" }}
    className="block sm:hidden"
  />

  {/* sm and up: unchanged — fixed-ratio, cropped banner */}
  <div className="relative hidden sm:block w-full aspect-[21/7]">
    <Image
      src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1790332312/WhatsApp_Image_2026-09-25_at_3.31.26_PM_qtlsrp.jpg"
      alt="K Ramen Skardu"
      fill
      className="object-cover"
    />
  </div>

  {/* Logo, centered over the banner in both cases */}
 {/* Logo, centered over the banner in both cases */}
<div
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-36 h-36 sm:w-76 sm:h-76 lg:w-124 lg:h-124 rounded-full shadow-lg bg-[#fbf6ea] overflow-hidden"
  style={{
    WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 90%)",
    maskImage: "radial-gradient(circle, black 55%, transparent 90%)",
  }}
>
  <Image
    src={menu.logo || "/kramen-logo.png"}
    alt="K Ramen Skardu logo"
    fill
    className="object-contain"
    style={{
  WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 75%)",
  maskImage: "radial-gradient(circle, black 30%, transparent 75%)",
}}
  />
</div>
</div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-6 overflow-hidden">
          <SakuraScatter opacity={0.35} />

          <div className="relative flex flex-col items-center text-center">
            <h1 style={{ fontFamily: "var(--font-display)" }} className="sr-only">
              {menu.name}
            </h1>

            <p className="mt-3 text-[#6b5a4a] text-xs sm:text-sm font-bold tracking-wide uppercase">{heroTagline}</p>
            {heroNameKr && (
              <p style={{ fontFamily: "var(--font-display)" }} className="text-[#d81f2c] text-sm mt-1">
                {heroNameKr}
              </p>
            )}

            <div className="mt-3 bg-[#d81f2c] text-[#f7ecd9] text-xs sm:text-sm font-bold uppercase tracking-widest px-5 py-2 rounded-md shadow-md">
              Authentic Korean Ramen
            </div>

            {/* "Open now" status, directly below the logo/badge area */}
            <div className="mt-3">
              <ShopStatusBadge shop={shop} />
            </div>
          </div>

          {/* Feature strip — icons + label, divided by thin verticals, the
              way the poster's bowl / pepper / smiley row reads. Only
              renders items the restaurant actually supplies; falls back to
              nothing rather than invented copy. */}
          {features && features.length > 0 && (
            <div className="relative mt-6 flex items-start justify-center gap-x-4 sm:gap-x-8 text-[#201510]">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-4 sm:gap-8">
                  <div className="flex flex-col items-center gap-1 w-16 sm:w-20">
                    <span className="text-lg sm:text-xl leading-none" aria-hidden="true">
                      {f.icon ?? FEATURE_ICON_FALLBACK[i % FEATURE_ICON_FALLBACK.length]}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-center leading-tight">{f.label}</span>
                  </div>
                  {i < features.length - 1 && <span className="w-px h-8 bg-[#201510]/20 mt-1" aria-hidden="true" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Closed banner */}
      {!page.isShopOpen && (
        <div className="relative z-10 bg-[#3a1512] text-[#ffb3a8] text-center py-2.5 px-4">
          <p className="text-xs font-bold uppercase tracking-widest">
            {page.statusText ? `Currently Closed \u00B7 ${page.statusText}` : "Currently Closed"}
          </p>
        </div>
      )}

      {/* Category navigation */}
      <div className="relative z-10 sticky top-0 bg-[#f7ecd9]/95 backdrop-blur-sm border-b border-[#201510]/10">
        <CategoryNav categories={menu.categories} activeCategory={page.activeCategory} />
      </div>

      {/* ================= SECTION BANNER ================= */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-2 overflow-hidden">
        <SakuraScatter opacity={0.25} />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div
            className="relative inline-flex items-center gap-3 bg-[#d81f2c] text-[#f7ecd9] px-6 py-2.5 rounded-md shadow-md"
            style={{ clipPath: "polygon(0 8%, 3% 0, 97% 4%, 100% 12%, 98% 92%, 100% 100%, 2% 96%, 0 88%)" }}
          >
            <span aria-hidden="true" className="text-lg">
              ›
            </span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl sm:text-3xl tracking-wide">
              RAMEN MENU
            </h2>
            <span aria-hidden="true" className="text-lg">
              ‹
            </span>
          </div>
          <p className="text-[#d81f2c] italic font-semibold text-sm sm:text-base -rotate-1">Real Noodles, Real Happiness</p>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <div className="relative w-full">
        {menu.categories.map((cat: Category, catIndex: number) => {
          const catNameKr = (cat as any).nameKr as string | undefined;
          const tag = TAG_PALETTE[catIndex % TAG_PALETTE.length];

          return (
            <section key={cat.name} id={cat.name} className="scroll-mt-24 mb-10">
              <div className="relative mb-4 max-w-5xl mx-auto px-4 sm:px-6">
                <div className="flex items-end gap-3">
                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className={`text-2xl sm:text-3xl leading-none tracking-wide ${!page.isShopOpen ? "text-gray-500" : "text-[#201510]"}`}
                  >
                    {cat.name}
                  </h3>
                  {catNameKr && (
                    <span style={{ fontFamily: "var(--font-display)" }} className="text-[#d81f2c] text-sm mb-0.5">
                      {catNameKr}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto px-4 sm:px-6">
                {cat.items.map((item: MenuItem) => {
                  const isVariant = !!(item.variants && item.variants.length > 0);
                  const itemTagKr = (item as any).tagKr as string | undefined;

                  const simpleHasDiscount = !isVariant && hasValidDiscount(item.price, item.discountPrice);
                  const simpleEffectivePrice = !isVariant ? getEffectivePrice(item.price, item.discountPrice) : item.price;

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

                  const displayPrice = isVariant ? `Rs. ${Math.min(...variantEffectivePrices)}/-` : `Rs. ${simpleEffectivePrice}/-`;

                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={page.isShopOpen ? 0 : -1}
                      aria-disabled={!page.isShopOpen}
                      onClick={() => onItemClick(item, cat.name)}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === " ") && page.isShopOpen) onItemClick(item, cat.name);
                      }}
                      className={`group relative flex flex-col rounded-2xl border-2 border-[#201510]/10 bg-white shadow-[0_4px_14px_rgba(32,21,16,0.12)] transition-all duration-200 overflow-hidden ${
                        page.isShopOpen ? "hover:shadow-[0_8px_22px_rgba(216,31,44,0.25)] hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]" : "cursor-not-allowed"
                      }`}
                    >
                      {/* Poster-style vertical Korean corner tag — falls
                          back to the category's own Korean name, then to
                          the category initial, so it always renders even
                          without per-item Korean copy. */}
                      <div
                        className="absolute top-0 left-0 z-10 px-1.5 py-2 flex items-center justify-center rounded-br-2xl min-w-[22px]"
                        style={{ backgroundColor: tag.bg, color: tag.fg }}
                      >
                        <span
                          className="text-[10px] font-black tracking-widest"
                          style={{ writingMode: itemTagKr || catNameKr ? "vertical-rl" : undefined }}
                        >
                          {itemTagKr ?? catNameKr ?? cat.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="relative w-full aspect-square bg-[#f2e6d0]">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className={`object-cover ${!page.isShopOpen ? "grayscale opacity-60" : ""}`} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#d81f2c]/40 text-[10px] font-bold uppercase tracking-widest text-center px-2">
                            Add Photo
                          </div>
                        )}

                        {!page.isShopOpen && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="bg-white/90 text-gray-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Closed</span>
                          </div>
                        )}

                        <button
                          onClick={(e) => onQuickAdd(e, item, cat.name)}
                          disabled={!page.isShopOpen}
                          aria-label={page.isShopOpen ? (isVariant ? `Choose options for ${item.name}` : `Add ${item.name} to cart`) : `${item.name} unavailable, shop closed`}
                          className={`absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full text-white font-black text-base flex items-center justify-center shadow-lg border-2 border-white transition-all ${
                            page.isShopOpen ? "bg-[#d81f2c] hover:bg-[#d81f2c] active:scale-90" : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          +
                        </button>
                      </div>

                      <div className="p-3 flex flex-col flex-grow text-left">
                        <h4
                          style={{ fontFamily: "var(--font-display)" }}
                          className={`text-base leading-tight tracking-wide line-clamp-1 ${!page.isShopOpen ? "text-gray-500" : "text-[#201510]"}`}
                        >
                          {item.name}
                        </h4>
                        {item.desc && <p className="text-[11px] text-[#6b5a4a] mt-1 font-medium leading-snug line-clamp-2">{item.desc}</p>}

                        <div className="mt-2">
                          <span
                            className={`inline-block text-sm font-black tracking-tight px-3 py-1 rounded-full ${
                              page.isShopOpen ? "text-[#f7ecd9] bg-[#d81f2c]" : "text-gray-600 bg-gray-300"
                            }`}
                          >
                            {displayPrice}
                          </span>
                          {simpleHasDiscount && <span className="ml-2 text-[#6b5a4a]/70 text-[11px] font-medium line-through">Rs. {item.price}</span>}
                          {isVariant && variantAnyDiscount && (
                            <span className="ml-2 text-[#6b5a4a]/70 text-[11px] font-medium line-through">Rs. {variantCheapestOriginal}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* ================= COMBO DEALS ================= */}
      {combos && combos.length > 0 && (
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-2">
          <div className="inline-flex items-center gap-2 bg-[#d81f2c] text-[#f7ecd9] px-5 py-2 rounded-md shadow-md mb-4">
            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-xl sm:text-2xl tracking-wide">
              COMBO DEALS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {combos.map((combo, i) => {
              const hasRamenPicker = !!combo.ramenFlavorOptions?.length;
              const hasDrinkPicker = !!combo.drinkFlavorOptions?.length;

              const selection = comboSelections[i] ?? {};
              const selectedRamenId = selection.ramenId ?? combo.ramenFlavorOptions?.[0];
              const selectedDrinkId = selection.drinkId ?? combo.drinkFlavorOptions?.[0];

              const ramenChoice = hasRamenPicker && selectedRamenId ? findMenuItemById(selectedRamenId) : undefined;
              const drinkLabel = hasDrinkPicker && selectedDrinkId ? findDrinkLabel(selectedDrinkId) : undefined;

              const cartItem = comboToCartItem(combo, ramenChoice, drinkLabel);

              return (
                <div key={i} className="relative rounded-2xl border-2 border-[#201510]/10 bg-white p-4 shadow-[0_4px_14px_rgba(32,21,16,0.1)]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#201510] text-[#f7ecd9] text-xs font-black flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="bg-[#e8a33d] text-[#201510] text-xs font-black uppercase px-2.5 py-1 rounded-full">{combo.name}</span>
                  </div>

                  {/* Poster-style "item photo + drink photo" pairing */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1 aspect-square rounded-lg overflow-hidden bg-[#f2e6d0]">
                      {combo.itemImage ? (
                        <Image src={combo.itemImage} alt={combo.name} fill className="object-cover" />
                      ) : (
                        <ImageSlot label="Item photo" className="absolute inset-0" />
                      )}
                    </div>
                    <span style={{ fontFamily: "var(--font-display)" }} className="text-[#d81f2c] text-lg flex-shrink-0">
                      +
                    </span>
                    <div className="relative flex-1 aspect-square rounded-lg overflow-hidden bg-[#f2e6d0]">
                      {combo.drinkImage ? (
                        <Image src={combo.drinkImage} alt="" fill className="object-cover" />
                      ) : (
                        <ImageSlot label="Drink photo" className="absolute inset-0" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-[#6b5a4a] font-semibold mb-3">{combo.items}</p>

                  {hasRamenPicker && (
                    <div className="mb-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-[#6b5a4a] mb-1">
                        Ramen Flavor
                      </label>
                      <select
                        value={selectedRamenId}
                        onChange={(e) =>
                          setComboSelections((prev) => ({
                            ...prev,
                            [i]: { ...prev[i], ramenId: e.target.value },
                          }))
                        }
                        className="w-full text-sm font-semibold border-2 border-[#201510]/10 rounded-lg px-2 py-1.5 bg-[#f7ecd9]/50 text-[#201510]"
                      >
                        {combo.ramenFlavorOptions!.map((optId) => {
                          const opt = findMenuItemById(optId);
                          return (
                            <option key={optId} value={optId}>
                              {opt?.name ?? optId}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {hasDrinkPicker && (
                    <div className="mb-3">
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-[#6b5a4a] mb-1">
                        Drink
                      </label>
                      <select
                        value={selectedDrinkId}
                        onChange={(e) =>
                          setComboSelections((prev) => ({
                            ...prev,
                            [i]: { ...prev[i], drinkId: e.target.value },
                          }))
                        }
                        className="w-full text-sm font-semibold border-2 border-[#201510]/10 rounded-lg px-2 py-1.5 bg-[#f7ecd9]/50 text-[#201510]"
                      >
                        {combo.drinkFlavorOptions!.map((optIdOrName) => (
                          <option key={optIdOrName} value={optIdOrName}>
                            {findDrinkLabel(optIdOrName)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={(e) => onQuickAdd(e, cartItem, "Combo Deals")}
                    disabled={!page.isShopOpen}
                    aria-label={page.isShopOpen ? `Add ${combo.name} to cart` : `${combo.name} unavailable, shop closed`}
                    className={`w-full flex items-center justify-center gap-2 text-sm font-black tracking-tight px-3 py-2 rounded-full transition-all ${
                      page.isShopOpen ? "text-[#f7ecd9] bg-[#d81f2c] hover:bg-[#a8141f] active:scale-95" : "text-gray-600 bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Rs. {combo.price}/-
                    <span aria-hidden="true" className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs">
                      +
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= ADD-ONS + DRINKS ================= */}
      {((addOns && addOns.length > 0) || (drinks && drinks.length > 0)) && (
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {addOns && addOns.length > 0 && (
            <div className="rounded-2xl border-2 border-[#201510]/10 bg-white overflow-hidden">
              <div className="bg-[#201510] text-[#f7ecd9] px-4 py-2 text-sm font-bold uppercase tracking-widest text-center">Add Ons</div>
              <div className="divide-y divide-[#201510]/10">
                {addOns.map((a, i) => {
                  const cartItem = addOnToCartItem(a);
                  return (
                    <button
                      key={i}
                      onClick={(e) => onQuickAdd(e, cartItem, "Add Ons")}
                      disabled={!page.isShopOpen}
                      aria-label={page.isShopOpen ? `Add ${a.name} to cart` : `${a.name} unavailable, shop closed`}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                        page.isShopOpen ? "hover:bg-[#f7ecd9]/70 active:bg-[#f7ecd9]" : "cursor-not-allowed opacity-70"
                      }`}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="relative w-9 h-9 rounded-full overflow-hidden bg-[#f2e6d0] flex-shrink-0">
                          {a.image ? (
                            <Image src={a.image} alt={a.name} fill className="object-cover" />
                          ) : (
                            <ImageSlot label="" className="absolute inset-0 rounded-full p-0 border" />
                          )}
                        </span>
                        <span className="text-sm font-semibold text-[#201510] truncate">{a.name}</span>
                      </span>
                      <span
                        className={`flex items-center gap-1.5 flex-shrink-0 text-xs font-black px-2.5 py-1 rounded-full ${
                          page.isShopOpen ? "text-[#f7ecd9] bg-[#d81f2c]" : "text-gray-600 bg-gray-300"
                        }`}
                      >
                        Rs. {a.price}
                        <span aria-hidden="true">+</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {drinks && drinks.length > 0 && (
            <div className="rounded-2xl border-2 border-[#201510]/10 bg-white overflow-hidden">
              <div className="bg-[#201510] text-[#f7ecd9] px-4 py-2 text-sm font-bold uppercase tracking-widest text-center">Drinks</div>
              <div className="divide-y divide-[#201510]/10">
                {drinks.map((d, i) => {
                  const cartItem = drinkToCartItem(d);
                  return (
                    <button
                      key={i}
                      onClick={(e) => onQuickAdd(e, cartItem, "Drinks")}
                      disabled={!page.isShopOpen}
                      aria-label={page.isShopOpen ? `Add ${d.name} to cart` : `${d.name} unavailable, shop closed`}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                        page.isShopOpen ? "hover:bg-[#f7ecd9]/70 active:bg-[#f7ecd9]" : "cursor-not-allowed opacity-70"
                      }`}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="relative w-9 h-9 rounded-full overflow-hidden bg-[#f2e6d0] flex-shrink-0">
                          {d.image ? (
                            <Image src={d.image} alt={d.name} fill className="object-cover" />
                          ) : (
                            <ImageSlot label="" className="absolute inset-0 rounded-full p-0 border" />
                          )}
                        </span>
                        <span className="text-sm font-semibold text-[#201510] truncate">{d.name}</span>
                      </span>
                      <span
                        className={`flex items-center gap-1.5 flex-shrink-0 text-xs font-black px-2.5 py-1 rounded-full ${
                          page.isShopOpen ? "text-[#f7ecd9] bg-[#d81f2c]" : "text-gray-600 bg-gray-300"
                        }`}
                      >
                        Rs. {d.price}
                        <span aria-hidden="true">+</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= BOTTOM BANNER + THANK YOU ================= */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-stretch">
          <div className="relative rounded-2xl overflow-hidden bg-[#201510] text-[#f7ecd9] flex items-center gap-4 p-5">
            <SakuraScatter opacity={0.15} />
            <p style={{ fontFamily: "var(--font-display)" }} className="relative z-10 text-xl sm:text-2xl leading-snug whitespace-pre-line">
              {closingLine}
            </p>
           <img
  src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344296/WhatsApp_Image_2026-09-25_at_6.45.38_PM_ayluq4.jpg"
  alt="Closing illustration"
  className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 ml-auto object-cover rounded-full"
/>
          </div>

          <div className="rounded-2xl border-2 border-[#201510]/10 bg-white p-4 flex flex-col items-center justify-center text-center w-full sm:w-48">
            <p style={{ fontFamily: "var(--font-display)" }} className="text-[#d81f2c] text-sm mt-3">
              Thank You!
            </p>
            <p className="text-[10px] text-[#6b5a4a] font-semibold">Enjoy your bowl</p>
          </div>
        </div>
      </div>

      {/* ================= FOOTER FEATURE BAR ================= */}
      {footerFeatures && footerFeatures.length > 0 && (
        <div className="relative mt-10 bg-[#201510] text-[#f7ecd9] py-3 px-4">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm" aria-hidden="true">
                  {f.icon ?? FOOTER_ICON_FALLBACK[i % FOOTER_ICON_FALLBACK.length]}
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wide">{f.label}</span>
                {i < footerFeatures.length - 1 && <span className="text-[#d81f2c]" aria-hidden="true">|</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {page.selectedItem && page.isShopOpen && (
        <div
          onClick={page.closeModal}
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 sm:p-4 overflow-y-auto overscroll-contain transition-opacity duration-150 ${
            page.isClosing ? "opacity-0" : "opacity-100 animate-in fade-in duration-200"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl transition-all duration-150 ${
              page.isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-in zoom-in-95 slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200"
            }`}
          >
            <div className="relative w-full h-48 bg-[#f2e6d0] flex-shrink-0">
              {page.selectedItem.image ? (
                <Image src={page.selectedItem.image} alt={page.selectedItem.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#d81f2c]/40 text-xs font-bold uppercase tracking-widest">
                  Add Photo
                </div>
              )}
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-2 gap-3">
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl sm:text-3xl leading-tight text-[#201510]">
                  {page.selectedItem.name}
                </h2>
                <button
                  onClick={page.closeModal}
                  className="p-2 bg-black/5 hover:bg-black/10 transition-colors rounded-full text-[#6b5a4a] flex-shrink-0"
                  aria-label="Close details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {page.selectedItem.desc && <p className="text-[#6b5a4a] mb-6 text-sm leading-relaxed whitespace-pre-line">{page.selectedItem.desc}</p>}

              {page.selectedHasVariants ? (
                <>
                  <h3 className="font-bold text-base mb-3 text-[#201510]">Select Size / Option</h3>
                  <div className="space-y-3 mb-2">
                    {page.selectedItem.variants?.map((variant) => {
                      const variantDiscounted = hasValidDiscount(variant.price, variant.discountPrice);
                      const variantEffective = getEffectivePrice(variant.price, variant.discountPrice);
                      const isSelected = page.selectedVariant?.name === variant.name;

                      return (
                        <label
                          key={variant.name}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all bg-[#f7ecd9]/50 ${
                            isSelected ? "border-[#d81f2c] ring-2 ring-[#d81f2c]/30" : "border-black/10 hover:border-[#d81f2c]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="variant"
                              value={variant.name}
                              checked={isSelected}
                              onChange={() => page.setSelectedVariant(variant)}
                              className="w-5 h-5 text-[#d81f2c] border-gray-300 focus:ring-[#d81f2c] focus:ring-2"
                            />
                            <span className="font-semibold text-[#201510]">{variant.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#d81f2c]">Rs. {variantEffective}</span>
                            {variantDiscounted && <span className="text-[#6b5a4a]/70 text-xs font-medium line-through">Rs. {variant.price}</span>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 pt-1">
                  <span className="font-extrabold text-2xl text-[#d81f2c]">Rs. {getEffectivePrice(page.selectedItem.price, page.selectedItem.discountPrice)}</span>
                  {hasValidDiscount(page.selectedItem.price, page.selectedItem.discountPrice) && (
                    <span className="text-[#6b5a4a]/70 text-sm font-medium line-through">Rs. {page.selectedItem.price}</span>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-black/10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.15)] flex-shrink-0">
              <button
                onClick={onConfirmAdd}
                disabled={page.selectedHasVariants && !page.selectedVariant}
                className="w-full bg-[#d81f2c] text-[#f7ecd9] py-4 rounded-xl font-black text-base hover:bg-[#d81f2c] active:scale-95 transition-all flex justify-between px-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <span>Add to Cart</span>
                <span>Rs. {page.modalDisplayPrice}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cooked / Uncooked prompt — shown before anything from a ramen
          category or a combo deal reaches the cart. */}
      {cookPrompt && (
        <div
          onClick={() => setCookPrompt(null)}
          className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center bg-black/70 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 text-center">
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-xl leading-tight text-[#201510] mb-1">
                {cookPrompt.item.name}
              </h3>
              <p className="text-sm text-[#6b5a4a] font-medium mb-5">Would you like this cooked or uncooked?</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => resolveCookChoice(false)}
                  className="w-full py-3 rounded-xl font-bold text-sm border-2 border-[#201510]/15 text-[#201510] hover:bg-[#f7ecd9]/70 active:scale-95 transition-all"
                >
                  Uncooked
                </button>
                <button
                  onClick={() => resolveCookChoice(true)}
                  className="w-full py-3 rounded-xl font-black text-sm bg-[#d81f2c] text-[#f7ecd9] hover:bg-[#a8141f] active:scale-95 transition-all"
                >
                  Cooked <span className="font-semibold">(+Rs. {COOKED_SERVICE_CHARGE} service charge)</span>
                </button>
              </div>

              <button
                onClick={() => setCookPrompt(null)}
                className="mt-4 text-xs font-semibold text-[#6b5a4a] uppercase tracking-wide"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Added to cart" toast */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-[#d81f2c] text-[#f7ecd9] text-sm font-black px-4 sm:px-5 py-2.5 rounded-full shadow-xl animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none whitespace-nowrap">
          {THEME.toastLine} {THEME.toastEmoji}
        </div>
      )}

      {/* Floating Cart Button */}
      {page.items.length > 0 && (
        <div className="fixed bottom-6 left-0 w-full px-6 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button
            onClick={() => page.setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-[#d81f2c] to-[#a8141f] text-[#f7ecd9] p-4 rounded-2xl shadow-2xl flex justify-between items-center active:scale-95 transition-transform border border-white/10"
          >
            <div className="bg-black/20 px-3 py-1 rounded-lg font-bold text-sm">{page.items.reduce((sum, item) => sum + (item.quantity || 1), 0)} items</div>
            <span className="font-bold uppercase tracking-widest text-sm">View Cart</span>
            <span className="font-bold">Rs. {page.cartTotal}</span>
          </button>
        </div>
      )}

      <CartDrawer isOpen={page.isCartOpen} onClose={() => page.setIsCartOpen(false)} />
    </main>
  );
}