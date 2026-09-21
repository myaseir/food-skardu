import Link from "next/link";
import { ArrowLeft, Zap, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";

const SITE_URL = "https://www.mealbear.pk";

/**
 * Real facts about your business live here.
 * Leave a field empty ("" or []) and the matching FAQ / schema entry is
 * skipped automatically, so the page never shows a guess.
 */
const SITE = {
  // e.g. "+92 300 0000000" (include the country code)
  phone: "",
  // e.g. "10:00 AM to 11:00 PM, every day"
  hours: "",
  // e.g. "Rs. 500". Leave empty if there is no minimum order.
  minimumOrder: "",
  // e.g. ["Restaurant A", "Restaurant B"]
  partnerRestaurants: [] as string[],
  // e.g. ["https://www.instagram.com/mealbearskardu"]
  socialLinks: [] as string[],
  // Put a 1200x630 image at /public/og-image.png. Remove this line if you don't have one yet.
  ogImage: "/og-image.png",
  // Optional: a square logo at /public/logo.png for the Organization schema.
  logo: "",
};

export const metadata = {
  title: "About Meal Bear | Food Delivery in Skardu",
  description:
    "Meal Bear Skardu delivers food from local restaurants to homes, offices, and hotels in Skardu, Gilgit-Baltistan. Cash on Delivery available.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Meal Bear Skardu",
    description:
      "Skardu's on-demand food delivery platform, connecting local restaurants to homes, offices, and hotels.",
    url: `${SITE_URL}/about`,
    type: "website",
    ...(SITE.ogImage && {
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: "Meal Bear Skardu" }],
    }),
  },
};

const values = [
  {
    icon: Zap,
    title: "Speed & Reliability",
    body: "We connect Skardu's finest restaurants with your door through a streamlined ordering and delivery process, built for consistency.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Partners",
    body: "We work only with reputable, quality-focused restaurants so every order meets a high standard, from kitchen to doorstep.",
  },
  {
    icon: HeartHandshake,
    title: "Hospitality First",
    body: "From hotel guests to local residents, we treat every order as a chance to represent Skardu's hospitality at its best.",
  },
];

// Each answer is a short, self-contained statement so search engines and
// AI answer tools can quote it directly.
const faqs: { question: string; answer: string }[] = [
  {
    question: "What is Meal Bear Skardu?",
    answer:
      "Meal Bear Skardu is an on-demand food delivery service operating in Skardu, Gilgit-Baltistan, Pakistan. It connects local restaurants with customers at homes, offices, and hotels.",
  },
  {
    question: "How do I order from Meal Bear Skardu?",
    answer:
      "Visit www.mealbear.pk, choose a restaurant, and add items to your cart. At checkout, select Hotel or Home delivery and enter your details. After you place the order, our team contacts you on WhatsApp or by phone to confirm it before a rider is dispatched.",
  },
  {
    question: "Does Meal Bear deliver to hotels in Skardu?",
    answer:
      "Yes. Meal Bear Skardu delivers directly to hotel rooms for guests staying at partner hotels across the city, in addition to homes and offices.",
  },
  {
    question: "What areas does Meal Bear Skardu deliver to?",
    answer:
      "Meal Bear Skardu delivers across Skardu city, Gilgit-Baltistan, including residential neighborhoods such as Katpanah and Sundus and the surrounding areas.",
  },
  {
    question: "Does Meal Bear accept Cash on Delivery?",
    answer:
      "Yes. Meal Bear Skardu accepts Cash on Delivery (COD) for all orders.",
  },
  {
    question: "How much is the delivery fee?",
    answer:
      "The delivery fee is calculated from the distance between the restaurant and your location (hotel or home). You see the exact delivery charge on the checkout page before you place your order.",
  },
  {
    question: "What restaurants deliver through Meal Bear in Skardu?",
    answer: SITE.partnerRestaurants.length
      ? `Current partner restaurants include ${SITE.partnerRestaurants.join(", ")}. The full, up-to-date list is on the Meal Bear homepage.`
      : "Meal Bear partners with a range of local restaurants in Skardu. The current list of participating restaurants is available on the Meal Bear homepage.",
  },
  ...(SITE.hours
    ? [
        {
          question: "What are Meal Bear Skardu's operating hours?",
          answer: `Meal Bear Skardu takes orders ${SITE.hours}. Individual restaurants may have their own opening times, which are shown on the homepage.`,
        },
      ]
    : []),
  ...(SITE.minimumOrder
    ? [
        {
          question: "Is there a minimum order?",
          answer: `Yes. The minimum order value is ${SITE.minimumOrder}, excluding the delivery fee.`,
        },
      ]
    : []),
  {
    question: "How do I contact Meal Bear or report a problem with my order?",
    answer: SITE.phone
      ? `Call or message us on ${SITE.phone}, or use the Contact page on www.mealbear.pk. Please include your order details so we can help quickly.`
      : "Use the Contact page on www.mealbear.pk and include your order details so we can help quickly.",
  },
];

