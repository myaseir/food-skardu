// lib/sheets/appendOrderToSheet.ts
//
// Talks to the Google Apps Script Web App that stores orders in the Orders
// sheet. appendOrderToSheet never throws: it returns a result, and the
// caller (app/api/place-order/route.ts) decides what a failure means — the
// order is only reported as placed if this write succeeds.

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

export type AppendOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

// Apps Script can be slow on cold starts, but a request that hangs forever
// must not be allowed to eat the whole function time budget. This is below
// the 15s wrapper in route.ts so the inner timeout fires first and cleanly.
const APPEND_TIMEOUT_MS = 12000;
const COUNT_TIMEOUT_MS = 8000;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Node's fetch only says "fetch failed" — the useful part (EAI_AGAIN,
// ECONNRESET, ...) lives in error.cause. Surface it so logs are readable and
// route.ts can recognise connection-level failures (safe to retry).
function describeError(e: any): string {
  if (e?.name === "TimeoutError" || e?.name === "AbortError") {
    return "Sheets request timed out";
  }
  const msg = e?.message || String(e);
  const code = e?.cause?.code || e?.code;
  return code ? `${msg} (${code})` : msg;
}

// Apps Script returns an HTML page (not JSON) on quota errors, deploy
// problems, etc. Parse defensively so the log shows what actually came back.
async function readJson(response: Response): Promise<any> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response from Apps Script: ${text.slice(0, 200)}`);
  }
}

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
      // Code.gs's doPost rejects every request as "Unauthorized" unless
      // body.secret matches SHARED_SECRET.
      body: JSON.stringify({ ...payload, secret }),
      signal: AbortSignal.timeout(APPEND_TIMEOUT_MS),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        success: false,
        error: `Sheet write failed (${response.status}): ${errorText.slice(0, 200)}`,
      };
    }

    // Apps Script returns HTTP 200 even on logical failure, so `data.success`
    // is the real signal — not response.ok.
    const data = await readJson(response);

    if (!data.success) {
      return { success: false, error: data.error || "Unknown error from Apps Script" };
    }

    return { success: true, orderId: data.orderId || "UNKNOWN_ID" };
  } catch (error: any) {
    return { success: false, error: describeError(error) };
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
// Otherwise doPost treats it as "append a row" and adds a junk row.
//
// THROWS on failure on purpose: if we can't tell how many times a voucher
// was used, the caller should refuse the voucher rather than allow
// unlimited use. This is a read-only call, so it is safe to retry on
// network errors, timeouts and 5xx (a DNS blip shouldn't kill a checkout).
export async function countVoucherUses(code: string, phone?: string): Promise<number> {
  const scriptUrl = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;

  if (!scriptUrl || !secret) {
    throw new Error("Sheets webhook not configured");
  }

  const TRIES = 3;
  let lastErr: Error = new Error("Voucher count failed");

  for (let i = 0; i < TRIES; i++) {
    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "countVoucher", secret, code, phone: phone ?? "" }),
        cache: "no-store", // never serve a stale count
        signal: AbortSignal.timeout(COUNT_TIMEOUT_MS),
      });

      if (response.status >= 500) {
        lastErr = new Error(`Voucher count failed (${response.status})`);
      } else if (!response.ok) {
        // 4xx: retrying won't help
        throw new Error(`Voucher count failed (${response.status})`);
      } else {
        const data = await readJson(response);
        if (!data.success || typeof data.count !== "number") {
          // Logical error from Apps Script: retrying won't help
          throw new Error(data.error || "Invalid voucher count response");
        }
        return data.count;
      }
    } catch (e: any) {
      const retryable =
        e?.name === "TimeoutError" || e?.name === "AbortError" || e?.cause?.code || e?.message === "fetch failed";
      lastErr = new Error(describeError(e));
      if (!retryable) throw lastErr;
    }
    if (i < TRIES - 1) await sleep(600 * (i + 1));
  }

  throw lastErr;
}