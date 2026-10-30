// utils/voucherStore.ts
// Server-side only. Vouchers are defined in data/vouchers.ts; how many times
// each one has been used is counted from the Orders sheet (via Apps Script),
// so no database is needed.
import { vouchers } from "@/data/vouchers";
import type { Voucher } from "@/utils/voucher";
import { countVoucherUses } from "@/lib/sheets/appendOrderToSheet";

export async function getVoucherByCode(code: string): Promise<Voucher | null> {
  return vouchers.find((v) => v.code === code.trim().toUpperCase()) ?? null;
}

// How many times this phone (E.164 digits) has used this code.
// Throws if the sheet can't be read, so the voucher is refused rather than
// allowed without a limit check.
export async function countRedemptionsByPhone(code: string, phone: string): Promise<number> {
  return countVoucherUses(code, phone);
}

// How many times this code has been used in total.
export async function countRedemptionsTotal(code: string): Promise<number> {
  return countVoucherUses(code);
}