import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility to merge Tailwind classes efficiently.
 * It prevents class conflicts (e.g., if you accidentally use 'p-4' and 'p-6').
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number to Pakistani Rupee (PKR) currency.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Checks if the current time falls within a specific range.
 * Useful for displaying "Open" or "Closed" tags.
 */
export function isWithinRange(open: string, close: string): boolean {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  
  const [oH, oM] = open.split(':').map(Number);
  const [cH, cM] = close.split(':').map(Number);
  
  const openTime = oH * 60 + oM;
  const closeTime = cH * 60 + cM;

  return current >= openTime && current <= closeTime;
}