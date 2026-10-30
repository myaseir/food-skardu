import { NextRequest, NextResponse } from "next/server";
import type { AppliedVoucher } from "@/utils/voucher";
import {
  getVoucherByCode,
  countRedemptionsByPhone,
  countRedemptionsTotal,
} from "@/utils/voucherStore";

// ---------------------------------------------------------------------
// Basic rate limiting: 5 attempts per minute per IP+phone.
// In-memory, so on serverless hosts (e.g. Vercel) each instance has its
// own counter. It stops casual guessing but is not bulletproof; for
// stronger protection use Upstash Redis or similar.
// ---------------------------------------------------------------------
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  // Clean out expired entries so the map doesn't grow forever
  if (attempts.size > 5000) {
    for (const [k, v] of attempts) if (v.resetAt < now) attempts.delete(k);
  }

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: NextRequest) {
  // ---- 1. Parse and sanity-check the input ----
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request.");
  }

  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";
  const phone = typeof body?.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  const subtotal = Number(body?.subtotal);

  if (!code || code.length > 40) return fail("Please enter a voucher code.");
  if (!phone || phone.length < 8 || phone.length > 15) {
    return fail("Enter a valid WhatsApp number first.");
  }
  if (!Number.isFinite(subtotal) || subtotal < 0) return fail("Invalid order total.");

  // ---- 2. Rate limit ----
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`${ip}:${phone}`)) {
    return fail("Too many attempts. Please wait a minute and try again.", 429);
  }

  // ---- 3. Look up the voucher ----
  let voucher;
  try {
    voucher = await getVoucherByCode(code);
  } catch (err) {
    console.error("Voucher lookup failed:", err);
    return fail("Couldn't check the voucher. Please try again.", 500);
  }

  // Same message for "doesn't exist" and "switched off" so codes can't be probed
  if (!voucher || !voucher.active) return fail("This voucher code is not valid.", 404);

  // ---- 4. Time window (automatic expiry, no cron needed) ----
  const now = Date.now();
  if (voucher.startsAt && now < new Date(voucher.startsAt).getTime()) {
    return fail("This voucher is not active yet.");
  }
  if (voucher.expiresAt && now > new Date(voucher.expiresAt).getTime()) {
    return fail("This voucher has expired.");
  }

  // ---- 5. Total usage limit (counted from recorded orders) ----
  if (voucher.maxUses != null) {
    try {
      const used = await countRedemptionsTotal(code);
      if (used >= voucher.maxUses) {
        return fail("This voucher has been fully redeemed.");
      }
    } catch (err) {
      console.error("Total usage check failed:", err);
      return fail("Couldn't check the voucher. Please try again.", 500);
    }
  }

  // ---- 6. Minimum order ----
  if (voucher.minOrder && subtotal < voucher.minOrder) {
    return fail(`This voucher needs a minimum food order of Rs. ${voucher.minOrder}.`);
  }

  // ---- 7. Per-customer limit (tracked by normalized phone) ----
  if (voucher.perCustomerLimit != null) {
    try {
      const used = await countRedemptionsByPhone(code, phone);
      if (used >= voucher.perCustomerLimit) {
        return fail("You have already used this voucher.");
      }
    } catch (err) {
      console.error("Redemption check failed:", err);
      return fail("Couldn't check the voucher. Please try again.", 500);
    }
  }

  // ---- 8. Success: return only what the checkout page needs ----
  const applied: AppliedVoucher = {
    code: voucher.code,
    appliesTo: voucher.appliesTo,
    kind: voucher.kind,
    value: voucher.value,
    maxDiscount: voucher.maxDiscount,
    minOrder: voucher.minOrder,
  };

  return NextResponse.json({ voucher: applied });
}