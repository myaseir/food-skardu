import type { Voucher } from "@/utils/voucher";

// Edit this file to add, remove, or switch vouchers on and off.
// Set active: false to disable a code (redeploy to apply).
export const vouchers: Voucher[] = [
  {
    code: "WELCOME20",
    appliesTo: "FOOD",
    kind: "PERCENT",
    value: 20,
    maxDiscount: 300,
    minOrder: 500,
    expiresAt: "2026-10-25T23:59:59+05:00",
    maxUses: 1,
    usedCount: 0, // not used here; counted from your orders instead
    perCustomerLimit: 1,
    active: true,
  },
  {
    code: "FOOD12",
    appliesTo: "FOOD",
    kind: "PERCENT",
    value: 50,
    maxDiscount: 1000,
    minOrder: 500,
    expiresAt: "2026-10-25T23:59:59+05:00",
    maxUses: 15,
    usedCount: 0, // not used here; counted from your orders instead
    perCustomerLimit: 1,
    active: true,
  },
 {
  code: "MEAL26",
  appliesTo: "DELIVERY",
  kind: "PERCENT",
  value: 50, // 50% off delivery charges
  maxDiscount: 200, // Maximum discount of Rs. 200
  minOrder: 500, // Minimum order of Rs. 500
  expiresAt: "2026-11-13T23:59:59+05:00",
  maxUses: 20, // First 15 customers only
  usedCount: 0,
  perCustomerLimit: 1, // One use per customer
  active: true,
},
  {
    code: "FREEDEL",
    appliesTo: "DELIVERY",
    kind: "FREE",
    value: 0,
    expiresAt: "2026-10-25T23:59:59+05:00",
    usedCount: 0,
    active: true,
  },
];