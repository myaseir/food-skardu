import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensure this points to your CSS file

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
      <body className={`${inter.className} antialiased`}>
        {/* If you eventually add Auth or Theme Providers, 
          you would wrap the {children} here.
        */}
        {children}
      </body>
    </html>
  );
}