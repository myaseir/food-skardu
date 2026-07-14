import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Meal Bear Skardu",
  description: "Terms and conditions for using Meal Bear Skardu's delivery platform.",
};

const sections = [
  {
    title: "1. About Meal Bear Skardu",
    body: `Meal Bear Skardu is an on-demand food delivery platform connecting customers and hotel guests in Skardu with local restaurants and shops. We act solely as an intermediary that facilitates ordering, pickup, payment coordination, and delivery. We do not prepare, cook, or own the food listed on our platform.`,
  },
  {
    title: "2. Placing Orders",
    body: `By placing an order through our website, app, or an in-room QR code, you agree to pay the listed price for the items ordered, plus any applicable delivery fee. Menu availability, pricing, and preparation times are set by individual restaurant partners and may change without notice.`,
  },
  {
    title: "3. Payments",
    body: `All transactions are processed securely through our supported payment methods. Meal Bear Skardu is not responsible for issues arising from a customer's bank, card issuer, or payment provider. Prices displayed at checkout are final unless a restaurant or system error requires correction, in which case we will notify you before confirming the order.`,
  },
  {
    title: "4. Delivery",
    body: `Meal Bear Skardu is responsible for delivering your order from the restaurant to the address provided — including hotel receptions or in-room delivery where applicable — within a reasonable timeframe. Delivery times are estimates and may vary due to weather, traffic, or restaurant delays.`,
  },
  {
    title: "5. Hotel Partnerships",
    body: `Hotels listed on our platform partner with Meal Bear Skardu at no cost or commission. Once an order is handed over at the hotel premises, any further handling — including room access, guest interaction, or internal security — is governed by that hotel's own policies. Meal Bear Skardu is not liable for incidents occurring after handover at the hotel premises.`,
  },
  {
    title: "6. Food Quality & Safety",
    body: `We partner only with restaurants we consider reputable. However, food preparation, hygiene, and quality are the sole responsibility of the restaurant partner. Please inform us immediately of any quality concerns so we can escalate the issue with the restaurant on your behalf.`,
  },
  {
    title: "7. Disputes & Refunds",
    body: `If you experience an issue with your order — incorrect items, missing items, or quality concerns — contact our support team within a reasonable time of delivery. We will act as the primary mediator between you and the restaurant to resolve the issue fairly. Refunds, where applicable, are issued at our discretion based on the outcome of this review.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `Meal Bear Skardu is not liable for indirect, incidental, or consequential damages arising from the use of our platform, including but not limited to delays, food quality issues caused by restaurant partners, or incidents occurring on hotel premises after delivery handover.`,
  },
  {
    title: "9. Changes to These Terms",
    body: `We may update these Terms from time to time to reflect changes in our service or legal requirements. Continued use of Meal Bear Skardu after changes are posted constitutes acceptance of the updated Terms.`,
  },
  {
    title: "10. Contact Us",
    body: `Questions about these Terms can be sent to our support team via the Contact page.`,
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-purple-600 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Terms of Service
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-2">
            Last Updated: July 2026
          </p>
        </header>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-2">
                {section.title}
              </h2>
              <p className="text-[13px] leading-relaxed text-gray-600">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="text-[10px] text-gray-400 mt-8 text-center">
          By using Meal Bear Skardu, you agree to these Terms of Service.{" "}
          <Link href="/privacy" className="text-purple-600 font-bold hover:underline">
            View our Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}