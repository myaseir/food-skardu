"use client";
import React, { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { shops, Shop } from "@/data/config";

// Add/remove shop ids here to control what shows in the carousel
const FEATURED_SHOP_IDS = ["yak-and-bull", "aima-kitchen", "dominos-skardu", "yak-grill-skardu", "pizza-king", "skyway-pizza"];

function FeaturedLogo({ shop }: { shop: Shop }) {
  const [imgError, setImgError] = useState(false);
  const hasLogo = !!shop.logo && !imgError;

  return (
    <div className="relative w-full h-32 mb-3 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
      {hasLogo ? (
        <Image
          src={shop.logo}
          alt={shop.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 33vw"
          className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
          <span className="text-2xl font-black text-gray-300">
            {shop.name.charAt(0)}
          </span>
          <span className="text-gray-300 text-[9px] font-black uppercase tracking-widest">
            No Logo
          </span>
        </div>
      )}
    </div>
  );
}

export default function FeaturedCarousel() {
  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps" });

  const featuredShops = FEATURED_SHOP_IDS
    .map((id) => shops.find((shop) => shop.id === id))
    .filter((shop): shop is Shop => shop !== undefined);

  return (
    <div className="py-8">
      <h2 className="text-xl font-black px-6 mb-4 uppercase tracking-tighter">Popular Restaurants</h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 px-6 snap-x snap-mandatory">
          {featuredShops.map((shop) => (
            <Link
              href={`/restaurant/${shop.id}`}
              key={shop.id}
              className="group flex-[0_0_44%] sm:flex-[0_0_36%] md:flex-[0_0_30%] lg:flex-[0_0_23%] snap-start bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300"
            >
              <FeaturedLogo shop={shop} />

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm md:text-lg truncate">{shop.name}</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 uppercase truncate">{shop.type}</p>
                </div>

                {typeof shop.rating === "number" && (
                  <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    {shop.rating.toFixed(1)}
                    {typeof shop.reviews === "number" && (
                      <span className="text-gray-400 font-medium">({shop.reviews})</span>
                    )}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}