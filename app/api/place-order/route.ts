// app/api/place-order/route.ts
import { NextResponse } from "next/server";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { buildOrderEmailHtml, OrderEmailData } from "@/lib/email/orderEmailTemplate";
import { appendOrderToSheet } from "@/lib/sheets/appendOrderToSheet";
import { computeVoucherDiscount } from "@/utils/voucher";
import { checkVoucher } from "@/utils/voucherCheck";

// Rider dispatch coordinator — the pre-filled WhatsApp button opens a chat
// with this number; whoever holds it forwards to the riders group.
// Move to an env var later if this number changes often or you rotate
// on-duty coordinators.
const RIDER_WHATSAPP_NUMBER = "03408999474";

// Same normalization used on the client (checkout page) — duplicated here
// since this file runs server-side and can't import client-only code.
// Assumes Pakistani mobile numbers (country code 92).
function normalizePakPhoneForWhatsApp(raw: string): string {
  let digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return "92" + digits.slice(1);
  if (digits.startsWith("3") && digits.length === 10) return "92" + digits;
  return digits;
}

// payload.orderItems already comes grouped by restaurant, e.g.:
//   "Shop A:\n  2x Burger (Rs. 500)\n  1x Fries (Rs. 200)\n\nShop B:\n  1x Pizza (Rs. 900)"
// The rider doesn't need individual prices — just what to pick up, from
// where — so this strips the "(Rs. X)" portion off each line and leaves
// the restaurant grouping intact.
function stripPricesForRider(orderItems: string): string {
  return orderItems.replace(/\s*\(Rs\.\s*[\d,]+\)/g, "");
}

// orderItems also carries [[DESC]](...)[[/DESC]] and [[NOTE]]...[[/NOTE]]
// markers meant for the HTML email template (orderEmailTemplate.ts turns
// those into styled spans). WhatsApp is plain text and has no idea what
// those brackets mean, so before the rider message is built, the markers
// are converted to their plain-text equivalents: the description (already
// wrapped in round braces by checkout) just loses its tags, and the note
// gets a 📝 prefix in place of its tags.
function convertMarkersForPlainText(orderItems: string): string {
  return orderItems
    .replace(/\[\[DESC\]\]([\s\S]*?)\[\[\/DESC\]\]/g, "$1")
    .replace(/\[\[NOTE\]\]([\s\S]*?)\[\[\/NOTE\]\]/g, "📝 $1");
}

