"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle } from "lucide-react";
import { getShops } from "@/lib/dataService";

interface Shop {
  id: string;
  name: string;
}

export default function Hero() {
  const router = useRouter();

  const [restaurants, setRestaurants] = useState<Shop[]>([]);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const shops = await getShops();
        if (shops) {
          setRestaurants(shops);
        }
      } catch (error) {
        console.error("Failed to load restaurants for search:", error);
      }
    }
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (filteredRestaurants.length > 0) {
      handleSelect(filteredRestaurants[0].id, filteredRestaurants[0].name);
    } else {
      setNotFoundError(true);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (id: string, name: string) => {
    setQuery(name);
    setShowSuggestions(false);
    setNotFoundError(false);
    router.push(`/restaurant/${id}`);
  };

  return (
    // NOTE: overflow-hidden removed here — it was clipping the
    // absolutely-positioned suggestions dropdown.
    <section className="relative w-full min-h-[280px] md:h-[500px] flex items-center justify-center bg-gray-50 pt-20 pb-6 md:py-0">
      {/* Background gradient gets its own clipped layer so it doesn't
          affect the dropdown */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 w-full max-w-2xl mt-1 md:mt-0">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-3 md:mb-4">
          Cravings in <span className="text-purple-600">Skardu?</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 font-medium px-2">
          Fast food delivery in Skardu - From your favorite restaurants to
          your doorstep, office, or hotel room.
        </p>

        {/* Smart Search Bar */}
        <div className="relative w-full max-w-lg mx-auto">
          <form
            onSubmit={handleSearch}
            className={`flex bg-white p-1.5 sm:p-2 rounded-2xl shadow-xl border transition-colors ${
              notFoundError ? "border-red-500" : "border-gray-100"
            }`}
          >
            <div className="flex items-center pl-3 sm:pl-4 text-gray-500 shrink-0">
              <Search size={18} className="sm:hidden" />
              <Search size={20} className="hidden sm:block" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
                setNotFoundError(false);
              }}
              onFocus={() => setShowSuggestions(true)}
              // Delay still helps for mouse users; touch is handled via
              // onMouseDown/onTouchStart on the suggestion items below.
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search for restaurants..."
              className="w-full min-w-0 px-2 sm:px-4 py-2.5 sm:py-3 bg-transparent outline-none font-bold text-sm sm:text-base text-gray-700 placeholder:text-gray-300"
            />

            <button
              type="submit"
              className="bg-purple-600 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-purple-700 active:scale-95 transition-all shrink-0"
            >
              Find
            </button>
          </form>

          {/* Inline "Not Found" Error Message */}
          {notFoundError && (
            <div className="absolute top-full mt-3 w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 py-2 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2 z-[100]">
              <AlertCircle size={16} />
              <span className="text-sm font-bold uppercase tracking-widest">
                No restaurant found
              </span>
            </div>
          )}

          {/* Dynamic Suggestions Dropdown */}
          {showSuggestions && query.length > 0 && !notFoundError && (
            <div className="absolute top-full mt-3 sm:mt-4 left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 text-left max-h-[60vh]">
              {filteredRestaurants.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto overscroll-contain">
                  {filteredRestaurants.map((restaurant) => (
                    <li
                      key={restaurant.id}
                      // onMouseDown/onTouchStart fire BEFORE the input's
                      // onBlur, so taps register reliably on mobile
                      onMouseDown={(e) => e.preventDefault()}
                      onTouchStart={() =>
                        handleSelect(restaurant.id, restaurant.name)
                      }
                      onClick={() =>
                        handleSelect(restaurant.id, restaurant.name)
                      }
                      className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-50 last:border-0 hover:bg-purple-50 hover:text-purple-600 active:bg-purple-50 cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <span className="font-bold text-sm sm:text-base text-gray-700 group-hover:text-purple-600 transition-colors truncate pr-2">
                        {restaurant.name}
                      </span>
                      <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-gray-300 group-hover:text-purple-400 transition-colors shrink-0">
                        Restaurant
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 font-bold text-sm">
                    No restaurants found for "{query}"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Try searching for something else.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}