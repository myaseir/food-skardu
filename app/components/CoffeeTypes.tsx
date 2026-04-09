"use client";

import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";

const coffeeTypes = [
  { id: 1, name: "Iced Coffee", icon: "https://cdn-icons-png.flaticon.com/512/9198/9198032.png", desc: "Chilled Perfection" },
  { id: 2, name: "Signature Grill", icon: "https://cdn-icons-png.flaticon.com/512/1046/1046769.png", desc: "Flame Kissed" },
  { id: 3, name: "Bold Espresso", icon: "https://cdn-icons-png.flaticon.com/512/3504/3504827.png", desc: "Pure Intensity" },
  { id: 4, name: "Artisan Latte", icon: "https://cdn-icons-png.flaticon.com/512/3127/3127450.png", desc: "Creamy Canvas" },
];

const CoffeeTypes = () => {
  return (
    <section className="bg-[#0f0502] py-20 lg:py-32 px-6 relative overflow-hidden border-t border-white/5">
      
      {/* 1. Large Ghost Background Text (Industrial Premium Style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.02] whitespace-nowrap">
        <span className="text-[30vw] lg:text-[22vw] font-black italic uppercase tracking-tighter">AUTHENTIC</span>
      </div>

      {/* 2. Amber Glow Effects */}
      <div className="absolute top-0 right-0 w-[20rem] lg:w-[40rem] h-[20rem] lg:h-[40rem] bg-[#f57c00]/5 rounded-full blur-[80px] lg:blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* Sub-heading with accent line */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 lg:gap-4 mb-4"
        >
          <div className="h-[1px] lg:h-[2px] w-8 lg:w-12 bg-[#f57c00]" />
          <h3 className="text-[10px] lg:text-sm font-black text-[#f57c00] uppercase tracking-[0.3em] lg:tracking-[0.5em]">
            The BR 9 Standard
          </h3>
          <div className="h-[1px] lg:h-[2px] w-8 lg:w-12 bg-[#f57c00]" />
        </motion.div>
        
        {/* Main Bold Heading - Reduced sizing */}
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl lg:text-8xl font-black italic text-white mb-12 lg:mb-20 leading-none uppercase tracking-tighter"
        >
          Signature
        </motion.h2>

        {/* Categories Grid - Adjusted for mobile visibility */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 lg:gap-y-16 gap-x-4 lg:gap-x-8 items-end pt-5">
          {coffeeTypes.map((type, idx) => (
            <motion.div 
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer flex flex-col items-center"
            >
              <div className="relative mb-6 lg:mb-8">
                <div className="absolute inset-0 bg-white/5 rounded-full scale-110 lg:scale-125 blur-xl lg:blur-2xl group-hover:bg-[#f57c00]/20 group-hover:scale-150 transition-all duration-700" />
                
                <div className="relative z-10 transform group-hover:-translate-y-4 lg:group-hover:-translate-y-6 group-hover:rotate-[6deg] lg:group-hover:rotate-[10deg] transition-all duration-500 ease-out">
                  <img 
                    src={type.icon} 
                    alt={type.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 object-contain brightness-0 invert opacity-60 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-500"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-[#f57c00] font-black italic text-[8px] lg:text-[10px] tracking-widest uppercase">{type.desc}</p>
                <p className="text-white font-black italic uppercase tracking-tighter text-sm lg:text-xl group-hover:text-[#f57c00] transition-colors leading-tight">
                  {type.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 lg:mt-32 space-y-6 lg:space-y-8 flex flex-col items-center">
          <div className="space-y-2">
            <p className="text-gray-400 font-medium italic text-base lg:text-xl">
              24/7 Quality Service
            </p>
            <div className="h-0.5 lg:h-1 w-12 lg:w-16 bg-[#f57c00] mx-auto rounded-full" />
          </div>

          <button className="group relative bg-[#f57c00] text-white px-10 lg:px-16 py-4 lg:py-6 rounded-full font-black text-[10px] lg:text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl">
            <span className="relative z-10 flex items-center gap-2 lg:gap-3">
              Explore Full Menu <MoveRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Small Angled Badge - Reduced for mobile */}
      <div className="absolute bottom-[-5%] lg:bottom-[-10%] right-[-5%] w-1/2 lg:w-1/3 h-[15%] lg:h-[20%] bg-white/5 -rotate-[10deg] backdrop-blur-3xl border border-white/10 flex items-center justify-center">
          <div className="text-white font-black italic text-xs lg:text-2xl opacity-10 tracking-[0.2em]">
            BR 9 EXCLUSIVE
          </div>
      </div>
    </section>
  );
};

export default CoffeeTypes;