"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { M_PLUS_Rounded_1c, Permanent_Marker } from "next/font/google";
import ShopStatusBadge from "@/components/ShopStatusBadge";
import CategoryNav from "@/components/CafeAnimeCategoryNav" ;
import CartDrawer from "@/components/CartDrawer";
import { CAFE_ANIME_VIDEO_URL } from "@/lib/constants/cafeAnime";
import {
  useRestaurantPage,
  getEffectivePrice,
  hasValidDiscount,
  type Category,
  type MenuItem,
  type Menu,
} from "@/hooks/useRestaurantPage";
import { useClickSound } from "./useClickSound";
// import { AnimeStickers } from "./stickers";
import theme from "@/lib/themes/theme1";

// Body / UI copy font. M+ Rounded also covers Japanese glyphs, so the same
// family is reused for the small Japanese accent text — no second network
// font needed just for that.
const bodyFont = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

// Single brush/marker display face for the hero title, item names and
// section headings. Only one weight is loaded since Permanent Marker only
// ships in 400.
const displayFont = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-display",
});

// Fallbacks used when an item/category doesn't have its own sound.
// Drop real clips into public/sounds/ using these names, or edit the paths.
const DEFAULT_CLICK_SOUND = "";
const DEFAULT_CONFIRM_SOUND = "";

// Single combined video: 0–5s = idle loop, 5–10s = celebration segment.
// Replace with your merged 10-second clip's URL.
const CHARACTER_VIDEO = CAFE_ANIME_VIDEO_URL;
const IDLE_START = 1.59;
const IDLE_END = 4;
const CELEBRATE_START = 5;
const CELEBRATE_END = 10;

interface CafeAnimeTemplateProps {
  shop: any;
  menu: Menu;
}

