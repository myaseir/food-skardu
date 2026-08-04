// lib/email/rideBookingEmailTemplate.ts

export type RideBookingEmailData = {
  mode: "Ride" | "Courier";
  pickupArea: string;
  pickupAddress: string;
  dropoffArea: string;
  dropoffAddress: string;
  distanceKm: string; // already formatted, e.g. "4.2" or ""
  price: string; // "Rs. 350" or "On request"
  riderName: string; // ride mode only
  riderPhone: string; // ride mode only
  senderName: string; // courier mode only
  senderPhone: string; // courier mode only
  receiverName: string; // courier mode only
  receiverPhone: string; // courier mode only
  customerLat: string;
  customerLng: string;
  locationLink: string;
  time: string;
  riderWhatsAppLink: string;
};

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildRideBookingEmailHtml(data: RideBookingEmailData): string {
  const isRide = data.mode === "Ride";

  const contactRows = isRide
    ? `<div class="detail-row" style="display:table; width:100%; padding:6px 0;">
         <div class="detail-label" style="display:table-cell; width:100px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Rider Name</div>
         <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px; color:#111;">${esc(data.riderName)}</div>
       </div>
       <div class="detail-row" style="display:table; width:100%; padding:6px 0;">
         <div class="detail-label" style="display:table-cell; width:100px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Rider Phone</div>
         <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px;">
           <a href="tel:${esc(data.riderPhone)}" style="color:#9333ea; text-decoration:none;">📞 ${esc(data.riderPhone)}</a>
         </div>
       </div>`
    : `<div class="detail-row" style="display:table; width:100%; padding:6px 0;">
         <div class="detail-label" style="display:table-cell; width:100px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Sender Name</div>
         <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px; color:#111;">${esc(data.senderName)}</div>
       </div>
       <div class="detail-row" style="display:table; width:100%; padding:6px 0;">
         <div class="detail-label" style="display:table-cell; width:100px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Sender Phone</div>
         <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px;">
           <a href="tel:${esc(data.senderPhone)}" style="color:#9333ea; text-decoration:none;">📞 ${esc(data.senderPhone)}</a>
         </div>
       </div>
       <div class="detail-row" style="display:table; width:100%; padding:6px 0;">
         <div class="detail-label" style="display:table-cell; width:100px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Receiver Name</div>
         <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px; color:#111;">${esc(data.receiverName)}</div>
       </div>
       <div class="detail-row" style="display:table; width:100%; padding:6px 0;">
         <div class="detail-label" style="display:table-cell; width:100px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Receiver Phone</div>
         <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px;">
           <a href="tel:${esc(data.receiverPhone)}" style="color:#9333ea; text-decoration:none;">📞 ${esc(data.receiverPhone)}</a>
         </div>
       </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New ${data.mode} Booking — Meal Bear Skardu</title>
<style>
  @media only screen and (max-width: 480px) {
    .container { padding: 0 !important; }
    .card { border-radius: 0 !important; }
    .body-padding { padding: 18px 16px !important; }
    .detail-row { display: block !important; width: 100% !important; padding: 8px 0 !important; }
    .detail-label { display: block !important; width: 100% !important; font-size: 10px !important; margin-bottom: 2px !important; }
    .detail-value { display: block !important; width: 100% !important; font-size: 13px !important; }
    .price-amount { font-size: 26px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#f1f2f6;">
  <div class="container" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px 12px;">
    <div class="card" style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">

      <div style="border-top:6px solid #9333ea; padding:20px; text-align:center; border-bottom:1px solid #eee;">
        <h1 style="margin:0; font-size:19px; font-weight:900; color:#111; letter-spacing:-0.5px;">Meal <span style="color:#9333ea;">Bear Skardu</span></h1>
        <div style="margin-top:10px; display:inline-block; background-color:#f3e8ff; color:#9333ea; padding:5px 14px; border-radius:20px; font-weight:700; font-size:11px; letter-spacing:1px; text-transform:uppercase;">
          ${isRide ? "🏍️" : "📦"} New ${data.mode} Booking
        </div>
      </div>

      <div class="body-padding" style="padding:24px 22px;">
        <p style="font-size:13px; margin-top:0; margin-bottom:20px; color:#475569; line-height:1.5;">
          <strong style="color:#111;">Action required:</strong> a new ${isRide ? "ride" : "courier"} request needs a rider assigned. Booked at ${esc(data.time)}.
        </p>

        <!-- Route -->
        <div style="background-color:#f8fafc; padding:16px; border-radius:12px; margin-bottom:18px; border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 12px 0; font-size:11px; text-transform:uppercase; color:#64748b; letter-spacing:1px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">Route</h3>

          <div class="detail-row" style="display:table; width:100%; padding:6px 0;">
            <div class="detail-label" style="display:table-cell; width:100px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Pickup</div>
            <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px; color:#111;">
              ${esc(data.pickupArea)}${data.pickupAddress && data.pickupAddress !== "Not provided" ? `<br/><span style="font-weight:500; color:#64748b;">${esc(data.pickupAddress)}</span>` : ""}
            </div>
          </div>
          <div class="detail-row" style="display:table; width:100%; padding:6px 0;">
            <div class="detail-label" style="display:table-cell; width:100px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Drop-off</div>
            <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px; color:#111;">
              ${esc(data.dropoffArea)}${data.dropoffAddress && data.dropoffAddress !== "Not provided" ? `<br/><span style="font-weight:500; color:#64748b;">${esc(data.dropoffAddress)}</span>` : ""}
            </div>
          </div>
          ${data.distanceKm ? `
          <div class="detail-row" style="display:table; width:100%; padding:6px 0;">
            <div class="detail-label" style="display:table-cell; width:100px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Distance</div>
            <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px; color:#111;">${esc(data.distanceKm)} km</div>
          </div>` : ""}

          ${data.locationLink && data.locationLink !== "Not available" ? `
          <div style="margin-top:10px; text-align:center;">
            <a href="${data.locationLink}" style="display:inline-block; width:100%; box-sizing:border-box; background-color:#9333ea; color:#fff; font-weight:800; font-size:13px; text-decoration:none; padding:11px 16px; border-radius:10px; text-align:center;">📍 Open Location in Google Map</a>
          </div>` : ""}
        </div>

        <!-- Contact -->
        <div style="background-color:#f8fafc; padding:16px; border-radius:12px; margin-bottom:18px; border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 12px 0; font-size:11px; text-transform:uppercase; color:#64748b; letter-spacing:1px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">Contact</h3>
          ${contactRows}
        </div>

        <!-- Price -->
        <div style="background-color:#111827; padding:18px 16px; border-radius:12px; text-align:center; margin-bottom:18px;">
          <p style="margin:0; font-size:11px; color:#9ca3af; text-transform:uppercase; font-weight:800; letter-spacing:1.5px;">Fixed Price</p>
          <p class="price-amount" style="margin:6px 0 0 0; font-size:30px; font-weight:900; color:#ffffff; letter-spacing:-1px;">${esc(data.price)}</p>
        </div>

        <!-- Notify Rider -->
        <a href="${data.riderWhatsAppLink}" style="display:block; background-color:#f97316; color:#ffffff; font-weight:800; font-size:13px; text-decoration:none; padding:13px 16px; border-radius:10px; text-align:center;">
          🛵 Notify Rider on WhatsApp
        </a>
      </div>
    </div>

    <div style="max-width:600px; margin:18px auto 0; text-align:center;">
      <p style="color:#94a3b8; font-size:11px; line-height:1.6; margin:0; padding:0 16px;">
        This is an automated system notification from Meal Bear Skardu.<br/>
        Please assign a rider immediately.
      </p>
    </div>
  </div>
</body>
</html>`;
}