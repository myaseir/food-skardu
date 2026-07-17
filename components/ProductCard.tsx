"use client";
import { useState } from "react";
import { useCart } from "@/store/useCart";
import { formatPrice } from "@/lib/utils";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category: string;
  shopId: string;
  image?: string;
}

export default function ProductCard({ id, name, price, discountPrice, category, shopId, image }: ProductProps) {
  const addItem = useCart((state) => state.addItem);
  const [imgError, setImgError] = useState(false);
  const hasImage = image && !imgError;

  // If a valid discount price is set and it's actually lower than the
  // original price, treat the product as discounted. Otherwise fall back
  // to the original price with no extra UI — no discount data required.
  const hasDiscount =
    typeof discountPrice === "number" && discountPrice > 0 && discountPrice < price;

  const finalPrice = hasDiscount ? discountPrice : price;

  return (
    <div className="group p-5 bg-white border border-gray-100 rounded-3xl hover:border-purple-200 hover:shadow-xl transition-all duration-300">
      <div className="h-48 bg-gray-50 rounded-2xl mb-5 overflow-hidden flex items-center justify-center relative">
        {hasDiscount && (
          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">
            Sale
          </span>
        )}
        {hasImage ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">Preview</span>
        )}
      </div>
      <h3 className="font-bold text-gray-900 leading-tight">{name}</h3>

      <div className="flex items-center gap-2 mt-1 mb-4">
        <p className="text-purple-600 font-black">{formatPrice(finalPrice)}</p>
        {hasDiscount && (
          <p className="text-gray-400 text-sm font-semibold line-through">
            {formatPrice(price)}
          </p>
        )}
      </div>

      <button
        onClick={() => addItem({ id, name, price: finalPrice })}
        className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all"
      >
        Add to Cart
      </button>
    </div>
  );
}