"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CoffeeTypes from "./components/CoffeeTypes";
import Products from "./components/Products";
import Footer from "./components/Footer";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0f0502] text-white overflow-x-hidden selection:bg-[#f57c00] selection:text-white">
      <Navbar />
      
      {/* Hero Section - The Main Entrance */}
      <Hero />

      {/* Categories / CoffeeTypes Section */}
      <div className="bg-gradient-to-b from-[#0f0502] to-[#1a0a05]">
        <CoffeeTypes />
      </div>

      {/* Best Sellers / Menu Highlights */}
      <section className="py-20 bg-[#0f0502]">
        <Products />
      </section>

      {/* Branch Section - Premium Dark Edition */}
      <section id="branches" className="py-24 px-4 bg-gradient-to-b from-[#0f0502] via-[#1a0a05] to-[#0f0502] relative">
        {/* Glowing Ambient Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-[#f57c00]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                BR 9 <span className="text-[#f57c00]">Locations</span>
              </h2>
              <p className="text-gray-400 max-w-xl text-lg font-medium border-l-2 border-[#f57c00] pl-6">
                Experience the same premium quality across Islamabad. Open 24/7 for those who never settle for average.
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-[#f57c00] font-black uppercase tracking-widest hover:gap-4 transition-all">
              View All Outlets <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BranchCard 
              name="Branch E11/2" 
              location="Main Service Road, Islamabad" 
              features={["Drive-Thru", "Signature Roasts"]}
              rating="4.9"
            />
            <BranchCard 
              name="Bahria Phase 8" 
              location="Business District, Islamabad" 
              features={["Rooftop", "Premium Lounge"]}
              rating="4.8"
            />
            <BranchCard 
              name="F-8/2 Madina Market" 
              location="Street 21, Madina Market" 
              features={["Classic Vibes", "Midnight Grill"]}
              rating="5.0"
            />
          </div>
        </div>
      </section>

      {/* Final Call to Action - High Impact */}
      <section className="py-32 relative text-center px-4 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[url('/grain.png')] opacity-20 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#f57c00] text-xs font-black uppercase tracking-[0.3em]">
            <Star size={14} fill="#f57c00" /> Premium Experience
          </div>
          
          <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-white leading-[0.8]">
            Fuel Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f57c00] to-[#ffb74d]">
              Ambition.
            </span>
          </h2>
          
          <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto font-medium">
            Islamabad&apos;s 24/7 destination for elite coffee and signature grills. 
            Freshly roasted, expertly served.
          </p>
          
          <div className="pt-6">
            <button className="bg-[#f57c00] text-white px-16 py-6 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(245,124,0,0.2)]">
              Order Online Now
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function BranchCard({ name, location, features, rating }: { name: string, location: string, features: string[], rating: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-md hover:border-[#f57c00]/50 transition-all duration-500"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="bg-[#f57c00] p-4 rounded-2xl shadow-[0_0_20px_rgba(245,124,0,0.3)] group-hover:scale-110 transition-transform">
          <MapPin className="text-white" size={24} />
        </div>
        <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <Star size={12} fill="#f57c00" className="text-[#f57c00]" />
          <span className="text-xs font-bold">{rating}</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2 group-hover:text-[#f57c00] transition-colors">{name}</h3>
      <p className="text-gray-500 mb-6 text-sm font-medium">{location}</p>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {features.map(f => (
          <span key={f} className="text-[10px] font-black uppercase tracking-tighter bg-white/5 border border-white/5 px-3 py-1.5 rounded-md text-gray-400 group-hover:border-white/20 transition-colors">
            {f}
          </span>
        ))}
      </div>
      
      <div className="flex items-center gap-3 text-white font-black text-[11px] uppercase tracking-widest bg-white/5 p-3 rounded-xl border border-white/5">
        <Clock size={16} className="text-[#f57c00]" />
        OPEN 24/7
      </div>
    </motion.div>
  );
}