// app/api/place-order/route.ts
import { NextResponse } from "next/server";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { buildOrderEmailHtml, OrderEmailData } from "@/lib/email/orderEmailTemplate";
import { appendOrderToSheet } from "@/lib/sheets/appendOrderToSheet";
import { computeVoucherDiscount } from "@/utils/voucher";
import { checkVoucher } from "@/utils/voucherCheck";

// Give the function room for retries. The effective limit still depends on
// your hosting plan (Vercel Hobby caps this lower than Pro).
export const maxDuration = 60;

// Rider dispatch coordinator — the pre-filled WhatsApp button opens a chat
// with this number; whoever holds it forwards to the riders group.
// Move to an env var later if this number changes often.
const RIDER_WHATSAPP_NUMBER = "03408999474";

// ---------------------------------------------------------------------------
// Network helpers
// ---------------------------------------------------------------------------

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * fetch with a per-attempt timeout and retries.
 * Retries on: network errors (EAI_AGAIN DNS blips, resets, timeouts),
 * HTTP 5xx and 429. Never retries other 4xx (bad key, bad payload).
 * Returns the final Response (even if it is a non-OK one) so the caller can
 * log the body; throws only if every attempt failed at the network level.
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  { tries = 3, timeoutMs = 8000 }: { tries?: number; timeoutMs?: number } = {}
): Promise<Response> {
  let lastErr: unknown;
  let lastRes: Response | null = null;

  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      if (res.status >= 500 || res.status === 429) {
        lastRes = res;
        lastErr = new Error(`HTTP ${res.status}`);
      } else {
        return res;
      }
    } catch (e) {
      lastErr = e;
    }
    if (i < tries - 1) await sleep(700 * (i + 1));
  }

  if (lastRes) return lastRes;
  throw lastErr;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Connection-level failures happen BEFORE the request reaches the server, so
// it is safe to retry them without risking a duplicate row in the sheet.
const isConnectionError = (msg: string) =>
  /EAI_AGAIN|ENOTFOUND|ECONNREFUSED|ECONNRESET|fetch failed/i.test(msg);

type SheetResult = Awaited<ReturnType<typeof appendOrderToSheet>>;

/**
 * Writes the order to the sheet. Retries ONLY on connection-level failures.
 * A timeout is NOT retried: the write may have actually landed, and retrying
 * would create a duplicate order row.
 */
async function writeSheetWithRetry(data: Parameters<typeof appendOrderToSheet>[0]): Promise<SheetResult> {
  const MAX_TRIES = 3;
  let last: SheetResult = { success: false, error: "Unknown sheet error" } as SheetResult;

  for (let i = 0; i < MAX_TRIES; i++) {
    try {
      const r = await withTimeout(appendOrderToSheet(data), 15000, "appendOrderToSheet");
      if (r.success) return r;
      last = r;
      if (!isConnectionError(String(r.error))) return r;
    } catch (e) {
      // Timeout or unexpected throw: ambiguous, do not retry.
      return { success: false, error: String(e) } as SheetResult;
    }
    if (i < MAX_TRIES - 1) await sleep(700 * (i + 1));
  }
  return last;
}

// ---------------------------------------------------------------------------
// Phone / message helpers
// ---------------------------------------------------------------------------

// Same normalization used on the client (checkout page) — duplicated here
// since this file runs server-side. Assumes Pakistani mobile numbers (92).
function normalizePakPhoneForWhatsApp(raw: string): string {
  let digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return "92" + digits.slice(1);
  if (digits.startsWith("3") && digits.length === 10) return "92" + digits;
  return digits;
}

// The rider doesn't need individual prices — strip "(Rs. X)" from each line.
function stripPricesForRider(orderItems: string): string {
  return orderItems.replace(/\s*\(Rs\.\s*[\d,]+\)/g, "");
}

// orderItems carries [[DESC]]...[[/DESC]] and [[NOTE]]...[[/NOTE]] markers
// meant for the HTML email. WhatsApp / sheet cells are plain text, so convert
// them: DESC just loses its tags, NOTE gets a 📝 prefix.
function convertMarkersForPlainText(orderItems: string): string {
  return orderItems
    .replace(/\[\[DESC\]\]([\s\S]*?)\[\[\/DESC\]\]/g, "$1")
    .replace(/\[\[NOTE\]\]([\s\S]*?)\[\[\/NOTE\]\]/g, "📝 $1");
}

// Extra fields sent by checkout that are not part of OrderEmailData's shape.
// "N/A" is passed through as-is on purpose (makes unmeasured routes visible
// in the sheet). Discount numbers are OVERWRITTEN by this route with
// server-computed values — whatever the browser sent is never trusted.
interface ExtraOrderFields {
  subtotal?: number;
  deliveryFee?: number;
  estimatedDistanceKm?: number | string;
  estimatedDeliveryTime?: string;
  totalRoundTripKm?: number | string;
  estimatedFuelCost?: number | string;
  riderCommission?: number | string;
  platformShare?: number | string;
  totalRiderPayment?: number | string;
  orderDate?: string;
  orderTime?: string;
  customerNote?: string;
  userPhoneCountry?: string;
  voucherCode?: string;
  originalTotal?: number;
  foodDiscount?: number;
  deliveryDiscount?: number;
  totalDiscount?: number;
  userPhoneNormalized?: string;
}

