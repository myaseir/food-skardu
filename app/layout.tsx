import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mealbear.pk"), // Change to your real domain

  title: {
    default: "Meal Bear Skardu | Food Delivery",
    template: "%s | Meal Bear Skardu",
  },

  description: "The premium on-demand delivery service for Skardu.",

  applicationName: "Meal Bear Skardu",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon1.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.json",

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}