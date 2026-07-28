import { Shop } from "@/data/config";

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Returns a human-readable open/close status line for a shop, based on its
 * actual configured openTime/closeTime — e.g. "Closes at 11:00 PM" or
 * "Opens at 6:00 PM". Handles overnight hours (closeTime <= openTime means
 * the shop closes after midnight).
 *
 * Returns null when there's nothing useful to say:
 * - shop.isActive === false (manually closed — badge already covers this)
 * - shop.alwaysOpen (no closing time to show)
 */
export function getOpenStatusText(shop: Shop): string | null {
  if (shop.isActive === false) return null;
  if (shop.alwaysOpen) return null;

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