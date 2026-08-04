// lib/email/orderEmailTemplate.ts

type RestaurantButton = { name: string; link: string };

export type OrderEmailData = {
  restaurantNames: string;
  userName: string;
  userPhone: string;
  address: string;
  orderItems: string; // pre-formatted multiline string, same as your current detailedItems
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerLat: string;
  customerLng: string;
  locationLink: string;
  confirmWhatsAppLink: string;
  invoiceLink: string;
  riderWhatsAppLink: string;
  restaurantButtons: RestaurantButton[]; // one entry per shop, any length
};

// Basic escaping so raw user input (name, address) can't break the HTML layout
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildRestaurantRows(buttons: RestaurantButton[]): string {
  return buttons
    .map(
      (b) => `
        <tr>
          <td style="padding-bottom: 10px;">
            <a href="${b.link}" style="display:block; width:100%; box-sizing:border-box; background-color:#25D366; color:#ffffff; font-weight:800; font-size:13px; text-decoration:none; padding:12px 16px; border-radius:10px; text-align:center;">
              💬 ${esc(b.name)} — Order on WhatsApp
            </a>
          </td>
        </tr>`
    )
    .join("");
}

export function buildOrderEmailHtml(data: OrderEmailData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Order — Meal Bear Skardu</title>
<style>
  @media only screen and (max-width: 480px) {
    .container { padding: 0 !important; }
    .card { border-radius: 0 !important; }
    .body-padding { padding: 18px 16px !important; }
    .detail-row { display: block !important; width: 100% !important; padding: 8px 0 !important; }
    .detail-label { display: block !important; width: 100% !important; font-size: 10px !important; margin-bottom: 2px !important; }
    .detail-value { display: block !important; width: 100% !important; font-size: 13px !important; }
    .total-amount { font-size: 28px !important; }
    .order-for-name { font-size: 16px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#f1f2f6;">
  <div class="container" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px 12px;">
    <div class="card" style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">

      <div style="border-top:6px solid #9333ea; padding:20px; text-align:center; border-bottom:1px solid #eee; position:relative;">
        <a href="${data.invoiceLink}" style="position:absolute; top:12px; right:12px; background-color:#f3e8ff; color:#9333ea; font-size:10px; font-weight:800; text-decoration:none; padding:5px 10px; border-radius:20px;">🧾 Invoice</a>
        <h1 style="margin:0; font-size:19px; font-weight:900; color:#111; letter-spacing:-0.5px;">Meal <span style="color:#9333ea;">Bear Skardu</span></h1>
        <div style="margin-top:10px; display:inline-block; background-color:#f3e8ff; color:#9333ea; padding:5px 14px; border-radius:20px; font-weight:700; font-size:11px; letter-spacing:1px; text-transform:uppercase;">🚨 New Order Received</div>
      </div>

      <div style="background-color:#111827; padding:16px 20px; text-align:center;">
        <p style="margin:0; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#9ca3af;">Pick Up From</p>
        <p class="order-for-name" style="margin:5px 0 0 0; font-size:17px; font-weight:900; color:#fff; letter-spacing:-0.3px; line-height:1.4;">${esc(data.restaurantNames)}</p>
      </div>

      <div class="body-padding" style="padding:24px 22px;">
        <p style="font-size:13px; margin-top:0; margin-bottom:20px; color:#475569; line-height:1.5;">
          <strong style="color:#111;">Action required:</strong> a new order has been placed and needs preparation + delivery.
        </p>

        <div style="background-color:#f8fafc; padding:16px; border-radius:12px; margin-bottom:18px; border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 12px 0; font-size:11px; text-transform:uppercase; color:#64748b; letter-spacing:1px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">Customer &amp; Delivery Details</h3>

          <div class="detail-row" style="display:table; width:100%; padding:6px 0;">
            <div class="detail-label" style="display:table-cell; width:90px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Name</div>
            <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px; color:#111;">${esc(data.userName)}</div>
          </div>
          <div class="detail-row" style="display:table; width:100%; padding:6px 0;">
            <div class="detail-label" style="display:table-cell; width:90px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Phone</div>
            <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px;">
              <a href="tel:${esc(data.userPhone)}" style="color:#9333ea; text-decoration:none;">📞 ${esc(data.userPhone)}</a>
            </div>
          </div>
          <div class="detail-row" style="display:table; width:100%; padding:6px 0;">
            <div class="detail-label" style="display:table-cell; width:90px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">Address</div>
            <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px; color:#111; line-height:1.5;">${esc(data.address)}</div>
          </div>
          <div class="detail-row" style="display:table; width:100%; padding:6px 0;">
            <div class="detail-label" style="display:table-cell; width:90px; font-weight:700; font-size:12px; color:#64748b; vertical-align:top;">GPS Pin</div>
            <div class="detail-value" style="display:table-cell; font-weight:700; font-size:13px; color:#111;">${esc(data.customerLat)}, ${esc(data.customerLng)}</div>
          </div>

          <div style="margin-top:10px; text-align:center;">
            <a href="${data.locationLink}" style="display:inline-block; width:100%; box-sizing:border-box; background-color:#9333ea; color:#fff; font-weight:800; font-size:13px; text-decoration:none; padding:11px 16px; border-radius:10px; text-align:center;">📍 Open Location in Google Maps</a>
          </div>
        </div>

        <div style="background-color:#f8fafc; padding:16px; border-radius:12px; margin-bottom:18px; border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 12px 0; font-size:11px; text-transform:uppercase; color:#64748b; letter-spacing:1px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">Items to Prepare</h3>
          <p style="margin:0; font-size:13px; line-height:1.8; color:#111; font-weight:600; white-space:pre-line;">${esc(data.orderItems)}</p>
        </div>

        <div style="border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; margin-bottom:18px;">
          <div style="padding:14px 16px; background-color:#ffffff;">
            <table style="width:100%; border-collapse:collapse; font-size:13px;">
              <tr><td style="padding:5px 0; color:#64748b; font-weight:600;">Subtotal</td><td style="padding:5px 0; color:#111; font-weight:700; text-align:right;">Rs. ${data.subtotal}</td></tr>
              <tr><td style="padding:5px 0; color:#64748b; font-weight:600;">Delivery Fee</td><td style="padding:5px 0; color:#111; font-weight:700; text-align:right;">Rs. ${data.deliveryFee}</td></tr>
            </table>
          </div>
          <div style="background-color:#111827; padding:18px 16px; text-align:center;">
            <p style="margin:0; font-size:11px; color:#9ca3af; text-transform:uppercase; font-weight:800; letter-spacing:1.5px;">Total to Collect (COD)</p>
            <p class="total-amount" style="margin:6px 0 0 0; font-size:32px; font-weight:900; color:#ffffff; letter-spacing:-1px;">Rs. ${data.total}</p>
          </div>
        </div>

        <a href="${data.confirmWhatsAppLink}" style="display:block; background-color:#9333ea; color:#ffffff; font-weight:800; font-size:13px; text-decoration:none; padding:13px 16px; border-radius:10px; text-align:center; margin-bottom:16px;">✅ Confirm Order with Customer</a>
<a href="${data.riderWhatsAppLink}" style="display:block; background-color:#f97316; color:#ffffff; font-weight:800; font-size:13px; text-decoration:none; padding:13px 16px; border-radius:10px; text-align:center; margin-bottom:16px;">
  🛵 Send to Riders Group
</a>
        <div>
          <p style="margin:0 0 8px 0; font-size:11px; text-transform:uppercase; color:#64748b; letter-spacing:1px; font-weight:700;">Send Order to Restaurant(s)</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; width:100%;">
            ${buildRestaurantRows(data.restaurantButtons)}
          </table>
        </div>
      </div>
    </div>

    <div style="max-width:600px; margin:18px auto 0; text-align:center;">
      <p style="color:#94a3b8; font-size:11px; line-height:1.6; margin:0; padding:0 16px;">
        This is an automated system notification from Meal Bear Skardu.<br/>
        Please begin processing this order immediately.
      </p>
    </div>
  </div>
</body>
</html>`;
}