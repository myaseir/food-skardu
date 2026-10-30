// utils/voucherCheck.ts
// Server-side only. One place that decides whether a voucher can be used,
// shared by /api/vouchers/validate and /api/place-order.
import type { Voucher } from "@/utils/voucher";
import {
  getVoucherByCode,
  countRedemptionsByPhone,
  countRedemptionsTotal,
} from "@/utils/voucherStore";

export type VoucherCheckResult =
  | { ok: true; voucher: Voucher }
  | { ok: false; error: string; status: number };

const fail = (error: string, status = 400): VoucherCheckResult => ({ ok: false, error, status });

export async function checkVoucher(
  rawCode: string,
  phoneDigits: string,
  subtotal: number
): Promise<VoucherCheckResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code || code.length > 40) return fail("Please enter a voucher code.");

  let voucher: Voucher | null;
  try {
    voucher = await getVoucherByCode(code);
  } catch (err) {
    console.error("Voucher lookup failed:", err);
    return fail("Couldn't check the voucher. Please try again.", 500);
  }

  // Same message for "doesn't exist" and "switched off" so codes can't be probed
  if (!voucher || !voucher.active) return fail("This voucher code is not valid.", 404);

  const now = Date.now();
  if (voucher.startsAt && now < new Date(voucher.startsAt).getTime()) {
    return fail("This voucher is not active yet.");
  }
  if (voucher.expiresAt && now > new Date(voucher.expiresAt).getTime()) {
    return fail("This voucher has expired.");
  }

  if (voucher.minOrder && subtotal < voucher.minOrder) {
    return fail(`This voucher needs a minimum food order of Rs. ${voucher.minOrder}.`);
  }

  try {
    if (voucher.maxUses != null) {
      const used = await countRedemptionsTotal(code);
      if (used >= voucher.maxUses) return fail("This voucher has been fully redeemed.");
    }
    if (voucher.perCustomerLimit != null) {
      const used = await countRedemptionsByPhone(code, phoneDigits);
      if (used >= voucher.perCustomerLimit) return fail("You have already used this voucher.");
    }
  } catch (err) {
    console.error("Redemption check failed:", err);
    return fail("Couldn't check the voucher. Please try again.", 500);
  }

  return { ok: true, voucher };
}