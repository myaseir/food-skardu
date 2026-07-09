import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food Skardu | Premium Delivery",
  description: "The premium on-demand delivery service for Skardu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Nuclear Fix: Tell the browser that your app is 'dark mode aware'. 
          This prevents mobile browsers from force-applying their own 
          filters or light-gray overlays to your text.
        */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}