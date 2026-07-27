"use client";
import { useState } from "react";
import { useCart } from "@/store/useCart";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category: string;
  shopId: string;
  image?: string;
}

interface Props extends ProductCardProps {
  onSelect: (product: ProductCardProps) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  discountPrice,
  category,
  shopId,
  image,
  onSelect,
}: Props) {
  const { items, addItem, removeSingleItem } = useCart() as any;
  const [imgError, setImgError] = useState(false);
  const hasImage = image && !imgError;

  // If a valid discount price is set and it's actually lower than the
  // original price, treat the product as discounted. Otherwise fall back
  // to the original price with no extra UI — no discount data required.
  const hasDiscount =
    typeof discountPrice === "number" && discountPrice > 0 && discountPrice < price;
  const finalPrice = hasDiscount ? discountPrice : price;

  // If this item is already in the cart, swap the quick-add "+" for a
  // qty stepper right on the card — lets people bump quantity without
  // reopening the modal, same convenience as a normal grocery app.
  const cartItem = items.find((i: any) => i.id === id);
  const quantityInCart = cartItem?.quantity || 0;

  const cartPayload = {
    id,
    name,
    price: finalPrice,
    image,
    category,
    shopId: shopId || "mart-1",
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(cartPayload);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(cartPayload);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeSingleItem(id);
  };

  const openDetails = () => onSelect({ id, name, price, discountPrice, category, shopId, image });

  return (
    <div
      onClick={openDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openDetails();
      }}
      className="group p-4 sm:p-5 bg-white border border-gray-100 rounded-3xl hover:border-purple-200 hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-[0.98]"
    >
      <div className="relative mb-5 sm:mb-6">
        <div className="relative h-32 sm:h-48 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
          {hasDiscount && (
            <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">
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

        {/* Quick-add "+" (no item in cart yet) — one-tap add without opening
            the modal, same pattern as the restaurant menu cards. Lives
            OUTSIDE the overflow-hidden image wrapper above so it isn't
            clipped by the rounded corners. */}
        {quantityInCart === 0 ? (
          <button
            onClick={handleQuickAdd}
            aria-label={`Add ${name} to cart`}
            className="absolute -bottom-4 right-3 z-10 w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center shadow-lg border-4 border-white hover:bg-purple-700 active:scale-90 transition-all"
          >
            +
          </button>
        ) : (
          /* Already in cart — floating qty stepper replaces the "+" so the
             card itself shows live cart state at a glance. */
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute -bottom-4 right-3 z-10 flex items-center gap-1 bg-white rounded-full shadow-lg border-4 border-white overflow-hidden"
          >
            <button
              onClick={handleDecrement}
              aria-label={`Remove one ${name}`}
              className="w-7 h-7 flex items-center justify-center bg-purple-50 text-purple-600 hover:bg-purple-100 active:scale-90 transition-all"
            >
              <Minus size={12} />
            </button>
            <span className="min-w-[1.25rem] text-center font-black text-xs text-purple-700">
              {quantityInCart}
            </span>
            <button
              onClick={handleIncrement}
              aria-label={`Add another ${name}`}
              className="w-7 h-7 flex items-center justify-center bg-purple-600 text-white hover:bg-purple-700 active:scale-90 transition-all"
            >
              <Plus size={12} />
            </button>
          </div>
        )}
      </div>

      <h3 className="font-bold text-gray-900 leading-tight text-sm sm:text-base line-clamp-2 min-h-[2.5em]">
        {name}
      </h3>

      <div className="flex items-center gap-2 mt-1">
        <p className="text-purple-600 font-black text-sm sm:text-base">{formatPrice(finalPrice)}</p>
        {hasDiscount && (
          <p className="text-gray-400 text-xs sm:text-sm font-semibold line-through">
            {formatPrice(price)}
          </p>
        )}
      </div>
    </div>
  );
}