function buildRiderWhatsAppLink(payload: OrderEmailData): string {
  const isMultiRestaurant = payload.restaurantNames.includes(",");
  const itemsSection = stripPricesForRider(convertMarkersForPlainText(payload.orderItems));
  const extra = payload as unknown as ExtraOrderFields;
  const note = extra.customerNote;
  const hasNote = !!note && note !== "N/A";
  const hasVoucher = !!extra.voucherCode && extra.voucherCode !== "None";

  const message =
    `🛵 New Delivery Ready\n\n` +
    (isMultiRestaurant
      ? `📍 Pickup from ${payload.restaurantNames} (visit in this order)\n\n`
      : `📍 Pickup from ${payload.restaurantNames}\n\n`) +
    `Items:\n${itemsSection}\n\n` +
    (hasNote ? `📝 Note: ${note}\n\n` : "") +
    `Customer: ${payload.userName}\n` +
    `Phone: ${payload.userPhone}\n` +
    `Address: ${payload.address}\n\n` +
    (payload.locationLink && payload.locationLink !== "Not available"
      ? `Location: ${payload.locationLink}\n\n`
      : "") +
    // `payload.total` is the server-recomputed amount AFTER the voucher.
    (hasVoucher
      ? `🎟️ Voucher ${extra.voucherCode}: -Rs. ${extra.totalDiscount} (already deducted)\n`
      : "") +
    `Total to Collect (COD): Rs. ${payload.total}\n\n` +
    `~ Meal Bear Skardu`;

  const normalized = normalizePakPhoneForWhatsApp(RIDER_WHATSAPP_NUMBER);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function buildSheetPayload(payload: OrderEmailData) {
  const extra = payload as unknown as ExtraOrderFields;
  return {
    orderType: "online" as const,
    orderDate: extra.orderDate || "",
    orderTime: extra.orderTime || "",
    userName: payload.userName,
    userPhone: payload.userPhone,
    // E.164 digits, used to count per-customer voucher uses. Keep this
    // column in the sheet: the voucher limits are counted from it.
    userPhoneNormalized: extra.userPhoneNormalized || "",
    address: payload.address,
    restaurantNames: payload.restaurantNames,
    orderItems: convertMarkersForPlainText(payload.orderItems),
    customerNote: extra.customerNote || "N/A",
    subtotal: extra.subtotal,
    estimatedDistanceKm: extra.estimatedDistanceKm,
    totalRoundTripKm: extra.totalRoundTripKm,
    estimatedDeliveryTime: extra.estimatedDeliveryTime,
    deliveryFee: extra.deliveryFee,
    estimatedFuelCost: extra.estimatedFuelCost,
    riderCommission: extra.riderCommission,
    platformShare: extra.platformShare,
    totalRiderPayment: extra.totalRiderPayment,
    voucherCode: extra.voucherCode || "None",
    originalTotal: extra.originalTotal,
    foodDiscount: extra.foodDiscount ?? 0,
    deliveryDiscount: extra.deliveryDiscount ?? 0,
    totalDiscount: extra.totalDiscount ?? 0,
    total: payload.total,
    paymentMethod: "COD",
    orderStatus: "New",
    locationLink: payload.locationLink,
  };
}

// ---------------------------------------------------------------------------
// Notification channels (each throws on failure so allSettled can report it)
// ---------------------------------------------------------------------------

async function sendOrderEmail(payload: OrderEmailData, html: string, voucherCode: string): Promise<void> {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL || !process.env.ORDER_NOTIFY_EMAIL) {
    throw new Error("Brevo env vars missing (BREVO_API_KEY / BREVO_SENDER_EMAIL / ORDER_NOTIFY_EMAIL)");
  }

  const res = await fetchWithRetry(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Meal Bear Skardu", email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: process.env.ORDER_NOTIFY_EMAIL }],
        subject:
          `New Order — Rs. ${payload.total} — ${payload.restaurantNames}` +
          (voucherCode !== "None" ? ` — 🎟️ ${voucherCode}` : ""),
        htmlContent: html,
      }),
    },
    { tries: 3, timeoutMs: 8000 }
  );

  if (!res.ok) {
    throw new Error(`Brevo ${res.status}: ${await res.text().catch(() => "")}`);
  }
}

async function sendNtfy(message: string): Promise<void> {
  const res = await fetchWithRetry(
    "https://ntfy.sh/meal_bear_skardu",
    { method: "POST", body: message },
    { tries: 3, timeoutMs: 6000 }
  );
  if (!res.ok) {
    throw new Error(`ntfy ${res.status}: ${await res.text().catch(() => "")}`);
  }
}

