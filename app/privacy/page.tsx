import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Food Skardu",
  description: "How Food Skardu collects, uses, and protects your information.",
};

const sections = [
  {
    title: "1. Introduction",
    body: `This Privacy Policy explains how Food Skardu ("we", "us", "our") collects, uses, and protects information when you use our website, app, or in-room QR ordering service. By using Food Skardu, you agree to the practices described below.`,
  },
  {
    title: "2. Information We Collect",
    body: `We collect information you provide directly, such as your name, phone number, delivery address (including hotel room or reception details), and order history. We may also collect basic device and usage data — such as browser type, approximate location, and pages visited — to help us operate and improve the platform.`,
  },
  {
    title: "3. How We Use Your Information",
    body: `We use your information to process and deliver orders, coordinate payments, communicate order updates, provide customer support, and improve our service. We may also use aggregated, non-identifying data to understand ordering trends and optimize delivery coverage in Skardu.`,
  },
  {
    title: "4. Sharing With Restaurants & Riders",
    body: `To fulfill your order, we share necessary details — such as your name, order contents, and delivery location — with the relevant restaurant partner and delivery rider. We do not sell your personal information to third parties for marketing purposes.`,
  },
  {
    title: "5. Hotel Partnerships",
    body: `When you order via an in-room QR code, your delivery location (room number or reception) is shared only with the restaurant and rider needed to complete that order. Hotels do not receive your personal order history, and Food Skardu does not share guest data with hotel management beyond what is required for delivery coordination.`,
  },
  {
    title: "6. Payment Information",
    body: `Payments are processed through secure third-party payment providers. Food Skardu does not store your full card details on our servers. Please refer to your payment provider's own privacy policy for details on how they handle your payment data.`,
  },
  {
    title: "7. Data Retention",
    body: `We retain order and account information for as long as necessary to provide our service, resolve disputes, and comply with legal obligations. You may request deletion of your data at any time by contacting our support team, subject to any records we are legally required to keep.`,
  },
  {
    title: "8. Data Security",
    body: `We take reasonable technical and organizational measures to protect your information from unauthorized access, loss, or misuse. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "9. Your Choices",
    body: `You may update your account details, opt out of promotional communications, or request access to or deletion of your personal data by contacting us through the Contact page.`,
  },
  {
    title: "10. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Continued use of Food Skardu after changes are posted constitutes acceptance of the updated policy.`,
  },
  {
    title: "11. Contact Us",
    body: `If you have questions about this Privacy Policy or how your data is handled, please reach out via our Contact page.`,
  },
];

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
          For details on how we handle orders and disputes, see our{" "}
          <Link href="/terms" className="text-purple-600 font-bold hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </main>
  );
}