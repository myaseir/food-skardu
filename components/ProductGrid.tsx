"use client";
import { useState, useMemo } from "react";
import { products } from "../data/products";
import { shops } from "../data/config";
import { useAvailability } from "../hooks/useAvailability";
import Categories from "./Categories";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [search, setSearch] = useState("");
  const { checkShopStatus, isCategoryAvailable } = useAvailability();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!isCategoryAvailable(p.category)) return false;
      const shop = shops.find((s) => s.id === p.shopId);
      if (shop && !checkShopStatus(shop)) return false;
      return (selectedCategory === "All" || p.category === selectedCategory) && 
             p.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [selectedCategory, search, checkShopStatus, isCategoryAvailable]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <input 
        className="w-full max-w-lg mb-8 p-4 border rounded-2xl outline-none focus:border-purple-600"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <Categories 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
        categories={["All", "Food", "Mart"]} 
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {filtered.map((p) => <ProductCard key={p.id} {...p} />)}
      </div>
    </div>
  );
}