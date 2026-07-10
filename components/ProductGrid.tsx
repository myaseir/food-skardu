"use client";
import { useState, useMemo } from "react";
import { products } from "../data/products";
import { shops } from "../data/config";
import { useAvailability } from "../hooks/useAvailability";
import ProductCard from "./ProductCard";

// Official Panda Mart style categories
export const MART_CATEGORIES = [
  "All",
  "Fresh Produce",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Bakery & Breakfast",
  "Groceries & Staples",
  "Snacks & Chips",
  "Sweets & Chocolates",
  "Cold Beverages",
  "Tea & Coffee",
  "Household & Cleaning",
  "Personal Care",
  "Pharmacy & Wellness",
  "Baby Care",
  "Pet Care",
  "Stationery & Office",
];

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { checkShopStatus, isCategoryAvailable } = useAvailability();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      // 1. Basic Availability Check
      if (!isCategoryAvailable(p.category)) return false;
      
      const shop = shops.find((s) => s.id === p.shopId);
      if (shop && !checkShopStatus(shop)) return false;

      // 2. Search Logic
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      
      // 3. Category Logic
      if (selectedCategory === "All") {
        // Only show items that belong to the predefined Mart categories
        return MART_CATEGORIES.includes(p.category) && matchesSearch;
      }
      
      return p.category === selectedCategory && matchesSearch;
    });
  }, [selectedCategory, search, checkShopStatus, isCategoryAvailable]);

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-6 py-8">
      
      {/* Search Bar - Professional rounded design */}
      <div className="px-6 md:px-0 mb-6">
        <div className="relative max-w-xl">
          <input 
            className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-purple-600 focus:bg-white transition-all font-medium text-gray-900"
            placeholder="Search for reliable mart items..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="absolute left-4 top-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Panda Mart Style Category Slider */}
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md py-4 border-b border-gray-100 mb-8">
        <div className="flex overflow-x-auto gap-3 px-6 no-scrollbar pb-2">
          {MART_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 ease-in-out ${
                selectedCategory === category
                  ? "bg-purple-600 text-white shadow-md transform scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-6 md:px-0">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 mx-6 md:mx-0">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase">No items found</h3>
            <p className="text-gray-500 font-medium text-sm mt-1">Try selecting a different category or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}