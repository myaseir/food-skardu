// lib/sheets/appendOrderToSheet.ts
//
// Fire-and-forget call to the Google Apps Script Web App that appends a
// row to the Orders sheet. Never throws into the caller — a Sheets outage
// must never break order placement or the confirmation email, so every
// failure here is caught and returned as a result, not thrown.

export interface SheetOrderPayload {
  orderType: string;
  orderDate: string;
  orderTime: string;
  userName: string;
  userPhone: string;
  // E.164 digits only (e.g. 923001234567). Voucher per-customer limits are
  // counted from this column, so it must always be written to the sheet.
  userPhoneNormalized?: string;
  address: string;
  restaurantNames: string;
  orderItems: string;
  customerNote?: string;

  subtotal?: number;
  deliveryFee?: number;

  estimatedDistanceKm?: number | string;
  totalRoundTripKm?: number | string;
  estimatedDeliveryTime?: string;
  estimatedFuelCost?: number | string;
  riderCommission?: number | string;
  platformShare?: number | string;
  totalRiderPayment?: number | string;

  // Voucher tracking. `voucherCode` is "None" when no voucher was used.
  // `originalTotal` is food + delivery BEFORE the voucher; `total` below is
  // what the customer actually pays.
  voucherCode?: string;
  originalTotal?: number;
  foodDiscount?: number;
  deliveryDiscount?: number;
  totalDiscount?: number;

  total: number;
  paymentMethod: string;
  orderStatus: string;
  locationLink?: string;
}

// Discriminated union — after checking `.success`, TypeScript narrows the
// rest of the shape automatically, so `.orderId` is only accessible on the
// true branch and `.error` only on the false branch. Matches how route.ts
// already reads this: `sheetResult.success ? sheetResult.orderId : null`.
export type AppendOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function appendOrderToSheet(
  payload: SheetOrderPayload
): Promise<AppendOrderResult> {
  const scriptUrl = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;

  if (!scriptUrl || !secret) {
    return {
      success: false,
      error: "Sheets webhook not configured (missing SHEETS_WEBHOOK_URL or SHEETS_WEBHOOK_SECRET)",
    };
  }

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // THE FIX: Code.gs's doPost rejects every request as "Unauthorized"
      // unless body.secret matches SHARED_SECRET. That field was missing
      // here entirely, so every write was silently failing auth.
      body: JSON.stringify({ ...payload, secret }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Sheet write failed (${response.status}): ${errorText}` };
    }

    // Apps Script Web Apps return HTTP 200 even on logical failure (they
    // can't set a custom status code), so `data.success` is the real
    // signal — not response.ok, which will be true even for "Unauthorized".
    const data = await response.json();

    if (!data.success) {
      return { success: false, error: data.error || "Unknown error from Apps Script" };
    }

    return { success: true, orderId: data.orderId || "UNKNOWN_ID" };
  } catch (error: any) {
    return { success: false, error: error?.message || String(error) };
  }
}

// ---------------------------------------------------------------------
// Voucher usage counting
// ---------------------------------------------------------------------
// Counts how many recorded orders used a voucher code, optionally only for
// one customer (E.164 digits). Used by utils/voucherStore.ts to enforce
// "only N users" and "once per customer" without any database.
//
// !! Code.gs MUST handle `action: "countVoucher"` BEFORE this is called.
// Right now doPost treats every POST as "append a row", so calling this
// before Code.gs is updated would add a junk row to your Orders sheet.
//
// Unlike appendOrderToSheet, this THROWS on failure on purpose: if we
// can't tell how many times a voucher was used, the caller should refuse
// the voucher rather than silently allow unlimited use.
export async function countVoucherUses(code: string, phone?: string): Promise<number> {
  const scriptUrl = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;

  if (!scriptUrl || !secret) {
    throw new Error("Sheets webhook not configured");
  }

  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "countVoucher", secret, code, phone: phone ?? "" }),
    cache: "no-store", // never serve a stale count
  });

  if (!response.ok) {
    throw new Error(`Voucher count failed (${response.status})`);
  }

  const data = await response.json();
  if (!data.success || typeof data.count !== "number") {
    throw new Error(data.error || "Invalid voucher count response");
  }

  return data.count;
}