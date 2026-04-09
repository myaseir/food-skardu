"use client";

import Link from "next/link";
import { 
  UtensilsCrossed, 
  Phone, 
  MapPin, 
  Clock, 
  
  ArrowRight 
} from "lucide-react";

const Footer = () => {
  const branches = [
    { name: "Branch E11/2", address: "Main Service Rd, Islamabad" },
    { name: "Bahria Phase 8", address: "Business District, Rawalpindi" },
    { name: "Branch F-8/2", address: "Madina Market, St 21, Islamabad" },
  ];

  return (
    <footer className="bg-[#0f0502] text-white py-20 px-6 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#f57c00]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        {/* 1. Brand Section */}
        <div className="md:col-span-1 space-y-6">
          <Link href="/" className="flex flex-col leading-none group">
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold mb-1 text-[#f57c00]">Cafe & Restaurant</span>
            <span className="text-3xl font-black italic tracking-tighter text-white">
              BR <span className="text-[#f57c00]">9</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            Islamabad&apos;s elite destination for signature grills and artisan brews. 
            Crafting unforgettable moments, 24/7.
          </p>
          <div className="flex gap-4">
            {[
              { Icon: Phone, href: "#" },
              { Icon: Phone, href: "#" },
              { Icon: Phone, href: "#" }
            ].map((social, i) => (
              <Link 
                key={i} 
                href={social.href} 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#f57c00] hover:text-white hover:border-[#f57c00] transition-all duration-300"
              >
                <social.Icon size={18} />
              </Link>
            ))}
          </div>
        </div>

        {/* 2. Quick Links */}
        <div className="space-y-6">
          <h3 className="text-[#f57c00] font-black uppercase tracking-[0.2em] text-xs">Navigation</h3>
          <ul className="space-y-4">
            {["The Menu", "Special Offers", "Delivery", "About Us", "Contact"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group">
                  <span className="w-0 h-[1.5px] bg-[#f57c00] group-hover:w-4 transition-all duration-300" />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Branches Section */}
        <div className="space-y-6">
          <h3 className="text-[#f57c00] font-black uppercase tracking-[0.2em] text-xs">Our Outlets</h3>
          <div className="space-y-6">
            {branches.map((branch) => (
              <div key={branch.name} className="group">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#f57c00] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-black italic uppercase text-sm tracking-tight group-hover:text-[#f57c00] transition-colors">
                      {branch.name}
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">{branch.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Newsletter & Contact */}
        <div className="space-y-6">
          <h3 className="text-[#f57c00] font-black uppercase tracking-[0.2em] text-xs">Stay Sharp</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              <Clock size={20} className="text-[#f57c00]" />
              <div>
                <p className="text-white font-black italic uppercase text-xs">Open 24/7</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Always Brewing</p>
              </div>
            </div>
            
            <div className="relative group">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-xs font-black tracking-widest text-white focus:outline-none focus:border-[#f57c00] transition-colors"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-[#f57c00] text-white px-4 rounded-full hover:bg-white hover:text-black transition-all">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Phone size={18} className="text-[#f57c00]" />
            <p className="text-white font-black tracking-widest text-sm">+92 3XX XXXXXXX</p>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">
        <p>© 2026 BR 9 RESTAURANT GROUP. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-[#f57c00] transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-[#f57c00] transition-colors">Terms</Link>
          <Link href="#" className="hover:text-[#f57c00] transition-colors">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;