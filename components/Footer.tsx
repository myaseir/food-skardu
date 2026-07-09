"use client";

import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-lg font-black tracking-tighter text-gray-900">FOOD SKARDU</h2>
          <p className="text-[11px] leading-relaxed text-gray-500 font-medium">
            Premium on-demand delivery service for Skardu. Reliability, speed, and quality in every order.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Operations</p>
          <div className="flex flex-col gap-2">
            <Link href="#" className="text-[11px] text-gray-600 hover:text-purple-600">Shop Items</Link>
            <Link href="#" className="text-[11px] text-gray-600 hover:text-purple-600">Track Order</Link>
            <Link href="#" className="text-[11px] text-gray-600 hover:text-purple-600">Support</Link>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Coverage</p>
          <div className="flex items-center gap-2 text-[11px] text-gray-600">
            <MapPin size={14} className="text-purple-600" />
            <span>Skardu, Gilgit-Baltistan</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-600">
            <Clock size={14} className="text-purple-600" />
            <span>10:00 AM - 10:00 PM</span>
          </div>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Updates</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-[11px] outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200 text-center text-[9px] font-bold uppercase tracking-widest text-gray-400">
        © 2026 FOOD SKARDU. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}