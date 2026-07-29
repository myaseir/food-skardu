"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";

interface InvoiceData {
  date: string;
  name: string;
  phone: string;
  address: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  shops: { name: string; items: { name: string; qty: number; price: number }[] }[];
}

function decodeInvoiceData(encoded: string): InvoiceData | null {
  try {
    const base64 = decodeURIComponent(encoded);
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Builds a wa.me link with a pre-filled, URL-encoded message.
function buildWhatsAppLink(phoneDigitsOnly: string, message: string): string {
  return `https://wa.me/${phoneDigitsOnly}?text=${encodeURIComponent(message)}`;
}

// Manually triggers a file download from a Blob, instead of relying on
// jsPDF's built-in doc.save(). jsPDF's .save() creates a temporary
// <a download> element and clicks it WITHOUT always appending it to the
// DOM first — some Chrome versions only honor the `download` attribute
// when the element is actually attached to the page at click time.
// Otherwise Chrome just navigates to the blob URL like a normal link,
// which opens the PDF in a new tab (showing as a "blob:http://localhost:
// ..." address) instead of saving it to disk. Appending the link to the
// DOM before clicking — and removing it right after — makes the download
// attribute reliably honored.
function triggerPdfDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoke slightly after the click rather than immediately — revoking
  // too early can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---- Theme -----------------------------------------------------------
const PURPLE = [147, 51, 234] as const; // brand purple
const PURPLE_DARK = [88, 28, 135] as const; // deep purple for text on white
const PURPLE_SOFT = [243, 232, 255] as const; // purple-50, light card backgrounds
const PURPLE_LINE = [216, 180, 254] as const; // soft purple divider
const GRAY_TEXT = [100, 116, 139] as const; // slate-500
const GRAY_LINE = [235, 235, 245] as const;
const INK = [17, 24, 39] as const; // near-black
const WHITE = [255, 255, 255] as const;

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 42;
const CONTENT_W = PAGE_W - MARGIN * 2;
const HEADER_H = 96;
const CONTENT_BOTTOM_LIMIT = 780; // where we force a page break

// Draws the purple header banner + "INVOICE" meta block. Called on every
// page so a multi-page invoice stays consistent, not just page 1.
function drawHeader(doc: jsPDF, data: InvoiceData, pageLabel: string) {
  doc.setFillColor(...PURPLE);
  doc.rect(0, 0, PAGE_W, HEADER_H, "F");

  // subtle darker purple accent strip along the very top
  doc.setFillColor(...PURPLE_DARK);
  doc.rect(0, 0, PAGE_W, 4, "F");

  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.text("Meal Bear Skardu", MARGIN, 44);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text("Food Delivery, Skardu", MARGIN, 62);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("INVOICE", PAGE_W - MARGIN, 42, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(new Date(data.date).toLocaleString(), PAGE_W - MARGIN, 58, { align: "right" });
  doc.text(pageLabel, PAGE_W - MARGIN, 71, { align: "right" });
}

// Thin purple rule + centered footer note, drawn near the bottom of every page.
function drawFooter(doc: jsPDF, pageNum: number, pageCount: number) {
  const y = 812;
  doc.setDrawColor(...PURPLE_LINE);
  doc.setLineWidth(1);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...PURPLE_DARK);
  doc.text("Thank you for ordering with Meal Bear Skardu!", MARGIN, y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY_TEXT);
  doc.text(`Page ${pageNum} of ${pageCount}`, PAGE_W - MARGIN, y + 16, { align: "right" });
}

function roundedFill(doc: jsPDF, x: number, y: number, w: number, h: number, color: readonly number[]) {
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(x, y, w, h, 8, 8, "F");
}

// Generates a purple/white themed invoice PDF from the order data and
// triggers a browser download. Returns the filename used, so the caller
// can reference it in the WhatsApp instructions.
function generateInvoicePdf(data: InvoiceData): string {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  drawHeader(doc, data, "Page 1");
  let y = HEADER_H + 34;

  // --- Bill To card -----------------------------------------------------
  const addressLines = doc.splitTextToSize(data.address, CONTENT_W - 24);
  const billCardH = 46 + addressLines.length * 12;
  roundedFill(doc, MARGIN, y, CONTENT_W, billCardH, PURPLE_SOFT);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...PURPLE_DARK);
  doc.text("BILL TO", MARGIN + 16, y + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(...INK);
  doc.text(data.name, MARGIN + 16, y + 34);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GRAY_TEXT);
  doc.text(data.phone, PAGE_W - MARGIN - 16, y + 34, { align: "right" });

  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  doc.text(addressLines, MARGIN + 16, y + 50);

  y += billCardH + 26;

  // --- Items, grouped by restaurant --------------------------------------
  let pageNum = 1;

  const ensureRoom = (needed: number) => {
    if (y + needed > CONTENT_BOTTOM_LIMIT) {
      doc.addPage();
      pageNum += 1;
      drawHeader(doc, data, `Page ${pageNum}`);
      y = HEADER_H + 34;
    }
  };

  // Column header row
  ensureRoom(26);
  doc.setFillColor(...PURPLE);
  doc.roundedRect(MARGIN, y, CONTENT_W, 22, 5, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...WHITE);
  doc.text("ITEM", MARGIN + 12, y + 14.5);
  doc.text("QTY", PAGE_W - MARGIN - 130, y + 14.5, { align: "right" });
  doc.text("PRICE", PAGE_W - MARGIN - 12, y + 14.5, { align: "right" });
  y += 22 + 8;

  data.shops.forEach((shop) => {
    ensureRoom(24);
    doc.setFillColor(...GRAY_LINE);
    doc.rect(MARGIN, y, CONTENT_W, 18, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...PURPLE_DARK);
    doc.text(shop.name.toUpperCase(), MARGIN + 12, y + 12.5);
    y += 18 + 6;

    shop.items.forEach((item, idx) => {
      ensureRoom(20);

      // faint alternating row tint for readability
      if (idx % 2 === 1) {
        doc.setFillColor(250, 248, 255);
        doc.rect(MARGIN, y - 4, CONTENT_W, 18, "F");
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(...INK);
      doc.text(item.name, MARGIN + 12, y + 9);
      doc.text(String(item.qty), PAGE_W - MARGIN - 130, y + 9, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text(`Rs. ${item.price * item.qty}`, PAGE_W - MARGIN - 12, y + 9, { align: "right" });
      y += 18;
    });

    y += 12;
  });

  // --- Totals card --------------------------------------------------------
  const totalsW = 230;
  const totalsX = PAGE_W - MARGIN - totalsW;
  const totalsH = 96;
  ensureRoom(totalsH + 10);
  y += 6;

  roundedFill(doc, totalsX, y, totalsW, totalsH, PURPLE_SOFT);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GRAY_TEXT);
  doc.text("Subtotal", totalsX + 16, y + 22);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.text(`Rs. ${data.subtotal}`, totalsX + totalsW - 16, y + 22, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY_TEXT);
  doc.text("Delivery Fee", totalsX + 16, y + 40);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text(`Rs. ${data.deliveryFee}`, totalsX + totalsW - 16, y + 40, { align: "right" });

  doc.setDrawColor(...PURPLE_LINE);
  doc.setLineWidth(1);
  doc.line(totalsX + 16, y + 52, totalsX + totalsW - 16, y + 52);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(...PURPLE_DARK);
  doc.text("TOTAL", totalsX + 16, y + 78);
  doc.setFontSize(18);
  doc.text(`Rs. ${data.total}`, totalsX + totalsW - 16, y + 80, { align: "right" });

  // --- Footers on every page ----------------------------------------------
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    drawFooter(doc, p, pageCount);
  }

  const filename = `MealBearSkardu-Invoice-${data.name.replace(/\s+/g, "")}-${Date.now()}.pdf`;
  triggerPdfDownload(doc.output("blob"), filename);
  return filename;
}

// All the actual page logic lives here now. This component is the one
// that calls useSearchParams(), so it's the one that needs to sit inside
// a <Suspense> boundary — see InvoicePage below.
function InvoiceContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<InvoiceData | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const encoded = searchParams.get("data");
    if (encoded) setData(decodeInvoiceData(encoded));
  }, [searchParams]);

  if (!data) {
    return <main className="p-10 text-center text-gray-500">Invalid or missing invoice data.</main>;
  }

  // Step 1: generate + download the PDF.
  // Step 2: open WhatsApp with the confirmation message prefilled.
  // The person then manually taps the 📎 attach icon in WhatsApp and
  // picks the just-downloaded PDF from their downloads/files — WhatsApp
  // doesn't allow any website to auto-attach a file to a chat, so this
  // manual step is unavoidable without the paid WhatsApp Business API.
  const handleDownloadAndSend = () => {
    const filename = generateInvoicePdf(data);
    setDownloaded(true);

    const digitsOnly = data.phone.replace(/[^0-9]/g, "");
    const message = `Hi ${data.name}, this is Meal Bear Skardu. Your order total is Rs. ${data.total}. Reply YES to confirm.`;

    // Small delay so the download reliably starts before the tab loses
    // focus to WhatsApp — some browsers can cancel a download if the tab
    // navigates away too quickly.
    setTimeout(() => {
      window.open(buildWhatsAppLink(digitsOnly, message), "_blank");
    }, 400);
  };

  return (
    <main className="max-w-xl mx-auto p-8 print:p-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-xl font-black">Invoice Preview</h1>
        <button
          onClick={() => window.print()}
          className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs"
        >
          Print / Save as PDF (browser)
        </button>
      </div>

      {/* Main action: download the PDF + open WhatsApp with confirmation message */}
      <button
        onClick={handleDownloadAndSend}
        className="w-full mb-6 bg-[#25D366] text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 print:hidden"
      >
        📥 Download PDF &amp; Message Customer on WhatsApp
      </button>

      {downloaded && (
        <div className="mb-6 bg-purple-50 border border-purple-100 rounded-xl p-4 text-xs text-purple-700 font-bold print:hidden">
          PDF downloaded. In the WhatsApp chat that just opened, tap 📎 → Document, then pick the invoice PDF from your downloads to send it.
        </div>
      )}

      <div className="border border-gray-200 rounded-2xl p-6">
        <h2 className="text-lg font-black mb-1">Meal Bear Skardu — Invoice</h2>
        <p className="text-xs text-gray-500 mb-6">{new Date(data.date).toLocaleString()}</p>

        <p className="text-sm font-bold mb-1">{data.name} · {data.phone}</p>
        <p className="text-sm text-gray-600 mb-6">{data.address}</p>

        {data.shops.map((shop, idx) => (
          <div key={idx} className="mb-4">
            <p className="text-xs font-black uppercase text-gray-400 mb-1">{shop.name}</p>
            {shop.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-0.5">
                <span>{item.qty}x {item.name}</span>
                <span>Rs. {item.price * item.qty}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="border-t border-gray-200 mt-4 pt-4 space-y-1">
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>Rs. {data.subtotal}</span></div>
          <div className="flex justify-between text-sm"><span>Delivery Fee</span><span>Rs. {data.deliveryFee}</span></div>
          <div className="flex justify-between font-black text-lg pt-2"><span>Total</span><span>Rs. {data.total}</span></div>
        </div>
      </div>
    </main>
  );
}

// Next.js requires any component that calls useSearchParams() to be
// wrapped in a <Suspense> boundary, or the production build's static
// prerender step throws (this was the "Error occurred prerendering
// page /invoice" build failure). InvoicePage itself no longer touches
// useSearchParams — it just renders InvoiceContent inside Suspense.
export default function InvoicePage() {
  return (
    <Suspense fallback={<main className="p-10 text-center text-gray-500">Loading invoice...</main>}>
      <InvoiceContent />
    </Suspense>
  );
}