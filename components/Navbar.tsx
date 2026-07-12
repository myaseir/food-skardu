"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, Utensils, ShoppingBasket } from "lucide-react";
import { useCart } from "@/store/useCart"; // Import the cart store

interface NavbarProps {
  onFoodClick?: () => void;
  onMartClick?: () => void;
  onCartClick?: () => void;
  currentView?: 'restaurants' | 'products';
}

export default function Navbar({ onFoodClick, onMartClick, onCartClick, currentView }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Pull items to count them for the notification badge
  const { items } = useCart();
  const itemCount = items.length;

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <span className="text-[9px] tracking-[0.2em] font-bold text-purple-600 uppercase">Skardu Delivery</span>
          <span className="text-xl font-black tracking-tighter text-gray-900">
            Meal <span className="text-purple-600">Bear</span>
          </span>
        </Link>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex gap-8 items-center">
          
          {/* Food Toggle */}
          <button 
            onClick={onFoodClick}
            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${currentView === 'restaurants' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
          >
            <Utensils size={16} /> Food
          </button>

          {/* Mart Toggle */}
          <button 
            onClick={onMartClick}
            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${currentView === 'products' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
          >
            <ShoppingBasket size={16} /> Mart
          </button>

          {/* Cart Button with Notification Badge */}
          <button 
            onClick={onCartClick}
            className="relative flex items-center gap-2 px-6 py-2 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-gray-900 transition-all active:scale-95"
          >
            <ShoppingCart size={16} />
            Order Now
            
            {/* Red Notification Badge */}
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Toggle (Hamburger icon) */}
        <button className="md:hidden p-2 text-gray-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Hamburger Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 md:hidden shadow-2xl">
          {["About Us", "contact"].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} 
              className="font-bold uppercase text-sm text-gray-700 hover:text-purple-600 transition-colors" 
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}