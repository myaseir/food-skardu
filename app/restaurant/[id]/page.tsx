import type { Metadata } from "next";
import { getShopById } from "@/lib/dataService";
import RestaurantPageClient from "./RestaurantPageClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = "https://www.mealbear.pk"; // TODO: confirm this is the final production domain

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const shop = await getShopById(id);

  if (!shop) {
    return { title: "Restaurant Not Found" };
  }

  return {
    title: `${shop.name} Menu & Delivery in Skardu`,
    description: `Order from ${shop.name} in Skardu with fast delivery to your home, office, or hotel room. Cash on Delivery available.`,
    alternates: {
      canonical: `${SITE_URL}/restaurant/${id}`,
    },
    openGraph: {
      title: `${shop.name} | Meal Bear Skardu`,
      description: `Order from ${shop.name} — fast delivery across Skardu.`,
      url: `${SITE_URL}/restaurant/${id}`,
      images: shop.logo ? [{ url: shop.logo }] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RestaurantPage({ params }: PageProps) {
  const { id } = await params;
  const shop = await getShopById(id);

  // Build opening hours schema only when we have real hours to report —
  // an "alwaysOpen" shop gets a 24/7 spec instead of a time range.
  const openingHours = shop
    ? shop.alwaysOpen
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
            ],
            opens: "00:00",
            closes: "23:59",
          },
        ]
      : shop.openTime && shop.closeTime
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
            ],
            opens: shop.openTime,
            closes: shop.closeTime,
          },
        ]
      : undefined
    : undefined;

  const jsonLd = shop
    ? {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        name: shop.name,
        image: shop.logo,
        url: `${SITE_URL}/restaurant/${id}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Skardu",
          addressRegion: "Gilgit-Baltistan",
          addressCountry: "PK",
        },
        // TODO: replace with per-shop cuisine once that field exists on
        // your shop data — hardcoding "Pakistani" for every restaurant
        // (Pizza King, Yak and Bull, etc.) understates relevance for
        // cuisine-specific searches.
        servesCuisine: "Pakistani",
        ...(typeof shop.rating === "number" && typeof shop.reviews === "number"
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: shop.rating,
                reviewCount: shop.reviews,
              },
            }
          : {}),
        ...(openingHours ? { openingHoursSpecification: openingHours } : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <RestaurantPageClient params={params} />
    </>
  );
}