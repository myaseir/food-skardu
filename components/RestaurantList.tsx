import { shops } from "@/data/config";
import Link from "next/link";
import Image from "next/image";
import ShopStatusBadge from "./ShopStatusBadge";

export default function RestaurantList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {shops.map((shop) => (
        <Link 
          key={shop.id} 
          href={`/restaurant/${shop.id}`}
          className="p-6 border border-gray-100 rounded-3xl hover:border-purple-600 transition-all shadow-sm hover:shadow-lg flex items-center gap-5"
        >
          {/* Logo Section */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image 
              src={shop.logo} 
              alt={shop.name} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-2xl shadow-sm border border-gray-50"
            />
          </div>

          {/* Info Section */}
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-xl font-black uppercase tracking-tighter">
                {shop.name}
              </h3>
            </div>
            <div className="mb-2">
              <ShopStatusBadge shop={shop} />
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {shop.type === 'restaurant' ? 'Food & Beverages' : 'General Store'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}