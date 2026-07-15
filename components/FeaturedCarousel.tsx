"use client";
import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { shops } from "@/data/config";

// Add/remove shop ids here to control what shows in the carousel
const FEATURED_SHOP_IDS = ["yak-and-bull", "yak-grill-skardu", "pizza-king", "skyway-pizza"];

export default function FeaturedCarousel() {
  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps" });

  const featuredShops = FEATURED_SHOP_IDS
    .map((id) => shops.find((shop) => shop.id === id))
    .filter((shop): shop is typeof shops[number] => shop !== undefined);

  return (
    <div className="py-8">
      <h2 className="text-xl font-black px-6 mb-4 uppercase tracking-tighter">Popular Restaurants</h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 px-6">
          {featuredShops.map((shop) => (
            <Link
              href={`/restaurant/${shop.id}`}
              key={shop.id}
              className="flex-[0_0_70%] md:flex-[0_0_30%] bg-white p-4 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="relative w-full h-32 mb-3">
                <Image
                  src={shop.logo}
                  alt={shop.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-2xl"
                />
              </div>
              <h3 className="font-bold text-lg">{shop.name}</h3>
              <p className="text-xs text-gray-500 uppercase">{shop.type}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}