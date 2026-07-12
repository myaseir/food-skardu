"use client";

import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        
        {/* Brand + Coverage */}
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-lg font-black tracking-tighter text-gray-900">Meal Bear Skardu</h2>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] text-gray-600">
            <MapPin size={14} className="text-purple-600" />
            <span>Skardu, Gilgit-Baltistan</span>
          </div>
        </div>

        {/* Links + Contact */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <Link href="/terms" className="hover:text-purple-600 transition-colors">
              Terms
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/privacy" className="hover:text-purple-600 transition-colors">
              Privacy Policy
            </Link>
          </div>

          <Link
            href="/contact"
            className="flex items-center gap-2 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full hover:bg-purple-700 active:scale-95 transition-all"
          >
            <Phone size={13} />
            Contact
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-200 text-center text-[9px] font-bold uppercase tracking-widest text-gray-400">
        © 2026 Meal Bear. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}