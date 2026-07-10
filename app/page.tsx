"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Hero from "@/components/Hero";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import ProductGrid from "@/components/ProductGrid";
import RestaurantList from "@/components/RestaurantList";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<'restaurants' | 'products'>('restaurants');

  return (
    <main className="min-h-screen bg-white text-gray-900 pb-24 md:pb-0">
      {/* 1. Pass the props to the Navbar for Desktop users */}
      <Navbar 
        onFoodClick={() => setView('restaurants')} 
        onMartClick={() => setView('products')} 
        onCartClick={() => setIsCartOpen(true)}
        currentView={view} // Optional: helps highlight the active tab
      />
      
      <Hero />

      {view === 'restaurants' && <FeaturedCarousel />}

      <section id="shop" className="py-12">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter">
            {view === 'restaurants' ? 'All Restaurants' : 'Everything Available'}
          </h2>
        </div>

        {view === 'restaurants' ? <RestaurantList /> : <ProductGrid />}
      </section>

      <div className="hidden md:block"><Footer /></div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="md:hidden">
        <MobileNav 
          onFoodClick={() => setView('restaurants')} 
          onMartClick={() => setView('products')} 
          onCartClick={() => setIsCartOpen(true)} 
        />
      </div>
      <Footer/>
    </main>
  );
}