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

export default function HomeClient() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<'restaurants' | 'products'>('restaurants');

  return (
    <main className="min-h-screen bg-white text-gray-900 pb-24 md:pb-0">
      {/* 1. Pass the props to the Navbar for Desktop users */}
     
      
    </main>
  );
}