"use client";
import React from "react";
import Link from "next/link";
import { Utensils, ShoppingBasket, Truck, ShoppingCart } from "lucide-react";
import { useCart } from "@/store/useCart"; // 1. Import the cart store

// Define the complete Props interface to match app/page.tsx
interface MobileNavProps {
  onFoodClick: () => void;
  onMartClick: () => void;
  onCartClick: () => void;
}

export default function MobileNav({ onFoodClick, onMartClick, onCartClick }: MobileNavProps) {
  // 2. Pull items from Zustand to count them
  const { items } = useCart();
  const itemCount = items.length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 grid grid-cols-4 z-[100] pb-6">
      {/* Pass the specific click handlers to each button */}
      <NavButton icon={<Utensils size={20} />} label="Food" onClick={onFoodClick} />
      <NavButton icon={<ShoppingBasket size={20} />} label="Mart" onClick={onMartClick} />

      {/* Ride & Parcel now routes to its own page */}
      <Link
        href="/ride-parcel"
        className="flex flex-col items-center justify-center py-4 gap-1 text-[10px] font-black uppercase text-gray-500 hover:text-purple-600 transition-all active:scale-95"
      >
        <Truck size={20} />
        Ride & Parcel
      </Link>

      {/* 3. Assign the onCartClick event and add the Notification Badge */}
      <button 
        onClick={onCartClick} 
        className="flex flex-col items-center justify-center py-4 gap-1 text-[10px] font-black uppercase text-gray-500 hover:text-purple-600 transition-all active:scale-95"
      >
        <div className="relative">
          <ShoppingCart size={20} />
          {/* Red Notification Badge - Only shows if items > 0 */}
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
              {itemCount}
            </span>
          )}
        </div>
        Cart
      </button>
    </div>
  );
}

// 4. NavButton helper component remains the same
function NavButton({ 
  icon, 
  label, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick?: () => void 
}){
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center py-4 gap-1 text-[10px] font-black uppercase text-gray-500 hover:text-purple-600 transition-all active:scale-95"
    >
      {icon}
      {label}
    </button>
  );
}