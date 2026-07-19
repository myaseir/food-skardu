import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import CartValidator from "@/components/CartValidator";
import RouteProgress from "@/components/RouteLoader";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mealbear.pk"), // use the canonical www version — matches your 308 redirect

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
    canonical: "https://www.mealbear.pk",
  },

  openGraph: {
    title: "Meal Bear Skardu | Food Delivery in Skardu",
    description:
      "Fast, reliable food delivery to homes, offices, and hotel rooms across Skardu, Gilgit-Baltistan.",
    url: "https://www.mealbear.pk",
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Meal Bear Skardu",
  alternateName: "Meal Bear",
  url: "https://www.mealbear.pk",
  logo: "https://www.mealbear.pk/images/logo.png",
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
  // sameAs: [
  //   "https://www.facebook.com/yourpage",
  //   "https://www.tiktok.com/@mealxbear",
  //   "https://www.instagram.com/yourpage",
  // ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Meal Bear Skardu",
  url: "https://www.mealbear.pk",
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
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <CartValidator />
        {children}
      </body>
    </html>
  );
}