// Escape "<" so the JSON can never close the script tag, even if this data
// later becomes dynamic.
const toJsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Meal Bear Skardu",
  url: `${SITE_URL}/about`,
  mainEntity: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Meal Bear Skardu",
    url: SITE_URL,
    description:
      "On-demand food delivery platform connecting Skardu's restaurants to homes, offices, and hotels.",
    areaServed: {
      "@type": "City",
      name: "Skardu",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Gilgit-Baltistan",
      },
    },
    paymentAccepted: "Cash on Delivery",
    ...(SITE.logo && { logo: `${SITE_URL}${SITE.logo}` }),
    ...(SITE.socialLinks.length && { sameAs: SITE.socialLinks }),
    ...(SITE.phone && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: SITE.phone,
        contactType: "customer service",
        areaServed: "PK",
      },
    }),
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function AboutPage() {
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
            About Meal Bear Skardu
          </h1>
          <p className="text-[13px] text-gray-500 mt-3 leading-relaxed max-w-xl">
            Meal Bear Skardu is an on-demand food delivery platform serving
            Skardu, Gilgit-Baltistan. We deliver from local restaurants to
            homes, offices, and hotel rooms, with Cash on Delivery available
            on every order.
          </p>
        </header>

        {/* Mission */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 mb-8">
          <h2 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-3">
            Our Mission
          </h2>
          <p className="text-[13px] leading-relaxed text-gray-600 mb-4">
            Meal Bear Skardu connects Skardu&apos;s local restaurants with
            customers at home, at work, and at partner hotels. We remove the
            wait, the walk, and the guesswork from ordering food in Skardu.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-600">
            We serve Skardu, a city known for its hospitality, by making
            reliable, quality food delivery accessible to residents and
            visitors alike.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="bg-purple-50 text-purple-600 p-2 rounded-full w-fit mb-3">
                <value.icon size={16} />
              </div>
              <h3 className="text-[12px] font-black uppercase tracking-tight text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-[12px] leading-relaxed text-gray-600">
                {value.body}
              </p>
            </div>
          ))}
        </div>

        {/* Coverage */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 flex items-start gap-4 mb-8">
          <div className="bg-purple-50 text-purple-600 p-2.5 rounded-full shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-2">
              Where We Deliver
            </h2>
            <p className="text-[13px] leading-relaxed text-gray-600">
              Meal Bear Skardu operates across Skardu, Gilgit-Baltistan,
              including Katpanah, Sundus, and surrounding neighborhoods. We
              partner with local restaurants and hotels to deliver to
              residents, travelers, and hotel guests throughout the city.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 mb-8">
          <h2 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-[13px] font-bold text-gray-900 mb-1.5">
                  {faq.question}
                </h3>
                <p className="text-[13px] leading-relaxed text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 mt-8 text-center">
          Questions about our service?{" "}
          <Link href="/contact" className="text-purple-600 font-bold hover:underline">
            Get in touch
          </Link>
        </p>
      </div>

      {/* AboutPage + Organization schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(organizationSchema) }}
      />

      {/* FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(faqSchema) }}
      />
    </main>
  );
}