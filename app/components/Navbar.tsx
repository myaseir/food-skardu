"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav 
      className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled || isOpen
          ? "bg-[#0f0502]/95 backdrop-blur-md py-3 border-b border-white/10 shadow-2xl" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center">
          
          {/* 1. Desktop Left Navigation */}
          <div className="hidden md:flex gap-8 items-center flex-1">
            <Link href="/menu" className="text-[11px] tracking-[0.2em] uppercase font-black text-white hover:text-[#f57c00] transition-colors">
              The Menu
            </Link>
            <Link href="/offers" className="text-[11px] tracking-[0.2em] uppercase font-black text-white hover:text-[#f57c00] transition-colors">
              Special Offers
            </Link>
          </div>

          {/* 2. Central Logo - BR 9 Branding */}
          <div className="flex-shrink-0 z-50">
            <Link 
              href="/" 
              onClick={closeMenu}
              className="group flex flex-col items-center leading-none"
            >
              <span className="text-[10px] tracking-[0.4em] uppercase font-bold mb-1 text-[#f57c00]">Cafe & Restaurant</span>
              <span className="text-3xl md:text-4xl font-black italic tracking-tighter text-white group-hover:scale-105 transition-transform">
                BR <span className="text-[#f57c00]">9</span>
              </span>
            </Link>
          </div>

          {/* 3. Desktop Right Navigation */}
          <div className="hidden md:flex gap-8 items-center justify-end flex-1">
            <Link href="/delivery" className="text-[11px] tracking-[0.2em] uppercase font-black text-white hover:text-[#f57c00] transition-colors">
              Delivery
            </Link>
            <Link 
              href="https://wa.me/923335539381"
              target="_blank"
              className="px-6 py-2.5 bg-[#f57c00] text-white text-[11px] tracking-[0.1em] uppercase font-black hover:bg-white hover:text-black transition-all duration-300 rounded-sm shadow-lg"
            >
              Book A Table
            </Link>
          </div>

          {/* 4. Mobile Toggle Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none p-2 relative z-[110]"
              aria-label="Toggle Menu"
            >
              <div className="w-6 flex flex-col items-end gap-1.5">
                <span className={`h-[2px] bg-white transition-all duration-300 ${isOpen ? "w-6 rotate-45 translate-y-2 !bg-[#f57c00]" : "w-6"}`}></span>
                <span className={`h-[2px] bg-white transition-all duration-300 ${isOpen ? "opacity-0" : "w-4"}`}></span>
                <span className={`h-[2px] bg-white transition-all duration-300 ${isOpen ? "w-6 -rotate-45 -translate-y-2 !bg-[#f57c00]" : "w-5"}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 w-full h-screen bg-[#0f0502] z-[90] transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          <UtensilsCrossed size={40} className="text-[#f57c00] mb-4 opacity-50" />
          
          {["Home", "Menu", "Special Offers", "Delivery", "Contact"].map((item) => (
            <Link 
              key={item}
              href={`/${item.toLowerCase().replace(" ", "-")}`} 
              onClick={closeMenu} 
              className="text-2xl tracking-[0.2em] uppercase font-black text-white hover:text-[#f57c00] transition-colors"
            >
              {item}
            </Link>
          ))}

          <Link 
            href="https://wa.me/923335539381"
            target="_blank"
            onClick={closeMenu}
            className="mt-6 px-10 py-4 bg-[#f57c00] text-white text-sm tracking-[0.2em] uppercase font-black rounded-full"
          >
            Order Now
          </Link>

          <div className="absolute bottom-10 flex flex-col items-center">
            <span className="text-[10px] tracking-[0.5em] text-white/30 uppercase mb-2">Locate Us</span>
            <span className="text-xs text-white font-bold">RAWALPINDI, PAKISTAN</span>
          </div>
        </nav>
      </div>
    </nav>
  );
}