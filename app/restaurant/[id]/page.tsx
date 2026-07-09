"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getShopById, getMenuByShopId } from "@/lib/dataService";
import ShopStatusBadge from "@/components/ShopStatusBadge";
import CategoryNav from "@/components/CategoryNav";
import { useCart } from "@/store/useCart";
import CartDrawer from "@/components/CartDrawer";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  desc?: string;
  image?: string;
}

interface Category {
  name: string;
  items: MenuItem[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RestaurantPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [data, setData] = useState<{ shop: any; menu: any } | null>(null);
  const [loading, setLoading] = useState(true);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, addItem } = useCart();
  
  // FIXED: Calculate total by multiplying price * quantity for each item
  const cartTotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  useEffect(() => {
    async function fetchData() {
      try {
        const shopData = await getShopById(id);
        const menuData = await getMenuByShopId(id);
        
        if (!shopData || !menuData) {
          setLoading(false);
          return;
        }
        
        setData({ shop: shopData, menu: menuData });
      } catch (error) {
        console.error("Failed to load restaurant data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest">Loading Menu...</p>
      </div>
    );
  }

  if (!data) return notFound();

  const { shop, menu } = data;

  return (
    <main className="min-h-screen bg-gray-50 pb-24 relative">
      <div className="bg-white p-6 shadow-sm relative">
        <Link 
          href="/" 
          className="absolute top-6 left-6 z-30 bg-white/80 backdrop-blur-md p-2 rounded-full border border-gray-100 shadow-sm hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="max-w-3xl mx-auto flex items-center gap-4 pl-10">
          <Image src={menu.logo} alt={menu.name} width={80} height={80} className="rounded-2xl border object-cover" />
          <div>
            <h1 className="text-2xl font-black uppercase">{menu.name}</h1>
            <ShopStatusBadge shop={shop} />
          </div>
        </div>
      </div>

      <CategoryNav categories={menu.categories} />

      <div className="max-w-3xl mx-auto px-6 py-8">
        {menu.categories.map((cat: Category) => (
          <section key={cat.name} id={cat.name} className="mb-12">
            <h2 className="text-xl font-black mb-6 uppercase tracking-tighter">{cat.name}</h2>
            <div className="grid gap-4">
              {cat.items.map((item: MenuItem) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="flex-grow">
                    <h3 className="font-bold text-md">{item.name}</h3>
                    {item.desc && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>}
                    
                    <div className="flex items-center justify-between mt-3">
                      <p className="font-black text-purple-600">Rs. {item.price}</p>
                      <button 
                        onClick={() => addItem({ ...item, shopId: id, category: cat.name })}
                        className="bg-purple-600 text-white w-9 h-9 rounded-xl font-black flex items-center justify-center hover:bg-purple-700 transition-all active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {item.image && (
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover rounded-xl shadow-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-6 left-0 w-full px-6 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-purple-600 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center active:scale-95 transition-transform"
          >
            <div className="bg-white/20 px-3 py-1 rounded-lg font-black text-sm">
              {/* FIXED: Sum up total quantity instead of just array length */}
              {items.reduce((sum, item) => sum + (item.quantity || 1), 0)} items
            </div>
            <span className="font-black uppercase tracking-widest text-sm">View Cart</span>
            <span className="font-black">Rs. {cartTotal}</span>
          </button>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}