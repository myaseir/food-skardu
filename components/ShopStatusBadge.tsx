"use client";

import { useAvailability } from "@/hooks/useAvailability";
import { Shop } from "@/data/config"; // Ensure this import matches your file structure

interface Props {
  shop: Shop;
}

export default function ShopStatusBadge({ shop }: Props) {
  const { checkShopStatus } = useAvailability();
  const isOpen = checkShopStatus(shop);

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
      isOpen 
        ? "bg-green-50 border-green-200 text-green-700" 
        : "bg-gray-50 border-gray-200 text-gray-500"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-green-500" : "bg-gray-400"}`} />
      {isOpen ? "Open Now" : "Currently Closed"}
    </div>
  );
}