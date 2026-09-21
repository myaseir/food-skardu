import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopById, getMenuByShopId } from "@/lib/dataService";
import { getTemplate } from "@/lib/templates/registry";
import RestaurantAbout from "@/components/RestaurantAbout";
import {
  CITY,
  COUNTRY_CODE,
  CURRENCY,
  REGION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  buildDescription,
  buildMetaDescription,
  buildTitle,
  getShopFacts,
  lowestPrice,
  type MenuCategoryLike,
  type MenuItemLike,
} from "@/lib/shopSeo";

interface PageProps {
  params: Promise<{ id: string }>;
}

// generateMetadata and the page both need the same data. cache() makes it
// one database call per request instead of two.
const getShop = cache(getShopById);
const getMenu = cache(getMenuByShopId);

// Escape "<" so shop or menu text can never close the script tag.
const toJsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const shop = await getShop(id);

  if (!shop) {
    return { title: "Restaurant Not Found", robots: { index: false, follow: false } };
  }

  const menu = await getMenu(id);
  const facts = getShopFacts(shop);
  const url = `${SITE_URL}/restaurant/${id}`;

  const description = menu
    ? buildMetaDescription(facts, menu)
    : `Order from ${facts.name} in ${CITY}. Delivery available.`;
  const image = absoluteUrl(shop.logo);

  return {
    title: buildTitle(facts.name),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${facts.name} | ${SITE_NAME}`,
      description,
      url,
      images: image ? [{ url: image, alt: facts.name }] : undefined,
    },
    twitter: {
      card: "summary",
      title: `${facts.name} | ${SITE_NAME}`,
      description,
      images: image ? [image] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RestaurantPage({ params }: PageProps) {
  const { id } = await params;

  const shop = await getShop(id);
  const menu = shop ? await getMenu(id) : null;

  if (!shop || !menu) return notFound();

  const facts = getShopFacts(shop);
  const url = `${SITE_URL}/restaurant/${id}`;
  const description = buildDescription(facts, menu);
  const image = absoluteUrl(shop.logo);

  const openingHours = facts.hours
    ? [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
          ],
          opens: facts.hours.opens,
          closes: facts.hours.closes,
        },
      ]
    : undefined;

  // Only include ratings that are real. Google can penalise made-up or
  // self-written review markup, so leave rating/reviews empty if you have none.
  const hasRating =
    typeof shop.rating === "number" &&
    typeof shop.reviews === "number" &&
    shop.rating >= 1 &&
    shop.rating <= 5 &&
    shop.reviews > 0;

  const restaurant = {
    "@type": "Restaurant",
    "@id": `${url}#restaurant`,
    name: facts.name,
    url,
    description,
    image,
    logo: image,
    servesCuisine: facts.cuisines.length ? facts.cuisines : undefined,
    priceRange: facts.priceRange ?? undefined,
    paymentAccepted: "Cash on Delivery",
    currenciesAccepted: CURRENCY,
    address: {
      "@type": "PostalAddress",
      ...(facts.address ? { streetAddress: facts.address } : {}),
      addressLocality: CITY,
      addressRegion: REGION,
      addressCountry: COUNTRY_CODE,
    },
    areaServed: { "@type": "City", name: CITY },
    hasMenu: { "@id": `${url}#menu` },
    potentialAction: {
      "@type": "OrderAction",
      target: url,
      deliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
    },
    ...(openingHours ? { openingHoursSpecification: openingHours } : {}),
    ...(hasRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: shop.rating,
            reviewCount: shop.reviews,
          },
        }
      : {}),
  };

  const menuSchema = {
    "@type": "Menu",
    "@id": `${url}#menu`,
    name: `${facts.name} Menu`,
    inLanguage: "en",
    hasMenuSection: menu.categories.map((cat: MenuCategoryLike) => ({
      "@type": "MenuSection",
      name: cat.name,
      hasMenuItem: cat.items.map((item: MenuItemLike) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.desc || undefined,
        image: absoluteUrl(item.image),
        offers: {
          "@type": "Offer",
          price: lowestPrice(item),
          priceCurrency: CURRENCY,
        },
      })),
    })),
  };

  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: facts.name, item: url },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [restaurant, menuSchema, breadcrumbs],
  };

  const Template = getTemplate(shop.templateId);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }}
      />
      <Template shop={shop} menu={menu} />
      <RestaurantAbout shop={shop} menu={menu} />
    </>
  );
}