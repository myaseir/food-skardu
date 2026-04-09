"use client";

import { Star, ShoppingBag, Flame } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  { 
    id: 1, 
    name: "Classic BR 9 Burger", 
    price: "$12.00", 
    rating: 5,
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    id: 2, 
    name: "Caramel Macchiato", 
    price: "$08.00", 
    rating: 5,
    tag: "Premium Brew",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    id: 3, 
    name: "Smoked Steak", 
    price: "$28.00", 
    rating: 4,
    tag: "Signature Grill",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    id: 4, 
    name: "Nitro Cold Brew", 
    price: "$09.00", 
    rating: 5,
    tag: "Ice Cold",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop" 
  },
];

const Products = () => {
  return (
    <section id="menu" className="py-24 bg-[#0f0502] px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-[#f57c00]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 text-[#f57c00] font-black uppercase tracking-[0.3em] text-xs">
            <Flame size={16} fill="#f57c00" /> Hot & Fresh
          </div>
          <h2 className="text-6xl md:text-8xl font-black italic text-white uppercase tracking-tighter leading-none">
            Weekly <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f57c00] to-[#ffb74d]">Favorites</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            From flame-grilled masterpieces to artisan brews. Experience the flavors 
            that define Islamabad's premium dining scene.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              whileHover={{ y: -10 }}
              className="group flex flex-col"
            >
              {/* Image Container: Premium Obsidian Box */}
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl aspect-[4/5] flex items-center justify-center p-6 mb-8 relative overflow-hidden transition-all duration-500 group-hover:border-[#f57c00]/50 shadow-2xl">
                
                {/* Product Tag */}
                <div className="absolute top-4 left-4 z-20 bg-[#f57c00] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full italic tracking-widest shadow-lg">
                  {product.tag}
                </div>

                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl transform transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                
                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-[#f57c00] text-white px-8 py-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-full transform -translate-y-4 group-hover:translate-y-0 duration-500">
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex justify-between items-start px-2">
                <div className="space-y-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < product.rating ? "fill-[#f57c00] text-[#f57c00]" : "text-white/10"} 
                      />
                    ))}
                  </div>
                  <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none group-hover:text-[#f57c00] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                    BR 9 Exclusive
                  </p>
                </div>
                
                <span className="text-2xl font-black text-[#f57c00] italic italic tracking-tighter">
                  {product.price}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-24 text-center">
          <button className="text-white/30 hover:text-[#f57c00] font-black uppercase tracking-[0.5em] text-[10px] transition-colors flex flex-col items-center gap-4 mx-auto">
            <div className="h-px w-24 bg-white/10" />
            View Full Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;