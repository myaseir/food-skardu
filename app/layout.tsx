import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BR 9 Cafe | Premium 24/7 Coffee in Islamabad",
  description: "Experience Islamabad's finest coffee at BR 9 Cafe. Visit our branches in E11/2, Bahria Phase 8, and F-8/2 Madina Market. Open 24/7.",
  keywords: ["Cafe Islamabad", "BR 9 Cafe", "24/7 Cafe Islamabad", "Best Coffee Islamabad", "F-8 Coffee", "E11 Cafe"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-stone-900">
        {/* The flex-grow container ensures content fills the space, pushing the footer down */}
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  );
}