export default function CafeAnimeTemplate({ shop, menu }: CafeAnimeTemplateProps) {
  const id = shop.id;
  const page = useRestaurantPage(shop, menu, id);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const celebrateRef = useRef(false); // mirrors `celebrate` for the timeupdate listener below, which is attached once and would otherwise only ever see the `celebrate` value from that moment
  const characterVideoRef = useRef<HTMLVideoElement>(null);

  const playClick = useClickSound(DEFAULT_CLICK_SOUND);
  const playConfirm = useClickSound(DEFAULT_CONFIRM_SOUND);

useEffect(() => {
  const el = characterVideoRef.current;
  if (!el) return;

  const resetToIdle = () => {
    setCelebrate(false);
    celebrateRef.current = false;
    el.muted = true;
    el.currentTime = IDLE_START;
    el.play().catch(() => {});
  };

  const handleTimeUpdate = () => {
    if (celebrateRef.current) {
      if (el.currentTime >= CELEBRATE_END - 0.05) {
        resetToIdle();
      }
    } else {
      if (el.currentTime >= IDLE_END) {
        el.currentTime = IDLE_START;
      }
    }
  };

  const handleEnded = () => {
    resetToIdle();
  };

  el.addEventListener("timeupdate", handleTimeUpdate);
  el.addEventListener("ended", handleEnded);
  return () => {
    el.removeEventListener("timeupdate", handleTimeUpdate);
    el.removeEventListener("ended", handleEnded);
  };
}, []);

  // Enforces the two segments as manual loops, since the native `loop`
  // attribute only loops the whole file, not a slice of it. On every
  // timeupdate: while idle, snap back to IDLE_START once IDLE_END is
  // passed; while celebrating, snap back to IDLE_START (and drop out of
  // celebrate mode, re-muting) once CELEBRATE_END is passed. Because this
  // is a seek within the same loaded video rather than a src swap, there's
  // no reload/re-buffer — no visible stutter at the transition.
  useEffect(() => {
    const el = characterVideoRef.current;
    if (!el) return;

    const handleTimeUpdate = () => {
      if (celebrateRef.current) {
        if (el.currentTime >= CELEBRATE_END) {
          setCelebrate(false);
          el.muted = true;
          el.currentTime = IDLE_START;
        }
      } else {
        if (el.currentTime >= IDLE_END) {
          el.currentTime = IDLE_START;
        }
      }
    };

    el.addEventListener("timeupdate", handleTimeUpdate);
    return () => el.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Plays an item's own sound if it has one, otherwise the default click SFX.
  const triggerClick = (src?: string) => {
    if (soundEnabled) playClick(src);
  };

  const flashToast = () => {
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 1400);
  };

  // Seeks into the celebration segment of the SAME loaded video — not a
  // src swap — so there's no reload/re-buffer, just a clean jump forward
  // in the timeline. Unmuting must happen synchronously inside a click
  // handler: browsers only allow unmuted playback to start as a direct
  // result of a user gesture, so doing this from a useEffect instead
  // would get the sound silently blocked.
 const playCelebration = () => {
  setCelebrate(true);
  celebrateRef.current = true;
  const el = characterVideoRef.current;
  if (!el) return;

  el.muted = false; // safe here — inside a click handler (user gesture)

  const seekAndPlay = () => {
    el.currentTime = CELEBRATE_START;
    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => {});
    });
  };

  // If the video is mid-buffering, seeking immediately can stall on some
  // phones until the browser locates the nearest keyframe. Waiting one
  // tick (or for 'seeked') avoids that visible freeze.
  if (el.readyState >= 2) {
    seekAndPlay();
  } else {
    el.addEventListener("loadeddata", seekAndPlay, { once: true });
  }
};

  const onItemClick = (item: MenuItem, catName: string) => {
    triggerClick(item.sound);
    page.handleCardClick(item, catName);
  };

  const onQuickAdd = (e: React.MouseEvent, item: MenuItem, catName: string) => {
    triggerClick(item.sound);
    const isVariantItem = !!(item.variants && item.variants.length > 0);
    page.handleQuickAdd(e, item, catName);

    // Only a real add (no variant picker involved) deserves the success cue.
    if (!isVariantItem) {
      if (soundEnabled) playConfirm();
      flashToast();
      playCelebration();
    }
  };

  const onConfirmAdd = () => {
    page.confirmAdd();
    if (soundEnabled) playConfirm();
    flashToast();
    playCelebration();
  };

  // Optional decorative Japanese copy. Only rendered when the restaurant's
  // own data actually supplies it — never fabricated — so these read as
  // `(menu as any).nameJp` / `(cat as any).nameJp` throughout.
  const heroNameJp = (menu as any).nameJp as string | undefined;
  const heroBanner = "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789560853/WhatsApp_Image_2026-09-16_at_5.13.59_PM_vjufmg.jpg"

  return (
    <main
      className={`${bodyFont.className} ${displayFont.variable} relative min-h-screen bg-[#0b0c14] pb-28 antialiased overflow-x-hidden`}
    >
      {/* <AnimeStickers /> */}

      {/* ================= HERO ================= */}
      <header className="relative w-full overflow-hidden border-b border-red-900/40">
        {/* Base layers: dark gradient + banner image (if supplied) + a
            quiet, original decorative pattern (never a copyrighted
            character) so the hero never looks flat when no banner exists. */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#141726] via-[#0d0f1a] to-[#1a0d12]" />
        {heroBanner && (
          <Image
            src={heroBanner}
            alt=""
            fill
            
            priority
            className="object-cover opacity-30 "
          />
        )}
        <svg
          className="absolute inset-0 h-full w-full opacity-20"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 400 220"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="heroGlow" cx="80%" cy="20%" r="60%">
              <stop offset="0%" stopColor="#c81f2f" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#c81f2f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="220" fill="url(#heroGlow)" />
          {/* soft cherry-blossom petals — original simple shapes, not artwork */}
          {[
            [40, 30], [70, 60], [340, 25], [365, 70], [300, 15], [20, 120],
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx} ${cy}) scale(${0.6 + (i % 3) * 0.15})`} fill="#f7b6c2" fillOpacity="0.5">
              <circle cx="0" cy="-4" r="4" />
              <circle cx="3.8" cy="-1.2" r="4" />
              <circle cx="2.4" cy="3.2" r="4" />
              <circle cx="-2.4" cy="3.2" r="4" />
              <circle cx="-3.8" cy="-1.2" r="4" />
            </g>
          ))}
        </svg>

        <Link
          href="/"
          className="absolute top-4 left-4 z-30 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-sm hover:bg-black/70 transition-colors"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

       

        <div className="relative z-10 max-w-5xl mx-auto px-5 pt-16 pb-6 sm:pt-14 sm:pb-8 lg:pt-24 lg:pb-12">
          <div className="flex items-start gap-4">
            {menu.logo ? (
              <Image
                src={menu.logo}
                alt={menu.name}
                width={84}
                height={84}
                className={`rounded-2xl border-2 border-red-600/80 object-cover shadow-lg flex-shrink-0 ${!page.isShopOpen ? "grayscale opacity-60" : ""}`}
              />
            ) : (
              <div className="w-[84px] h-[84px] rounded-2xl border-2 border-red-600/80 bg-black/40 flex items-center justify-center text-red-300 text-[9px] font-semibold uppercase tracking-widest text-center px-1 flex-shrink-0">
                No Logo
              </div>
            )}

            <div className="min-w-0">
              <h1
                style={{ fontFamily: "var(--font-display)" }}
                className={`text-4xl sm:text-6xl leading-[0.95] tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] ${
                  !page.isShopOpen ? "text-gray-400" : "text-white"
                }`}
              >
                {menu.name}
              </h1>
              {heroNameJp && (
                <p className="text-red-400 text-sm sm:text-base mt-1 tracking-wide">{heroNameJp}</p>
              )}

              <div className="mt-3">
                <ShopStatusBadge shop={shop} />
              </div>
            </div>
          </div>

          <p className="mt-5 text-white/80 text-xs sm:text-sm font-semibold flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Good Food</span>
            <span className="text-red-500" aria-hidden="true">•</span>
            <span>Great Vibes</span>
            <span className="text-red-500" aria-hidden="true">•</span>
            <span>Anime Style</span>
          </p>
        </div>
      </header>

      {/* Closed banner */}
      {!page.isShopOpen && (
        <div className="relative z-10 bg-red-950 text-red-100 text-center py-2.5 px-4 border-b border-red-900/60">
          <p className="text-xs font-semibold uppercase tracking-widest">
            {page.statusText ? `Currently Closed \u00B7 ${page.statusText}` : "Currently Closed"}
          </p>
        </div>
      )}

      {/* Category navigation */}
      <div className="relative z-10 sticky top-0 bg-[#0b0c14]/95 backdrop-blur-sm border-b border-white/5">
        <CategoryNav categories={menu.categories} activeCategory={page.activeCategory} />
      </div>

      {/* Floating character video — small companion bubble centered above
          the hero. Seeks into the celebration segment of the same file on
          add-to-cart, then eases back to the idle segment. */}
      <div
        className="fixed top-1 left-1/2 -translate-x-1/2 z-30 w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-xl pointer-events-none border-4 border-white/90"
        aria-hidden="true"
      >
        <video
          ref={characterVideoRef}
          src={CHARACTER_VIDEO}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* ================= MENU ================= */}
    <div className="relative w-full min-h-screen">
        
        {/* --- YOUR BACKGROUND IMAGE --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1789560809/WhatsApp_Image_2026-09-16_at_5.04.03_PM_xoaxzy.jpg"
            alt="Menu Background"
            fill
            className="object-cover opacity-10" 
          />
          <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#0b0c14] to-transparent" />
        </div>
        {menu.categories.map((cat: Category) => {
          const catNameJp = (cat as any).nameJp as string | undefined;

          return (
            <section key={cat.name} id={cat.name} className="scroll-mt-24 mb-14">
              <div className="relative mb-6 max-w-5xl mx-auto px-5">
                <div className="flex items-end gap-3">
                  <h2
                    style={{ fontFamily: "var(--font-display)" }}
                    className={`text-4xl sm:text-5xl leading-none tracking-wide ${
                      !page.isShopOpen ? "text-gray-500" : "text-white"
                    }`}
                  >
                    {cat.name}
                  </h2>
                  {catNameJp && (
                    <span className="text-red-500 text-sm sm:text-base mb-1">{catNameJp}</span>
                  )}
                </div>
                <div className="mt-2 h-[6px] w-24 rounded-full bg-gradient-to-r from-red-600 to-red-600/10" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto px-5">
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
                      onClick={() => onItemClick(item, cat.name)}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === " ") && page.isShopOpen) {
                          onItemClick(item, cat.name);
                        }
                      }}
                      className={`group relative flex flex-col rounded-2xl border border-black/10 bg-[#f6ecdb] shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-200 ${
                        page.isShopOpen
                          ? "hover:shadow-[0_10px_24px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]"
                          : "cursor-not-allowed"
                      }`}
                    >
                      <div className="relative">
                        <div className="relative w-full aspect-square rounded-t-2xl overflow-hidden bg-black/20">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className={`object-cover ${!page.isShopOpen ? "grayscale opacity-60" : ""}`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-red-200/70 text-[10px] font-semibold uppercase tracking-widest">
                              No Image
                            </div>
                          )}

                          {showBadge && (
                            <span
                              style={{ fontFamily: "var(--font-display)" }}
                              className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-md rotate-[-3deg] shadow-md tracking-wide"
                            >
                              {theme.saleLabel}
                            </span>
                          )}

                          {!page.isShopOpen && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="bg-white/90 text-gray-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                Closed
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => onQuickAdd(e, item, cat.name)}
                          disabled={!page.isShopOpen}
                          aria-label={
                            page.isShopOpen
                              ? isVariant
                                ? `Choose options for ${item.name}`
                                : `Add ${item.name} to cart`
                              : `${item.name} unavailable, shop closed`
                          }
                          className={`absolute -bottom-4 right-3 z-10 w-9 h-9 rounded-full text-white font-bold text-lg flex items-center justify-center shadow-lg border-4 border-[#f6ecdb] transition-all ${
                            page.isShopOpen
                              ? "bg-purple-900 hover:bg-purple-900 active:scale-90"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          +
                        </button>
                      </div>

                      <div className="p-3 pt-5 flex flex-col flex-grow text-left">
                        <h3
                          style={{ fontFamily: "var(--font-display)" }}
                          className={`text-lg leading-tight tracking-wide line-clamp-1 ${
                            !page.isShopOpen ? "text-gray-500" : "text-[#1c1a17]"
                          }`}
                        >
                          {item.name}
                        </h3>
                        {item.desc && (
                          <p className="text-xs text-dark mt-1 font-bold leading-relaxed line-clamp-2">{item.desc}</p>
                        )}
                        <div className="flex items-center gap-2 mt-auto pt-3">
                          <p
                            style={{ fontFamily: "var(--font-display)" }}
                            className={`text-base px-1 py-0.5 rounded-full ${
                              page.isShopOpen ? "text-white bg-purple-900" : "text-gray-600 bg-gray-300"
                            }`}
                          >
                            {displayPrice}
                          </p>
                          {simpleHasDiscount && (
                            <p className="text-[#6b6155]/70 text-xs font-medium line-through">
                              Rs. {item.price}
                            </p>
                          )}
                          {isVariant && variantAnyDiscount && (
                            <p className="text-[#6b6155]/70 text-xs font-medium line-through">
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
          );
        })}
      </div>

      {/* Item Details Modal */}
      {page.selectedItem && page.isShopOpen && (
        <div
          onClick={page.closeModal}
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 overflow-y-auto overscroll-contain transition-opacity duration-150 ${
            page.isClosing ? "opacity-0" : "opacity-100 animate-in fade-in duration-200"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-[#f6ecdb] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl transition-all duration-150 ${
              page.isClosing
                ? "opacity-0 scale-95"
                : "opacity-100 scale-100 animate-in zoom-in-95 slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200"
            }`}
          >
            {page.selectedItem.image && (
              <div className="relative w-full h-48 bg-black/20 flex-shrink-0">
                <Image src={page.selectedItem.image} alt={page.selectedItem.name} fill className="object-cover" />
              </div>
            )}

            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-2 gap-3">
                <h2
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-3xl leading-tight text-[#1c1a17]"
                >
                  {page.selectedItem.name}
                </h2>
                <button
                  onClick={page.closeModal}
                  className="p-2 bg-black/5 hover:bg-black/10 transition-colors rounded-full text-[#6b6155] flex-shrink-0"
                  aria-label="Close details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {page.selectedItem.desc && (
                <p className="text-[#6b6155] mb-6 text-sm leading-relaxed whitespace-pre-line">
                  {page.selectedItem.desc}
                </p>
              )}

              {page.selectedHasVariants ? (
                <>
                  <h3 className="font-bold text-base mb-3 text-[#1c1a17]">Select Size / Option</h3>
                  <div className="space-y-3 mb-2">
                    {page.selectedItem.variants?.map((variant) => {
                      const variantDiscounted = hasValidDiscount(variant.price, variant.discountPrice);
                      const variantEffective = getEffectivePrice(variant.price, variant.discountPrice);
                      const isSelected = page.selectedVariant?.name === variant.name;

                      return (
                        <label
                          key={variant.name}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all bg-white/50 ${
                            isSelected ? "border-purple-900 ring-2 ring-purple-900/30" : "border-black/10 hover:border-purple-900"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="variant"
                              value={variant.name}
                              checked={isSelected}
                              onChange={() => page.setSelectedVariant(variant)}
                              className="w-5 h-5 text-purple-900 border-gray-300 focus:ring-purple-900 focus:ring-2"
                            />
                            <span className="font-semibold text-[#1c1a17]">{variant.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-purple-900">Rs. {variantEffective}</span>
                            {variantDiscounted && (
                              <span className="text-[#6b6155]/70 text-xs font-medium line-through">
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
                  <span className="font-extrabold text-2xl text-purple-900">
                    Rs. {getEffectivePrice(page.selectedItem.price, page.selectedItem.discountPrice)}
                  </span>
                  {hasValidDiscount(page.selectedItem.price, page.selectedItem.discountPrice) && (
                    <span className="text-[#6b6155]/70 text-sm font-medium line-through">
                      Rs. {page.selectedItem.price}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-[#f6ecdb] border-t border-black/10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.15)] flex-shrink-0">
              <button
                onClick={onConfirmAdd}
                disabled={page.selectedHasVariants && !page.selectedVariant}
                className="w-full bg-purple-900 text-white py-4 rounded-xl font-bold text-base hover:bg-purple-900 active:scale-95 transition-all flex justify-between px-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <span>Add to Cart</span>
                <span>Rs. {page.modalDisplayPrice}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Added to cart" toast */}
      {showToast && (
       <div className="fixed top-34 left-1/2 -translate-x-1/2 z-[60] bg-purple-800 text-white text-sm font-bold px-4 sm:px-5 py-2.5 rounded-full shadow-xl animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none whitespace-nowrap"> Yatta! Added to cart {theme.emoji} </div>
      )}

      {/* Floating Cart Button */}
      {page.items.length > 0 && (
        <div className="fixed bottom-6 left-0 w-full px-6 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button
            onClick={() => page.setIsCartOpen(true)}
            className="w-full bg-purple-900 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center active:scale-95 transition-transform border border-purple-900/40"
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