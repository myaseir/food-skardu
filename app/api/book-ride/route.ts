// app/api/book-ride/route.ts
import { NextResponse } from "next/server";
import { buildRideBookingEmailHtml, RideBookingEmailData } from "@/lib/email/rideBookingEmailTemplate";

// Same rider dispatch number used for food orders.
const RIDER_WHATSAPP_NUMBER = "03169030178";

function normalizePakPhoneForWhatsApp(raw: string): string {
  let digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return "92" + digits.slice(1);
  if (digits.startsWith("3") && digits.length === 10) return "92" + digits;
  return digits;
}

// Shape actually sent by RideParcelForm's templateParams (snake_case,
// left over from the old EmailJS template variable names).
type RideBookingPayload = {
  mode: "Ride" | "Courier";
  pickup_area: string;
  pickup_address: string;
  dropoff_area: string;
  dropoff_address: string;
  distance_km: string;
  price: string;
  rider_name: string;
  rider_phone: string;
  sender_name: string;
  sender_phone: string;
  receiver_name: string;
  receiver_phone: string;
  customer_lat: string;
  customer_lng: string;
  location_link: string;
  time: string;
};

// Maps the client's snake_case payload onto the camelCase shape the
// template/WhatsApp-link builders expect, with safe fallbacks so a
// missing field renders as an empty string instead of crashing esc().
function toEmailData(payload: RideBookingPayload): Omit<RideBookingEmailData, "riderWhatsAppLink" | "customerWhatsAppLink"> {
  return {
    mode: payload.mode,
    pickupArea: payload.pickup_area ?? "",
    pickupAddress: payload.pickup_address ?? "Not provided",
    dropoffArea: payload.dropoff_area ?? "",
    dropoffAddress: payload.dropoff_address ?? "Not provided",
    distanceKm: payload.distance_km ?? "",
    price: payload.price ?? "On request",
    riderName: payload.rider_name ?? "",
    riderPhone: payload.rider_phone ?? "",
    senderName: payload.sender_name ?? "",
    senderPhone: payload.sender_phone ?? "",
    receiverName: payload.receiver_name ?? "",
    receiverPhone: payload.receiver_phone ?? "",
    customerLat: payload.customer_lat ?? "Not available",
    customerLng: payload.customer_lng ?? "Not available",
    locationLink: payload.location_link ?? "Not available",
    time: payload.time ?? new Date().toLocaleString(),
  };
}

function buildRiderWhatsAppLink(data: Omit<RideBookingEmailData, "riderWhatsAppLink" | "customerWhatsAppLink">): string {
  const isRide = data.mode === "Ride";

  const contactLines = isRide
    ? `👤 Customer: ${data.riderName} — ${data.riderPhone}`
    : `📤 Sender: ${data.senderName} — ${data.senderPhone}\n📥 Receiver: ${data.receiverName} — ${data.receiverPhone}`;

  const message =
    `${isRide ? "🏍️" : "📦"} New ${data.mode} Booking\n\n` +
    `📍 Pickup: ${data.pickupArea}${data.pickupAddress !== "Not provided" ? ` (${data.pickupAddress})` : ""}\n` +
    `Drop-off: ${data.dropoffArea}${data.dropoffAddress !== "Not provided" ? ` (${data.dropoffAddress})` : ""}\n` +
    (data.distanceKm ? `📏 Distance: ${data.distanceKm} km\n` : "") +
    `\n${contactLines}\n\n` +
    (data.locationLink && data.locationLink !== "Not available"
      ? `Location: ${data.locationLink}\n\n`
      : "") +
    `Price: ${data.price}\n\n` +
    `~ Meal Bear Skardu`;

  const normalized = normalizePakPhoneForWhatsApp(RIDER_WHATSAPP_NUMBER);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

// Confirmation goes to whoever placed the booking: the rider themself in
// Ride mode, or the sender in Courier mode (the receiver never filled out
// the form, so they wouldn't be expecting a confirmation message).
function buildCustomerWhatsAppLink(data: Omit<RideBookingEmailData, "riderWhatsAppLink" | "customerWhatsAppLink">): string {
  const isRide = data.mode === "Ride";
  const customerName = isRide ? data.riderName : data.senderName;
  const customerPhone = isRide ? data.riderPhone : data.senderPhone;

  const message = `Hi ${customerName}, this is Meal Bear Skardu. Your ${isRide ? "ride" : "courier"} booking (${data.pickupArea} → ${data.dropoffArea}) is confirmed at ${data.price}. Reply YES to confirm.`;

  const normalized = normalizePakPhoneForWhatsApp(customerPhone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export async function POST(req: Request) {
  let rawPayload: RideBookingPayload;
  try {
    rawPayload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const emailData = toEmailData(rawPayload);
  const riderWhatsAppLink = buildRiderWhatsAppLink(emailData);
  const customerWhatsAppLink = buildCustomerWhatsAppLink(emailData);
  const html = buildRideBookingEmailHtml({ ...emailData, riderWhatsAppLink, customerWhatsAppLink });

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
        subject: `New ${emailData.mode} Booking — ${emailData.pickupArea} → ${emailData.dropoffArea}`,
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
    body: `New ${emailData.mode} booking — ${emailData.pickupArea} → ${emailData.dropoffArea} (${emailData.price})`,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}