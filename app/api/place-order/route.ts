// app/api/place-order/route.ts
import { NextResponse } from "next/server";
import { buildOrderEmailHtml, OrderEmailData } from "@/lib/email/orderEmailTemplate";
import { appendOrderToSheet } from "@/lib/sheets/appendOrderToSheet";

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

function buildRiderWhatsAppLink(payload: OrderEmailData): string {
  const isMultiRestaurant = payload.restaurantNames.includes(",");
  const itemsSection = stripPricesForRider(payload.orderItems);

  const message =
    `🛵 New Delivery Ready\n\n` +
    (isMultiRestaurant
      ? `📍 Pickup from ${payload.restaurantNames} (visit in this order)\n\n`
      : `📍 Pickup from ${payload.restaurantNames}\n\n`) +
    `Items:\n${itemsSection}\n\n` +
    `Customer: ${payload.userName}\n` +
    `Phone: ${payload.userPhone}\n` +
    `Address: ${payload.address}\n\n` +
    (payload.locationLink && payload.locationLink !== "Not available"
      ? `Location: ${payload.locationLink}\n\n`
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
async function notifyNtfy(userName: string, total: number, restaurantNames: string): Promise<void> {
  try {
    await fetch("https://ntfy.sh/meal_bear_skardu", {
      method: "POST",
      body: `New order from ${userName} (Rs. ${total}) — ${restaurantNames}`,
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
}

function buildSheetPayload(payload: OrderEmailData) {
  const extra = payload as unknown as ExtraOrderFields;
  return {
    orderType: "online" as const,
    orderDate: extra.orderDate || "",
    orderTime: extra.orderTime || "",
    userName: payload.userName,
    userPhone: payload.userPhone,
    address: payload.address,
    restaurantNames: payload.restaurantNames,
    orderItems: payload.orderItems,
    subtotal: extra.subtotal,
    estimatedDistanceKm: extra.estimatedDistanceKm,
    totalRoundTripKm: extra.totalRoundTripKm,
    estimatedDeliveryTime: extra.estimatedDeliveryTime,
    deliveryFee: extra.deliveryFee,
    estimatedFuelCost: extra.estimatedFuelCost,
    riderCommission: extra.riderCommission,
    platformShare: extra.platformShare,
    totalRiderPayment: extra.totalRiderPayment,
    total: payload.total,
    paymentMethod: "COD",
    orderStatus: "New",
    locationLink: payload.locationLink,
  };
}

export async function POST(req: Request) {
  let payload: OrderEmailData;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const riderWhatsAppLink = buildRiderWhatsAppLink(payload);
  const html = buildOrderEmailHtml({ ...payload, riderWhatsAppLink });

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
        subject: `New Order — Rs. ${payload.total} — ${payload.restaurantNames}`,
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
  const sheetResult = await appendOrderToSheet(buildSheetPayload(payload));
  if (!sheetResult.success) {
    console.error("appendOrderToSheet failed:", sheetResult.error);
  }

  // Rider heads-up also always runs — it doesn't depend on email or the
  // sheet succeeding, since it's built entirely from the payload already
  // in hand.
  await notifyNtfy(payload.userName, payload.total, payload.restaurantNames);

  return NextResponse.json({
    ok: true,
    orderId: sheetResult.success ? sheetResult.orderId : null,
    emailFailed,
    sheetFailed: !sheetResult.success,
  });
}