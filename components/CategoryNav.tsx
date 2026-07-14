"use client"; // This tells Next.js this is a Client Component

import { useEffect, useRef } from "react";

interface CategoryNavProps {
  categories: any[];
  activeCategory?: string | null;
}

export default function CategoryNav({ categories, activeCategory }: CategoryNavProps) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // When the active category changes (from scrolling the page), make sure
  // its button is visible within the horizontally-scrolling nav bar.
  useEffect(() => {
    if (!activeCategory) return;
    const activeButton = buttonRefs.current[activeCategory];
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeCategory]);

  return (
    <nav className="sticky top-0 bg-white z-20 border-b border-gray-100 overflow-x-auto flex px-6 py-4 gap-6 no-scrollbar">
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
            className={`font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
              isActive
                ? "text-purple-600 font-black"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </nav>
  );
}