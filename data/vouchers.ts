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
    maxUses: 50,
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
    maxUses: 50,
    usedCount: 0, // not used here; counted from your orders instead
    perCustomerLimit: 1,
    active: true,
  },
  {
    code: "YASIR24",
    appliesTo: "DELIVERY",
    kind: "PERCENT",
    value: 50,
    maxDiscount: 1000,
    minOrder: 500,
    expiresAt: "2026-10-25T23:59:59+05:00",
    maxUses: 50,
    usedCount: 0, // not used here; counted from your orders instead
    perCustomerLimit: 1,
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