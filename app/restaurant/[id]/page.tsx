import type { Metadata } from "next";
import { getShopById } from "@/lib/dataService";
import RestaurantPageClient from "./RestaurantPageClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

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
      canonical: `https://www.mealbear.pk/restaurant/${id}`,
    },
    openGraph: {
      title: `${shop.name} | Meal Bear Skardu`,
      description: `Order from ${shop.name} — fast delivery across Skardu.`,
      url: `https://www.mealbear.pk/restaurant/${id}`,
      images: shop.logo ? [{ url: shop.logo }] : undefined,
    },
  };
}

export default async function RestaurantPage({ params }: PageProps) {
  const { id } = await params;
  const shop = await getShopById(id);

  const jsonLd = shop
    ? {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        name: shop.name,
        image: shop.logo,
        url: `https://www.mealbear.pk/restaurant/${id}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Skardu",
          addressRegion: "Gilgit-Baltistan",
          addressCountry: "PK",
        },
        servesCuisine: "Pakistani",
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