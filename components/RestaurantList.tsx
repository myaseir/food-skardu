import { shops, Shop } from "@/data/config";
import Link from "next/link";
import Image from "next/image";
import ShopStatusBadge from "./ShopStatusBadge";
import { Star } from "lucide-react";

// ---- Open/close time helper text ----
function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getOpenStatusText(shop: Shop): string | null {
  if (shop.isActive === false) return null; // manually closed, badge covers this
  if (shop.alwaysOpen) return null; // always open, no need for a closing text

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const openMinutes = parseTimeToMinutes(shop.openTime);
  let closeMinutes = parseTimeToMinutes(shop.closeTime);

  // Handle overnight closing times (e.g. opens 12:00, closes 01:00)
  const overnight = closeMinutes <= openMinutes;
  if (overnight) closeMinutes += 24 * 60;

  let adjustedNow = nowMinutes;
  if (overnight && nowMinutes < openMinutes) adjustedNow += 24 * 60;

  const isOpen = adjustedNow >= openMinutes && adjustedNow < closeMinutes;

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  return isOpen
    ? `Closes at ${formatTime(shop.closeTime)}`
    : `Opens at ${formatTime(shop.openTime)}`;
}

export default function RestaurantList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {shops.map((shop) => {
        const statusText = getOpenStatusText(shop);

        return (
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

              <div className="mb-2 flex items-center gap-2 flex-wrap">
                <ShopStatusBadge shop={shop} />

                {/* Manually set rating, Foodpanda-style */}
                <span className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded-full">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  {shop.rating.toFixed(1)}
                  <span className="text-gray-400 font-medium">
                    ({shop.reviews})
                  </span>
                </span>
              </div>

              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                {shop.type === "restaurant" ? "Food & Beverages" : "General Store"}
              </p>

              {statusText && (
                <p className="text-[11px] font-semibold text-gray-500">
                  {statusText}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}