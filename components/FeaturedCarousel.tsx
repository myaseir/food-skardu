"use client";
import React, { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Crown, Flame, Heart, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { shops, Shop } from "@/data/config";
import { useAvailability } from "@/hooks/useAvailability";
import { estimateDeliveryTime } from "@/utils/deliveryCalculator";

// Add/remove shop ids here to control what shows in the carousel
const FEATURED_SHOP_IDS = ["yak-and-bull" ,"baltistan-tea-grill-house","dominos-skardu","mfc","thefoodcorridor-skardu","yak-grill-skardu","the-balti-table", ];

// ---------------------------------------------------------------------------
// BADGES — pick which restaurants get a badge and which kind.
// Restaurants not listed here simply get no badge.
// Kinds: "top-rated" | "most-ordered" | "fan-favorite" | "fast"
//
// An entry can be a plain kind ("fast") or an object that starts from a kind
// and overrides any of: label, Icon, bg, color, border.
//   bg     -> any CSS background: "#facc15" or "linear-gradient(90deg,#f59e0b,#eab308)"
//   color  -> font + icon color:  "#000000"
//   border -> thin outline color: "#fef08a"
// Colors are inline styles, so they don't depend on Tailwind.
// ---------------------------------------------------------------------------
type BadgeKind = "Must Try" | "most-ordered" | "fan-favorite" | "fast";

type CustomBadge = {
  kind?: BadgeKind;
  label?: string;
  Icon?: LucideIcon;
  bg?: string;
  color?: string;
  border?: string;
};

const SHOP_BADGES: Record<string, BadgeKind | CustomBadge> = {
  "yak-and-bull": {
    kind: "Must Try",
    bg: "#facc15",
    color: "#000000",
    border: "#fef08a",
  },
  
  "baltistan-tea-grill-house": "fan-favorite",
  
  "mfc": "most-ordered",
};

// Default look for each kind
const BADGE_STYLES: Record<
  BadgeKind,
  { label: string; Icon: LucideIcon; bg: string; color: string; border: string }
> = {
  "Must Try": {
    label: "Must Try",
    Icon: Crown,
    bg: "linear-gradient(90deg,#fbbf24,#eab308)",
    color: "#451a03",
    border: "rgba(255,255,255,0.6)",
  },
  "most-ordered": {
    label: "Most Ordered",
    Icon: Flame,
    bg: "linear-gradient(90deg,#f97316,#ef4444)",
    color: "#ffffff",
    border: "rgba(255,255,255,0.4)",
  },
 "fan-favorite": {
  label: "Fan Favorite",
  Icon: Heart,
  bg: "linear-gradient(90deg,#3b82f6,#4f46e5)",
  color: "#ffffff",
  border: "rgba(79,70,229,0.5)",
},
  "fast": {
    label: "Fast Delivery",
    Icon: Zap,
    bg: "linear-gradient(90deg,#10b981,#14b8a6)",
    color: "#ffffff",
    border: "rgba(255,255,255,0.4)",
  },
};

// Small pill that floats on the cover image (absolute, so it never affects layout)
function ShopBadge({ badge }: { badge: BadgeKind | CustomBadge }) {
  const custom: CustomBadge = typeof badge === "string" ? { kind: badge } : badge;
  const base = BADGE_STYLES[custom.kind ?? "Must Try"];
  const label = custom.label ?? base.label;
  const Icon = custom.Icon ?? base.Icon;
  const bg = custom.bg ?? base.bg;
  const color = custom.color ?? base.color;
  const border = custom.border ?? base.border;

  return (
    <span
      style={{
        background: bg,
        color,
        boxShadow: `inset 0 0 0 1px ${border}, 0 4px 10px rgba(0,0,0,0.25)`,
      }}
      className="absolute top-2 left-2 z-10 flex items-center gap-1 max-w-[85%] text-[10px] font-extrabold tracking-wide px-2 py-1 rounded-full"
    >
      <Icon size={11} className="shrink-0" style={{ fill: "currentColor" }} />
      <span className="truncate">{label}</span>
    </span>
  );
}

// Turns "11:00" into "11:00 AM" for display
function formatOpenTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function FeaturedCover({ shop, isOpen }: { shop: Shop; isOpen: boolean }) {
  const [imgError, setImgError] = useState(false);
  const hasLogo = !!shop.logo && !imgError;
  const badge = SHOP_BADGES[shop.id];

  return (
    <div className="relative w-full aspect-[3/2] overflow-hidden bg-gray-100">
      {hasLogo ? (
        <Image
          src={shop.logo}
          alt={shop.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 33vw"
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${!isOpen ? "grayscale" : ""}`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-gray-50">
          <span className="text-3xl font-black text-gray-300">
            {shop.name.charAt(0)}
          </span>
        </div>
      )}

      {/* Quality badge — top-left of the image */}
      {badge && <ShopBadge badge={badge} />}

      {/* Rating badge — floats on the image, foodpanda-style */}
      {typeof shop.rating === "number" && (
        <span className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] font-bold text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
          <Star size={11} className="fill-yellow-400 text-yellow-400" />
          {shop.rating.toFixed(1)}
        </span>
      )}

      {/* Closed overlay */}
      {!isOpen && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <span className="text-white text-xs font-black uppercase tracking-widest bg-black/70 px-3 py-1.5 rounded-full text-center">
            {shop.alwaysOpen ? "Closed" : `Opens at ${formatOpenTime(shop.openTime)}`}
          </span>
        </div>
      )}
    </div>
  );
}

export default function FeaturedCarousel() {
  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps" });
  const { checkShopStatus } = useAvailability();

  const featuredShops = FEATURED_SHOP_IDS
    .map((id) => shops.find((shop) => shop.id === id))
    .filter((shop): shop is Shop => shop !== undefined);

  return (
    <div className="py-8">
      <h2 className="text-xl font-black px-6 mb-4 uppercase tracking-tighter">Popular Restaurants</h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 px-6 snap-x snap-mandatory">
          {featuredShops.map((shop) => {
            const isOpen = checkShopStatus(shop);
            // estimateDeliveryTime now returns null when this shop's
            // Office -> Restaurant leg hasn't been manually measured yet
            // (no coordinate fallback anymore) — the clock line below
            // just omits itself in that case rather than showing a
            // guessed time.
            const deliveryTime = estimateDeliveryTime(shop);

            return (
              <Link
                href={`/restaurant/${shop.id}`}
                key={shop.id}
                className={`group flex-[0_0_48%] sm:flex-[0_0_38%] md:flex-[0_0_30%] lg:flex-[0_0_23%] snap-start bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden ${!isOpen ? "opacity-80" : ""}`}
              >
                <FeaturedCover shop={shop} isOpen={isOpen} />

                <div className="p-3">
                  <h3 className="font-bold text-base truncate text-gray-900">{shop.name}</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 uppercase truncate mb-1.5">{shop.type}</p>

                  <div className="flex items-center justify-between gap-1.5 text-[9px] whitespace-nowrap">
                    {isOpen ? (
                      deliveryTime && (
                        <span className="flex items-center gap-0.5 text-gray-500 min-w-0 truncate">
                          <Clock size={10} className="shrink-0" />
                          <span className="truncate">{deliveryTime.label}</span>
                        </span>
                      )
                    ) : (
                      <span className="flex items-center gap-0.5 text-gray-500 min-w-0 truncate">
                        <Clock size={10} className="shrink-0" />
                        <span className="truncate">Opens {formatOpenTime(shop.openTime)}</span>
                      </span>
                    )}
                    {typeof shop.rating === "number" && (
                      <span className="flex items-center gap-0.5 shrink-0">
                        <Star size={10} className="fill-yellow-400 text-yellow-400 shrink-0" />
                        <span className="font-bold text-gray-800">{shop.rating.toFixed(1)}</span>
                        {typeof shop.reviews === "number" && (
                          <span className="text-gray-400">({shop.reviews})</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}