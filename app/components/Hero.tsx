"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Hero = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    /* Increased pt-32 on mobile and pt-40 on large screens to clear the fixed navbar */
    <section className="relative min-h-[90vh] lg:min-h-screen w-full flex items-center justify-center bg-[#070301] overflow-hidden pt-22 pb-12 lg:pt-20 lg:pb-20">
      
      {/* 1. Background Layers */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] right-[-5%] w-64 h-64 lg:w-[600px] lg:h-[600px] bg-[#f57c00] rounded-full blur-[80px] lg:blur-[120px]" 
      />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 items-center">
          
          {/* 2. Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-8 relative order-1 lg:order-1 w-full flex justify-center"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-full -mx-4 sm:mx-0 max-w-full sm:max-w-[550px] lg:max-w-[900px]"
            >
              <motion.div 
                animate={{ scale: [1, 0.8, 1], opacity: [0.6, 0.3, 0.6] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black blur-2xl rounded-full" 
              />
              
              <img 
                src="/hero.png" 
                alt="BR 9 Burger"
                className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] lg:drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] scale-125 sm:scale-110 lg:scale-100"
              />
            </motion.div>
          </motion.div>

          {/* 3. Text Content */}
          <div className="lg:col-span-4 text-center lg:text-left order-2 lg:order-2 mt-16 lg:mt-0">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4"
            >
              <span className="h-1 w-1 rounded-full bg-[#f57c00] animate-ping" />
              <p className="text-[#f57c00] text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em]">Always Open</p>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white text-3xl sm:text-4xl lg:text-5xl font-black italic leading-tight lg:leading-none uppercase tracking-tighter mb-3"
            >
              The Ultimate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f57c00] to-[#ffb74d]">
                Flavor Grill
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-gray-500 text-[10px] md:text-sm lg:text-base max-w-[280px] sm:max-w-sm mx-auto lg:mx-0 leading-relaxed mb-6 font-medium"
            >
              Islamabad's finest flame-grilled masterpieces, served fresh at any hour.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button className="group w-full sm:w-auto px-10 py-3 lg:py-4 bg-[#f57c00] text-white text-[10px] lg:text-xs font-black uppercase tracking-widest rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95">
                <span className="flex items-center justify-center gap-2">
                  Order Now <ShoppingBag size={14} className="group-hover:rotate-12 transition-transform" />
                </span>
              </button>
              
              <button className="flex items-center gap-2 text-white/50 font-black uppercase tracking-widest text-[9px] group hover:text-white transition-colors">
                Explore Menu <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;