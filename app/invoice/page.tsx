"use client";

import { useEffect, useState } from "react";
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

// Generates a clean, simple text-based invoice PDF from the order data
// and triggers a browser download. Returns the filename used, so the
// caller can reference it in the WhatsApp instructions.
function generateInvoicePdf(data: InvoiceData): string {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let y = 60;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(147, 51, 234); // purple
  doc.text("Meal Bear Skardu", marginX, y);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  y += 18;
  doc.text(`Invoice generated: ${new Date(data.date).toLocaleString()}`, marginX, y);

  // Customer details
  y += 30;
  doc.setDrawColor(230, 230, 230);
  doc.line(marginX, y, 545, y);
  y += 22;

  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.text(data.name, marginX, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.phone, marginX, y);
  y += 14;
  const addressLines = doc.splitTextToSize(data.address, 497);
  doc.text(addressLines, marginX, y);
  y += addressLines.length * 12 + 18;

  // Items, grouped by restaurant
  doc.setDrawColor(230, 230, 230);
  doc.line(marginX, y, 545, y);
  y += 24;

  data.shops.forEach((shop) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(shop.name.toUpperCase(), marginX, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);

    shop.items.forEach((item) => {
      const label = `${item.qty}x ${item.name}`;
      const price = `Rs. ${item.price * item.qty}`;
      doc.text(label, marginX, y);
      doc.text(price, 545, y, { align: "right" });
      y += 16;

      // Start a new page if we're running out of room
      if (y > 760) {
        doc.addPage();
        y = 60;
      }
    });

    y += 10;
  });

  // Price breakdown
  // Everything above this point (items list) checks for page overflow
  // per-line, but this block never did — on a long multi-item order, y
  // could already be near the bottom of the page here, and this block
  // needs ~100pt more. Without this check, the Total line can render
  // past the bottom of the page and simply not appear in the PDF.
  const priceBreakdownHeight = 100;
  if (y + priceBreakdownHeight > 800) {
    doc.addPage();
    y = 60;
  }

  doc.setDrawColor(230, 230, 230);
  doc.line(marginX, y, 545, y);
  y += 22;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Subtotal", marginX, y);
  doc.text(`Rs. ${data.subtotal}`, 545, y, { align: "right" });
  y += 16;

  doc.text("Delivery Fee", marginX, y);
  doc.text(`Rs. ${data.deliveryFee}`, 545, y, { align: "right" });
  y += 20;

  doc.setDrawColor(147, 51, 234);
  doc.setLineWidth(1.2);
  doc.line(marginX, y, 545, y);
  y += 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(147, 51, 234);
  doc.text("Total", marginX, y);
  doc.text(`Rs. ${data.total}`, 545, y, { align: "right" });

  const filename = `MealBearSkardu-Invoice-${data.name.replace(/\s+/g, "")}-${Date.now()}.pdf`;
  doc.save(filename);
  return filename;
}

export default function InvoicePage() {
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
    const message = `Hi ${data.name}, your order is confirmed! ✅ Total: Rs. ${data.total}. I've just downloaded your invoice (${filename}) — please tap the 📎 attach icon below and select it from your downloads to send it here.`;

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