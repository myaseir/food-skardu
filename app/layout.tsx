import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import CartValidator from "@/components/CartValidator";
import RouteProgress from "@/components/RouteLoader";
import { LocationProvider } from "@/contexts/LocationContext";
import LocationGate from "@/components/Locationgate"; // fixed: was "Locationgate" — case mismatch breaks the build on case-sensitive hosts (Vercel/Linux) even though it works locally on Windows/macOS

const inter = Inter({
  subsets: ["latin"],
});

const SITE_URL = "https://www.mealbear.pk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), // use the canonical www version — matches your 308 redirect

  title: {
    default: "Meal Bear Skardu | Food Delivery in Skardu, Gilgit-Baltistan",
    template: "%s | Meal Bear Skardu",
  },

  description:
    "Order food delivery in Skardu from top local restaurants including Yak & Bull, MFC, Pizza King, and Skyway Pizza. Fast delivery to homes, offices, and hotel rooms across Skardu, Gilgit-Baltistan. Cash on Delivery.",

  keywords: [
    "food delivery Skardu",
    "Skardu food delivery",
    "order food online Skardu",
    "Meal Bear",
    "Meal Bear Skardu",
    "restaurant delivery Skardu",
    "hotel food delivery Skardu",
    "Gilgit-Baltistan food delivery",
  ],

  applicationName: "Meal Bear Skardu",

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    title: "Meal Bear Skardu | Food Delivery in Skardu",
    description:
      "Fast, reliable food delivery to homes, offices, and hotel rooms across Skardu, Gilgit-Baltistan.",
    url: SITE_URL,
    siteName: "Meal Bear Skardu",
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "/images/og-cover.jpg", // 1200x630 — add this file if it doesn't exist yet
        width: 1200,
        height: 630,
        alt: "Meal Bear Skardu Food Delivery",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Meal Bear Skardu | Food Delivery in Skardu",
    description: "Order food delivery in Skardu, Gilgit-Baltistan.",
    images: ["/images/og-cover.jpg"],
  },

  // NOTE: no manual "icons" field needed here.
  // favicon.ico, icon0.svg, icon1.png, and apple-icon.png live directly
  // inside app/ — Next.js auto-detects these special filenames and
  // injects the correct <link rel="icon"> tags at build time.

  manifest: "/manifest.json",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    // paste the content value Google Search Console gives you when you verify via HTML tag method
    // google: "your-verification-code-here",
  },
};

// Linked via @id so Google's Knowledge Graph treats these as one
// consistent entity instead of two unrelated schema blocks — the
// WebSite's "publisher" points back at the Organization's "@id".
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Meal Bear Skardu",
  alternateName: "Meal Bear",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description:
    "On-demand food delivery service for Skardu, Gilgit-Baltistan, delivering to homes, offices, and hotel rooms.",
  areaServed: {
    "@type": "City",
    name: "Skardu",
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Gilgit-Baltistan",
    },
  },
  // TODO: fill these in once you have real profiles — sameAs is a
  // genuine trust/entity signal for Google's Knowledge Panel, worth
  // adding as soon as the pages exist.
  // sameAs: [
  //   "https://www.facebook.com/yourpage",
  //   "https://www.tiktok.com/@mealxbear",
  //   "https://www.instagram.com/yourpage",
  // ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Meal Bear Skardu",
  url: SITE_URL,
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  // TODO: only add this once you have an actual internal search
  // results page (e.g. /search?q={term}) — it's what lets Google show
  // a search box directly under your homepage result. Leave commented
  // out until that route exists; a broken potentialAction is worse
  // than none.
  // potentialAction: {
  //   "@type": "SearchAction",
  //   target: {
  //     "@type": "EntryPoint",
  //     urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
  //   },
  //   "query-input": "required name=search_term_string",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <LocationProvider>
          <LocationGate>
            <Suspense fallback={null}>
              <RouteProgress />
            </Suspense>
            <CartValidator />
            {children}
          </LocationGate>
        </LocationProvider>
      </body>
    </html>
  );
}