function buildRiderWhatsAppLink(payload: OrderEmailData): string {
  const isMultiRestaurant = payload.restaurantNames.includes(",");
  const itemsSection = stripPricesForRider(convertMarkersForPlainText(payload.orderItems));
  // Surface the customer's note to the rider too — "leave at the gate" /
  // "call before arriving" type notes are often about delivery handling,
  // not just kitchen prep, so it's worth a line here as well. Only shown
  // when there's an actual note (checkout sends "N/A" when left blank).
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
    // `payload.total` is the server-recomputed amount AFTER the voucher,
    // so the rider collects the right cash.
    (hasVoucher
      ? `🎟️ Voucher ${extra.voucherCode}: -Rs. ${extra.totalDiscount} (already deducted)\n`
      : "") +
    `Total to Collect (COD): Rs. ${payload.total}\n\n` +
    `~ Meal Bear Skardu`;

  const normalized = normalizePakPhoneForWhatsApp(RIDER_WHATSAPP_NUMBER);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

// Pushes the "new order" heads-up ping to ntfy.sh. Awaited by the caller
// (not fire-and-forget) — on serverless runtimes, an un-awaited fetch can
// get silently dropped the moment the function's response is sent and the
// execution environment is frozen/torn down, which is what was causing
// notifications to go missing intermittently. This never throws: a failed
// ntfy push is logged but must not fail the order.
async function notifyNtfy(
  userName: string,
  total: number,
  restaurantNames: string,
  voucherCode: string
): Promise<void> {
  try {
    await fetch("https://ntfy.sh/meal_bear_skardu", {
      method: "POST",
      body:
        `New order from ${userName} (Rs. ${total}) — ${restaurantNames}` +
        (voucherCode !== "None" ? ` [${voucherCode}]` : ""),
    });
  } catch (err) {
    console.error("ntfy notify failed:", err);
  }
}

// The checkout page (app/checkout/page.tsx) already computes and sends
// every economics field in its `orderPayload` object — subtotal, distance,
// fuel cost, rider commission, platform share, order date/time, etc.
// These aren't part of OrderEmailData's declared shape (that type only
// covers what the email template needs), so rather than extending
// OrderEmailData — which breaks because OrderEmailData declares some of
// these as required `number` and this route treats them as optional/
// possibly-"N/A" — this is a standalone type for the extra fields, applied
// via a separate cast. Same object at runtime, two different declared
// views of it for two different purposes.
//
// "N/A" is what checkout sends when manualEstimate is null (route not yet
// measured) — passed through as-is; Code.gs just writes whatever string it
// receives into the numeric-looking columns, so "N/A" will show as literal
// text in the sheet rather than a blank cell. That's intentional: it makes
// unmeasured routes visible/searchable in the sheet rather than looking
// like a missing-data bug.
//
// `customerNote` follows the same pattern: checkout always sends a string
// ("N/A" when the box was left empty), so it's passed through as-is here
// too rather than being coerced to undefined/blank.
//
// Voucher fields: `voucherCode` is "None" when no voucher was used. The
// discount numbers are OVERWRITTEN by this route with server-computed
// values — whatever the browser sent is never trusted.
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
    // Sheet cells are plain text too — same marker conversion as the rider
    // message, so the sheet shows readable "(desc)" / "📝 note" text
    // instead of literal [[DESC]]/[[NOTE]] brackets.
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
    // Voucher tracking — lets you filter discounted customers in the sheet
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

const reject = (error: string, status: number, voucherInvalid = false) =>
  NextResponse.json({ ok: false, error, voucherInvalid }, { status });

export async function POST(req: Request) {
  let payload: OrderEmailData;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const extra = payload as unknown as ExtraOrderFields;

  // ---------------------------------------------------------------------
  // Voucher: re-validate and recompute on the server.
  // Nothing the browser says about discounts is trusted. We only read the
  // voucher CODE, then look up the rules ourselves and calculate.
  // ---------------------------------------------------------------------
  const subtotal = Number(extra.subtotal);
  const deliveryFee = Number(extra.deliveryFee ?? 0);
  if (!Number.isFinite(subtotal) || subtotal < 0 || !Number.isFinite(deliveryFee) || deliveryFee < 0) {
    return reject("Invalid order amounts.", 400);
  }

  const requestedCode =
    typeof extra.voucherCode === "string" && extra.voucherCode !== "None"
      ? extra.voucherCode.trim().toUpperCase()
      : "";

  // Rebuild the E.164 phone on the server from what the customer typed and
  // their selected country, instead of trusting `userPhoneNormalized`.
  const parsedPhone = parsePhoneNumberFromString(
    String(payload.userPhone ?? ""),
    (extra.userPhoneCountry || "PK") as CountryCode
  );
  const phoneDigits = parsedPhone?.isValid() ? parsedPhone.number.replace(/\D/g, "") : "";
  if (!phoneDigits) {
    return reject("Invalid WhatsApp number.", 400);
  }

  let voucherCode = "None";
  let foodDiscount = 0;
  let deliveryDiscount = 0;

  if (requestedCode) {
    const check = await checkVoucher(requestedCode, phoneDigits, subtotal);
    if (!check.ok) {
      // 409 + voucherInvalid tells the checkout page to remove the voucher
      // and show the reason (expired, fully redeemed, already used, ...).
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

  // If the total the customer saw differs from what we calculate, someone
  // edited the request (or a price changed mid-checkout). Don't guess.
  if (Number(payload.total) !== serverTotal) {
    console.warn(
      `Total mismatch: client=${payload.total} server=${serverTotal} voucher=${voucherCode}`
    );
    return reject("Your order total changed. Please review it and try again.", 409);
  }

  // Overwrite the discount fields with the server's numbers, and use the
  // server-built phone for per-customer counting.
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

  const riderWhatsAppLink = buildRiderWhatsAppLink(payload);
  const customerNote = (payload as unknown as ExtraOrderFields).customerNote || "N/A";

  // Passed through explicitly (not just via the `...payload` spread) so it
  // reaches the template under a stable, obvious key regardless of how
  // OrderEmailData's own type is declared. buildOrderEmailHtml still needs
  // to actually render `customerNote` in its HTML for it to show up in the
  // email — see note below.
  const html = buildOrderEmailHtml({ ...payload, riderWhatsAppLink, customerNote });

  // Email is best-effort, same as the sheet write below — a transient
  // Brevo failure must never make the order disappear entirely. If it
  // fails, we log it and keep going: the sheet write is the actual record
  // of the order, and the rider still needs to be notified either way.
  let emailFailed = false;
  try {
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: "Meal Bear Skardu", email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: process.env.ORDER_NOTIFY_EMAIL }],
        subject:
          `New Order — Rs. ${payload.total} — ${payload.restaurantNames}` +
          (voucherCode !== "None" ? ` — 🎟️ ${voucherCode}` : ""),
        htmlContent: html,
      }),
    });

    if (!brevoRes.ok) {
      const errBody = await brevoRes.text();
      console.error("Brevo error:", errBody);
      emailFailed = true;
    }
  } catch (err) {
    console.error("Brevo request failed:", err);
    emailFailed = true;
  }

  // Sheets write — still best-effort (a Sheets outage must never fail the
  // customer-facing response either), but it now always runs regardless of
  // whether the email above succeeded. This is the actual order record, so
  // it shouldn't be skippable by a notification-channel hiccup.
  //
  // NOTE: voucher limits ("only 50 users", "once per customer") are counted
  // from this sheet, so a failed write here means that use isn't counted.
  const sheetResult = await appendOrderToSheet(buildSheetPayload(payload));
  if (!sheetResult.success) {
    console.error("appendOrderToSheet failed:", sheetResult.error);
  }

  // Rider heads-up also always runs — it doesn't depend on email or the
  // sheet succeeding, since it's built entirely from the payload already
  // in hand.
  await notifyNtfy(payload.userName, payload.total, payload.restaurantNames, voucherCode);

  return NextResponse.json({
    ok: true,
    orderId: sheetResult.success ? sheetResult.orderId : null,
    emailFailed,
    sheetFailed: !sheetResult.success,
  });
}