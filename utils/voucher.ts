export type Voucher = {
  code: string;                       // "WELCOME20", stored uppercase
  appliesTo: "FOOD" | "DELIVERY";
  kind: "PERCENT" | "FLAT" | "FREE";  // FREE = free delivery
  value: number;                      // 20 (%) or 100 (Rs.), ignored for FREE
  maxDiscount?: number;               // cap for percent vouchers
  minOrder?: number;                  // minimum food subtotal
  startsAt?: string;                  // ISO date
  expiresAt?: string;                 // ISO date, checked on every use
  maxUses?: number;                   // total users allowed
  usedCount: number;
  perCustomerLimit?: number;
  active: boolean;                    // your manual on/off switch
};

// What the checkout page keeps after the server approves a code.
export type AppliedVoucher = Pick<
  Voucher,
  "code" | "appliesTo" | "kind" | "value" | "maxDiscount" | "minOrder"
>;

export function computeVoucherDiscount(
  v: AppliedVoucher,
  subtotal: number,
  deliveryFee: number
): { foodDiscount: number; deliveryDiscount: number } {
  if (v.minOrder && subtotal < v.minOrder) {
    return { foodDiscount: 0, deliveryDiscount: 0 };
  }

  // The base the voucher applies to: food total or delivery fee
  const base = v.appliesTo === "FOOD" ? subtotal : deliveryFee;

  let discount = 0;
  if (v.kind === "FREE") discount = base;
  else if (v.kind === "FLAT") discount = v.value;
  else discount = Math.round((base * v.value) / 100);

  if (v.maxDiscount) discount = Math.min(discount, v.maxDiscount);
  discount = Math.max(0, Math.min(discount, base)); // never more than the base

  return v.appliesTo === "FOOD"
    ? { foodDiscount: discount, deliveryDiscount: 0 }
    : { foodDiscount: 0, deliveryDiscount: discount };
}