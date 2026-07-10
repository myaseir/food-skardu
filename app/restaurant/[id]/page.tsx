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
import { useAvailability } from "@/hooks/useAvailability";

interface Variant {
  name: string;
  price: number;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  desc?: string;
  image?: string;
  variants?: Variant[];
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
  const { checkShopStatus } = useAvailability();

  const [selectedItem, setSelectedItem] = useState<(MenuItem & { category: string }) | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const cartTotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

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
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest">
          Loading Menu...
        </p>
      </div>
    );
  }

  if (!data) return notFound();

  const { shop, menu } = data;
  const isShopOpen = checkShopStatus(shop);

  const handleItemClick = (item: MenuItem, catName: string) => {
    if (!isShopOpen) return;

    if (item.variants && item.variants.length > 0) {
      setSelectedItem({ ...item, category: catName });
      setSelectedVariant(item.variants[0]);
    } else {
      addItem({ ...item, shopId: id, category: catName });
    }
  };

  const confirmVariantAdd = () => {
    if (!isShopOpen || !selectedItem || !selectedVariant) return;

    addItem({
      ...selectedItem,
      id: `${selectedItem.id}-${selectedVariant.name}`,
      name: `${selectedItem.name} (${selectedVariant.name})`,
      price: selectedVariant.price,
      shopId: id,
      category: selectedItem.category,
    });

    setSelectedItem(null);
    setSelectedVariant(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Header */}
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
          <Image
            src={menu.logo}
            alt={menu.name}
            width={80}
            height={80}
            className={`rounded-2xl border object-cover ${!isShopOpen ? "grayscale opacity-60" : ""}`}
          />
          <div>
            <h1 className={`text-2xl font-black uppercase ${!isShopOpen ? "text-gray-400" : ""}`}>
              {menu.name}
            </h1>
            <ShopStatusBadge shop={shop} />
          </div>
        </div>
      </div>

      {/* Closed banner */}
      {!isShopOpen && (
        <div className="bg-gray-800 text-white text-center py-2.5 px-4">
          <p className="text-xs font-black uppercase tracking-widest">
            Currently Closed &middot; Opens 8:00 AM – 9:00 PM
          </p>
        </div>
      )}

      <CategoryNav categories={menu.categories} />

      {/* Menu */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {menu.categories.map((cat: Category) => (
          <section key={cat.name} id={cat.name} className="mb-12">
            <h2 className={`text-xl font-black mb-6 uppercase tracking-tighter ${!isShopOpen ? "text-gray-400" : ""}`}>
              {cat.name}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {cat.items.map((item: MenuItem) => {
                const isVariant = item.variants && item.variants.length > 0;
                const displayPrice = isVariant
                  ? `From Rs. ${Math.min(...(item.variants?.map((v) => v.price) || [item.price]))}`
                  : `Rs. ${item.price}`;

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={isShopOpen ? 0 : -1}
                    aria-disabled={!isShopOpen}
                    onClick={() => handleItemClick(item, cat.name)}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && isShopOpen) {
                        handleItemClick(item, cat.name);
                      }
                    }}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 flex flex-col ${
                      isShopOpen
                        ? "hover:shadow-lg cursor-pointer active:scale-[0.98]"
                        : "cursor-not-allowed"
                    }`}
                  >
                    {/* Image block — this is the ONLY element with overflow-hidden.
                        The + button lives outside it so it never gets clipped. */}
                    <div className="relative">
                      <div className="relative w-full aspect-square rounded-t-2xl overflow-hidden bg-gray-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className={`object-cover ${!isShopOpen ? "grayscale opacity-60" : ""}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest">
                            No Image
                          </div>
                        )}

                        {!isShopOpen && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="bg-white/90 text-gray-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                              Closed
                            </span>
                          </div>
                        )}
                      </div>

                      {/* + button — positioned relative to the wrapper above,
                          not the overflow-hidden image div, so it renders fully. */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isShopOpen) handleItemClick(item, cat.name);
                        }}
                        disabled={!isShopOpen}
                        aria-label={isShopOpen ? `Add ${item.name} to cart` : `${item.name} unavailable, shop closed`}
                        className={`absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full text-white font-black text-lg flex items-center justify-center shadow-lg border-4 border-white transition-all ${
                          isShopOpen
                            ? "bg-purple-600 hover:bg-purple-700 active:scale-90"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        +
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-3 pt-5 flex flex-col flex-grow text-left">
                      <h3 className={`font-bold text-sm leading-snug line-clamp-2 ${!isShopOpen ? "text-gray-400" : ""}`}>
                        {item.name}
                      </h3>
                      {item.desc && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
                      )}
                      <p className={`font-black text-sm mt-auto pt-3 ${isShopOpen ? "text-purple-600" : "text-gray-400"}`}>
                        {isShopOpen ? displayPrice : "Closed"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Variant Selection Modal */}
      {selectedItem && isShopOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 shadow-2xl">
            {selectedItem.image && (
              <div className="relative w-full h-48 bg-gray-100">
                <Image src={selectedItem.image} alt={selectedItem.name} fill className="object-cover" />
              </div>
            )}

            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-black">{selectedItem.name}</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {selectedItem.desc && <p className="text-gray-500 mb-6 text-sm">{selectedItem.desc}</p>}

              <h3 className="font-bold text-lg mb-3">Select Size / Option</h3>
              <div className="space-y-3 mb-2">
                {selectedItem.variants?.map((variant) => (
                  <label
                    key={variant.name}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedVariant?.name === variant.name
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-100 hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="variant"
                        value={variant.name}
                        checked={selectedVariant?.name === variant.name}
                        onChange={() => setSelectedVariant(variant)}
                        className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-600 focus:ring-2"
                      />
                      <span className="font-bold text-gray-800">{variant.name}</span>
                    </div>
                    <span className="font-black text-purple-600">Rs. {variant.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
              <button
                onClick={confirmVariantAdd}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-black text-lg hover:bg-purple-700 active:scale-95 transition-all flex justify-between px-6"
              >
                <span>Add to Cart</span>
                <span>Rs. {selectedVariant?.price}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Drawer Button */}
      {items.length > 0 && (
        <div className="fixed bottom-6 left-0 w-full px-6 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-purple-600 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center active:scale-95 transition-transform"
          >
            <div className="bg-white/20 px-3 py-1 rounded-lg font-black text-sm">
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