const reject = (error: string, status: number, voucherInvalid = false) =>
  NextResponse.json({ ok: false, error, voucherInvalid }, { status });

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  let payload: OrderEmailData;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const extra = payload as unknown as ExtraOrderFields;

  // ---- Validate amounts ----------------------------------------------------
  const subtotal = Number(extra.subtotal);
  const deliveryFee = Number(extra.deliveryFee ?? 0);
  if (!Number.isFinite(subtotal) || subtotal < 0 || !Number.isFinite(deliveryFee) || deliveryFee < 0) {
    return reject("Invalid order amounts.", 400);
  }

  const requestedCode =
    typeof extra.voucherCode === "string" && extra.voucherCode !== "None"
      ? extra.voucherCode.trim().toUpperCase()
      : "";

  // Rebuild the E.164 phone on the server instead of trusting the client.
  const parsedPhone = parsePhoneNumberFromString(
    String(payload.userPhone ?? ""),
    (extra.userPhoneCountry || "PK") as CountryCode
  );
  const phoneDigits = parsedPhone?.isValid() ? parsedPhone.number.replace(/\D/g, "") : "";
  if (!phoneDigits) {
    return reject("Invalid WhatsApp number.", 400);
  }

  // ---- Voucher: re-validate and recompute on the server --------------------
  let voucherCode = "None";
  let foodDiscount = 0;
  let deliveryDiscount = 0;

  if (requestedCode) {
    let check: Awaited<ReturnType<typeof checkVoucher>>;
    try {
      check = await checkVoucher(requestedCode, phoneDigits, subtotal);
    } catch (err) {
      console.error("checkVoucher threw:", err);
      return reject("Couldn't verify your voucher right now. Please try again.", 503);
    }

    if (!check.ok) {
      // 409 + voucherInvalid tells the checkout page to remove the voucher.
      return reject(check.error, check.status === 500 ? 500 : 409, check.status !== 500);
    }
    const v = check.voucher;
    const d = computeVoucherDiscount(
      {
        code: v.code,
        appliesTo: v.appliesTo,
        kind: v.kind,
        value: v.value,
        maxDiscount: v.maxDiscount,
        minOrder: v.minOrder,
      },
      subtotal,
      deliveryFee
    );
    voucherCode = v.code;
    foodDiscount = d.foodDiscount;
    deliveryDiscount = d.deliveryDiscount;
  }

  const originalTotal = subtotal + deliveryFee;
  const totalDiscount = foodDiscount + deliveryDiscount;
  const serverTotal = Math.max(0, originalTotal - totalDiscount);

  if (Number(payload.total) !== serverTotal) {
    console.warn(`Total mismatch: client=${payload.total} server=${serverTotal} voucher=${voucherCode}`);
    return reject("Your order total changed. Please review it and try again.", 409);
  }

  payload = {
    ...payload,
    total: serverTotal,
    voucherCode,
    originalTotal,
    foodDiscount,
    deliveryDiscount,
    totalDiscount,
    userPhoneNormalized: phoneDigits,
  } as unknown as OrderEmailData;

  // ---- STEP 1: save the order (the record of truth) ------------------------
  // This must succeed before anything is reported as success. Voucher limits
  // are counted from the sheet, so an unsaved order must not look placed.
  const sheetResult = await writeSheetWithRetry(buildSheetPayload(payload));

  if (!sheetResult.success) {
    console.error("appendOrderToSheet failed:", sheetResult.error);

    // The order could not be saved, so the customer is told it failed.
    // Still ping the owner with the customer's details so a real person
    // can follow up by phone if the customer gave up.
    try {
      await sendNtfy(
        `⚠️ ORDER NOT SAVED — ${payload.userName} (${payload.userPhone}) — Rs. ${payload.total} — ${payload.restaurantNames}`
      );
    } catch (err) {
      console.error("ntfy (failure alert) failed:", err);
    }

    return reject("We couldn't place your order. Please check your connection and try again.", 502);
  }

  // ---- STEP 2: notify, in parallel -----------------------------------------
  // The order is saved. Email and ntfy now run side by side so one slow or
  // failing channel can't block the other. Neither can fail the order.
  const riderWhatsAppLink = buildRiderWhatsAppLink(payload);
  const customerNote = (payload as unknown as ExtraOrderFields).customerNote || "N/A";
  const html = buildOrderEmailHtml({ ...payload, riderWhatsAppLink, customerNote });

  const [emailR, ntfyR] = await Promise.allSettled([
    sendOrderEmail(payload, html, voucherCode),
    sendNtfy(
      `New order from ${payload.userName} (Rs. ${payload.total}) — ${payload.restaurantNames}` +
        (voucherCode !== "None" ? ` [${voucherCode}]` : "")
    ),
  ]);

  const emailFailed = emailR.status === "rejected";
  const ntfyFailed = ntfyR.status === "rejected";
  if (emailFailed) console.error("Order email failed after retries:", emailR.reason);
  if (ntfyFailed) console.error("ntfy failed after retries:", ntfyR.reason);

  return NextResponse.json({
    ok: true,
    orderId: sheetResult.orderId ?? null,
    emailFailed,
    ntfyFailed,
    sheetFailed: false,
  });
}