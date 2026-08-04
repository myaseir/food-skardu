// app/api/place-order/route.ts
import { NextResponse } from "next/server";
import { buildOrderEmailHtml, OrderEmailData } from "@/lib/email/orderEmailTemplate";

// Rider dispatch coordinator — the pre-filled WhatsApp button opens a chat
// with this number; whoever holds it forwards to the riders group.
// Move to an env var later if this number changes often or you rotate
// on-duty coordinators.
const RIDER_WHATSAPP_NUMBER = "03169030178";

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

export async function POST(req: Request) {
  let payload: OrderEmailData;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const riderWhatsAppLink = buildRiderWhatsAppLink(payload);
  const html = buildOrderEmailHtml({ ...payload, riderWhatsAppLink });

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
      return NextResponse.json({ ok: false, error: "Email send failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("Brevo request failed:", err);
    return NextResponse.json({ ok: false, error: "Email send failed" }, { status: 502 });
  }

  fetch("https://ntfy.sh/meal_bear_skardu", {
    method: "POST",
    body: `New order from ${payload.userName} (Rs. ${payload.total}) — ${payload.restaurantNames}`,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}