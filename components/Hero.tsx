"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle } from "lucide-react";
import { getShops } from "@/lib/dataService"; // Import your centralized data fetcher

interface Shop {
  id: string;
  name: string;
  // Add other properties if needed, but we only need id and name for the search
}

export default function Hero() {
  const router = useRouter();
  
  // State for centralized data
  const [restaurants, setRestaurants] = useState<Shop[]>([]);
  
  // Search state
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);

  // Fetch the real restaurant list on mount
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

  // Case-insensitive filtering logic using the LIVE data
  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (filteredRestaurants.length > 0) {
      // If they type a valid name and hit "Find", auto-route to the best match
      handleSelect(filteredRestaurants[0].id, filteredRestaurants[0].name);
    } else {
      // Show inline error if no match exists
      setNotFoundError(true);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (id: string, name: string) => {
    setQuery(name);
    setShowSuggestions(false);
    setNotFoundError(false);
    // Route them directly to the restaurant's menu
    router.push(`/restaurant/${id}`); 
  };

  return (
    <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden bg-gray-50">
      
      {/* Light Background Theme */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero-bg.jpg" 
          alt="Skardu Food Delivery" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-6 w-full max-w-2xl mt-12 md:mt-0">
        
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-4">
          Cravings in <span className="text-purple-600">Skardu?</span>
        </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 font-medium">
  Fast food delivery in Skardu - From your favorite restaurants to your doorstep, office, or hotel room.
</p>

        {/* Smart Search Bar */}
        <div className="relative w-full max-w-lg mx-auto">
          <form 
            onSubmit={handleSearch} 
            className={`flex bg-white p-2 rounded-2xl shadow-xl border transition-colors ${notFoundError ? 'border-red-500' : 'border-gray-100'}`}
          >
            <div className="flex items-center pl-4 text-gray-400">
              <Search size={20} />
            </div>
            
            <input 
              type="text" 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
                setNotFoundError(false); // Clear the error instantly when they start typing again
              }}
              onFocus={() => setShowSuggestions(true)}
              // Delay allows the click event on a suggestion to fire before the dropdown closes
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search for restaurants..." 
              className="w-full px-4 py-3 bg-transparent outline-none font-bold text-gray-700 placeholder:text-gray-300"
            />
            
            <button 
              type="submit"
              className="bg-purple-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-purple-700 active:scale-95 transition-all"
            >
              Find
            </button>
          </form>

          {/* Inline "Not Found" Error Message */}
          {notFoundError && (
            <div className="absolute top-full mt-3 w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 py-2 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <span className="text-sm font-bold uppercase tracking-widest">No restaurant found</span>
            </div>
          )}

          {/* Dynamic Suggestions Dropdown */}
          {showSuggestions && query.length > 0 && !notFoundError && (
            <div className="absolute top-full mt-4 left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 text-left">
              {filteredRestaurants.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {filteredRestaurants.map(restaurant => (
                    <li 
                      key={restaurant.id}
                      onClick={() => handleSelect(restaurant.id, restaurant.name)}
                      className="px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-purple-50 hover:text-purple-600 cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <span className="font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
                        {restaurant.name}
                      </span>
                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-300 group-hover:text-purple-400 transition-colors">
                        Restaurant
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 font-bold text-sm">No restaurants found for "{query}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try searching for something else.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}