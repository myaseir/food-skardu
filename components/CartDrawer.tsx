"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { Trash2, Plus, Minus } from "lucide-react"; // Added Minus
import { getMenuByShopId } from "@/lib/dataService";

export default function CartDrawer({ isOpen, onClose }: any) {
  const { items, removeItem, addItem, removeSingleItem } = useCart() as any;
  
  // Updated Math: Price * Quantity
  const total = items.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0);

  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSuggestions() {
      if (items.length === 0 || !items[0].shopId) {
        setSuggestions([]);
        return;
      }
      const currentShopId = items[0].shopId;
      try {
        const menu = await getMenuByShopId(currentShopId);
        if (!menu) return;

        let allMenuProps: any[] = [];
        menu.categories.forEach((cat: any) => {
          cat.items.forEach((item: any) => {
            allMenuProps.push({ ...item, shopId: currentShopId, category: cat.name });
          });
        });

        const inCartIds = items.map((i: any) => i.id);
        let availableItems = allMenuProps.filter(i => !inCartIds.includes(i.id));

        const addOnKeywords = ['side', 'beverage', 'drink', 'dessert', 'add-on', 'extras'];
        let logicallySuitable = availableItems.filter(i => 
          addOnKeywords.some(keyword => i.category.toLowerCase().includes(keyword))
        );

        if (logicallySuitable.length < 3) {
          const cheaperItems = availableItems.filter(i => i.price < 400 && !logicallySuitable.find(ls => ls.id === i.id));
          logicallySuitable = [...logicallySuitable, ...cheaperItems];
        }

        setSuggestions(logicallySuitable.slice(0, 4));
      } catch (error) {
        console.error("Failed to load suggestions", error);
      }
    }
    fetchSuggestions();
  }, [items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="h-full w-full max-w-md bg-gray-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm z-10">
          <h2 className="text-xl font-black uppercase tracking-tighter">Your Cart</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">✕</button>
        </div>
        
        {/* SCROLLABLE AREA */}
        <div className="flex-grow overflow-y-auto flex flex-col">
          
          <div className="bg-white px-6 py-2 mb-4 flex-grow overflow-y-auto max-h-[400px]">
            {items.length === 0 ? (
              <p className="py-8 text-center text-gray-500 font-bold uppercase text-sm">Your cart is empty.</p>
            ) : (
              items.map((item: any, index: number) => (
                <div key={`${item.id}-${index}`} className="flex gap-4 py-4 border-b border-gray-100 items-center">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                    <p className="font-black text-purple-600 text-xs">Rs. {item.price * (item.quantity || 1)}</p>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button onClick={() => removeSingleItem(item.id)} className="p-1 hover:bg-gray-200 rounded"><Minus size={14}/></button>
                    <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => addItem(item)} className="p-1 hover:bg-gray-200 rounded"><Plus size={14}/></button>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Slider sticks to the bottom of the list */}
          {suggestions.length > 0 && (
            <div className="bg-white py-6 mt-auto">
              <h3 className="px-6 font-black uppercase text-sm mb-4 text-gray-900">Popular with your order</h3>
              <div className="flex overflow-x-auto gap-4 px-6 pb-4 no-scrollbar">
                {suggestions.map((addon) => (
                  <div key={addon.id} className="shrink-0 w-32 border border-gray-100 rounded-2xl p-2 flex flex-col gap-2 shadow-sm bg-white">
                    <div className="relative w-full h-20 rounded-xl overflow-hidden bg-gray-50">
                      {addon.image && <Image src={addon.image} alt={addon.name} fill className="object-cover" />}
                    </div>
                    <p className="font-bold text-xs truncate text-gray-800">{addon.name}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="font-black text-purple-600 text-xs">Rs. {addon.price}</p>
                      <button onClick={() => addItem(addon)} className="bg-purple-50 text-purple-600 p-1.5 rounded-full hover:bg-purple-600 hover:text-white transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="bg-white p-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Subtotal</span>
              <span className="font-black text-lg text-gray-900">Rs. {total}</span>
            </div>
            <Link href="/checkout" onClick={onClose} className="w-full flex items-center justify-center bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-700">
              Continue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}