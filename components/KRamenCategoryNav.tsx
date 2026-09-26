"use client";

import { useEffect, useRef } from "react";
import type { Category } from "@/hooks/useRestaurantPage";

interface KRamenCategoryNavProps {
  categories: Category[];
  activeCategory?: string | null;
  /** Height (px) of any sticky header above this nav, so scroll-to-section
   * lands below it instead of hidden underneath. Adjust to match your
   * hero/nav stack if it isn't the default sticky bar. */
  scrollOffset?: number;
}

export default function KRamenCategoryNav({
  categories,
  activeCategory,
  scrollOffset = 64,
}: KRamenCategoryNavProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Keep the active pill scrolled into view horizontally as the user
  // scrolls the page and activeCategory changes.
  //
  // IMPORTANT: this used to call pill.scrollIntoView({ inline: "center",
  // block: "nearest" }). On mobile Safari/Chrome, scrollIntoView can nudge
  // the *page's* vertical scroll position even with block: "nearest" —
  // especially when the target sits inside a `sticky` ancestor, which this
  // nav always does. Since activeCategory changes on every scroll tick (via
  // the IntersectionObserver in useRestaurantPage), that bug fired
  // constantly and looked exactly like "the page snaps back up while I'm
  // scrolling."
  //
  // Fix: scroll only this rail's own scrollLeft directly. That can never
  // touch the page's vertical scroll, since it's a plain property write on
  // this one element, not a browser-decided "bring into view" that walks
  // up the whole scroll-container chain.
  useEffect(() => {
    if (!activeCategory) return;
    const pill = pillRefs.current[activeCategory];
    const rail = railRef.current;
    if (!pill || !rail) return;

    const pillLeft = pill.offsetLeft;
    const pillRight = pillLeft + pill.offsetWidth;
    const railLeft = rail.scrollLeft;
    const railRight = railLeft + rail.clientWidth;

    if (pillLeft < railLeft || pillRight > railRight) {
      const pillCenter = pillLeft + pill.offsetWidth / 2;
      const targetScrollLeft = pillCenter - rail.clientWidth / 2;
      rail.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
    }
  }, [activeCategory]);

  const handleJump = (name: string) => {
    const el = document.getElementById(name);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (!categories?.length) return null;

  return (
    <nav aria-label="Menu categories" className="relative">
      <div
        ref={railRef}
        className="flex items-center gap-2 overflow-x-auto px-4 py-3 scrollbar-hide max-w-5xl mx-auto"
      >
        {categories.map((cat) => {
          const isActive = cat.name === activeCategory;
          return (
            <button
              key={cat.name}
              ref={(el) => {
                pillRefs.current[cat.name] = el;
              }}
              onClick={() => handleJump(cat.name)}
              aria-current={isActive ? "true" : undefined}
              style={{ fontFamily: "var(--font-display)" }}
              className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm tracking-wide border transition-all duration-150 ${
                isActive
                  ? "bg-[#d21f2f] border-[#d21f2f] text-white shadow-[0_2px_10px_rgba(210,31,47,0.35)]"
                  : "bg-white border-[#2a1810]/10 text-[#2a1810]/60 hover:text-[#2a1810] hover:border-[#2a1810]/25"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Edge fades so the scrollable rail reads as scrollable, not cut off */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#fdf1de] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#fdf1de] to-transparent" />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}