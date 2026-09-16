"use client"; // This tells Next.js this is a Client Component

import { useEffect, useRef } from "react";

interface CategoryNavProps {
  categories: any[];
  activeCategory?: string | null;
}

export default function CategoryNav({ categories, activeCategory }: CategoryNavProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (!activeCategory) return;
    const nav = navRef.current;
    const activeButton = buttonRefs.current[activeCategory];
    if (!nav || !activeButton) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = activeButton.getBoundingClientRect();

    const buttonOffsetLeft = activeButton.offsetLeft;
    const buttonWidth = btnRect.width;
    const navWidth = navRect.width;

    const targetScrollLeft = buttonOffsetLeft - navWidth / 2 + buttonWidth / 2;

    nav.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: "smooth",
    });
  }, [activeCategory]);

  return (
    <nav
      ref={navRef}
      // Changed to dark theme matching the screenshot with a subtle bottom border
      className="sticky top-0 z-20 bg-[#0b0c14]/95 backdrop-blur-md border-b border-white/10 overflow-x-auto flex px-4 sm:px-6 pt-4 gap-6 sm:gap-8 no-scrollbar"
    >
      {categories.map((cat: any) => {
        const isActive = cat.name === activeCategory;

        return (
          <button
            key={cat.name}
            ref={(el) => {
              buttonRefs.current[cat.name] = el;
            }}
            onClick={() => {
              const element = document.getElementById(cat.name);
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            aria-current={isActive ? "true" : undefined}
            // Relative positioning added so the absolute underline aligns to the text width
            className={`relative pb-3 font-semibold text-sm sm:text-base uppercase tracking-widest whitespace-nowrap transition-colors ${
              isActive
                ? "text-red-500" // Bright red for active text
                : "text-gray-300 hover:text-gray-100" // Light gray for inactive
            }`}
          >
            {cat.name}
            
            {/* The distinct red underline that appears only on the active category */}
            {isActive && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-500 rounded-t-sm" />
            )}
          </button>
        );
      })}
    </nav>
  );
}