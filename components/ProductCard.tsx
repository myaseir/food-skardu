"use client";
import { useCart } from "@/store/useCart";
import { formatPrice } from "@/lib/utils";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  category: string;
  shopId: string;
}

export default function ProductCard({ id, name, price, category, shopId }: ProductProps) {
  const addToCart = useCart((state) => state.addToCart);

  return (
    <div className="group p-5 bg-white border border-gray-100 rounded-3xl hover:border-purple-200 hover:shadow-xl transition-all duration-300">
      <div className="h-48 bg-gray-50 rounded-2xl mb-5 flex items-center justify-center">
        <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">Preview</span>
      </div>
      <h3 className="font-bold text-gray-900 leading-tight">{name}</h3>
      <p className="text-purple-600 font-black mt-1 mb-4">{formatPrice(price)}</p>
      
      <button 
        onClick={() => addToCart({ id, name, price })}
        className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all"
      >
        Add to Cart
      </button>
    </div>
  );
}