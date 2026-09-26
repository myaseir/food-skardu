/**
 * SEO helpers for restaurant pages.
 *
 * Everything here is a pure function (no data fetching), so it can be used
 * from server components, metadata functions and client components alike.
 */

/* ---------- Site constants ---------- */

export const SITE_URL = "https://www.mealbear.pk";
export const SITE_NAME = "Meal Bear Skardu";
export const CITY = "Skardu";
export const REGION = "Gilgit-Baltistan";
export const COUNTRY_CODE = "PK";
export const CURRENCY = "PKR";

/* ---------- Menu shapes (structurally compatible with your menu data) ---------- */

export interface MenuVariantLike {
  name: string;
  price: number;
  discountPrice?: number;
}

export interface MenuItemLike {
  id?: string;
  name: string;
  price: number;
  discountPrice?: number;
  desc?: string;
  image?: string;
  variants?: MenuVariantLike[];
}

export interface MenuCategoryLike {
  name: string;
  items: MenuItemLike[];
}

export interface MenuLike {
  name?: string;
  categories: MenuCategoryLike[];
}

/* ---------- Text and URL utilities ---------- */

/** Turns "/logo.png" or "logo.png" into a full URL. Full URLs pass through. */
export function absoluteUrl(src?: string | null): string | undefined {
  const value = src?.trim();
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

/**
 * Builds a canonical, absolute URL for a page path, e.g.
 * buildCanonicalUrl("/skardu/k-ramen-skardu") -> "https://www.mealbear.pk/skardu/k-ramen-skardu".
 * A correct <link rel="canonical"> pointing at this is what stops Google
 * from splitting ranking signal across "?ref=..." or trailing-slash
 * variants of the same page.
 */
export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/** Shortens text to `max` characters at a word boundary, adding "…". */
export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, Math.max(1, max - 1));
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > 40 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[,.;:\s]+$/, "")}…`;
}

/** ["A"] -> "A", ["A","B"] -> "A and B", ["A","B","C"] -> "A, B and C". */
export function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/* ---------- Prices ---------- */

const isValidPrice = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

export const formatRs = (amount: number): string => `Rs. ${Math.round(amount)}`;

/** A discount only counts when it is positive and lower than the normal price. */
export function effectivePrice(price: number, discountPrice?: number): number {
  return typeof discountPrice === "number" && discountPrice > 0 && discountPrice < price
    ? discountPrice
    : price;
}

/** Lowest price a customer can pay for an item (handles variants and discounts). */
export function lowestPrice(item: MenuItemLike): number {
  const variantPrices = (item.variants ?? [])
    .map((v) => effectivePrice(v.price, v.discountPrice))
    .filter(isValidPrice);

  if (variantPrices.length > 0) return Math.min(...variantPrices);
  return effectivePrice(item.price, item.discountPrice);
}

/** Highest price a customer can pay for an item (handles variants and discounts). */
export function highestPrice(item: MenuItemLike): number {
  const variantPrices = (item.variants ?? [])
    .map((v) => effectivePrice(v.price, v.discountPrice))
    .filter(isValidPrice);

  if (variantPrices.length > 0) return Math.max(...variantPrices);
  return effectivePrice(item.price, item.discountPrice);
}

/** Cheapest and most expensive price on the menu, or null if there are no prices. */
export function derivePriceRange(menu: MenuLike): { min: number; max: number } | null {
  const items = menu.categories.flatMap((cat) => cat.items);
  const lows = items.map(lowestPrice).filter((p) => isValidPrice(p) && p > 0);
  const highs = items.map(highestPrice).filter((p) => isValidPrice(p) && p > 0);

  if (lows.length === 0 || highs.length === 0) return null;
  return { min: Math.min(...lows), max: Math.max(...highs) };
}

/* ---------- Time helpers ---------- */

/**
 * Accepts "18:00", "6:00 PM", "6pm", "6:00 p.m." and returns "18:00",
 * the format schema.org expects. Returns null for anything else.
 */
export function to24h(input: unknown): string | null {
  if (typeof input !== "string") return null;

  const match = input
    .trim()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?$/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3]?.toLowerCase().replace(/\./g, "");

  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;
  if (hour > 23 || minute > 59) return null;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** "18:00" -> "6:00 PM" for display. */
export function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/* ---------- Shop facts ---------- */

export interface ShopFacts {
  name: string;
  /** Owner-written description from your data, if any. */
  description: string | null;
  cuisines: string[];
  address: string | null;
  area: string | null;
  priceRange: string | null;
  hours: { alwaysOpen: boolean; opens: string; closes: string } | null;
  hoursLabel: string | null;
}

const clean = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

/**
 * Reads a shop record defensively, so a missing or oddly formatted field
 * never breaks the page. Field names read:
 * name, description, cuisines (string[]) or cuisine ("Pakistani, Fast Food"),
 * address, area, priceRange, alwaysOpen, openTime, closeTime.
 * Rename them here if your data uses different keys.
 */
export function getShopFacts(shop: object): ShopFacts {
  const s = shop as Record<string, unknown>;

  const rawCuisines: unknown[] = Array.isArray(s.cuisines)
    ? s.cuisines
    : typeof s.cuisine === "string"
    ? s.cuisine.split(/[,/]/)
    : [];

  const cuisines = Array.from(
    new Set(rawCuisines.map(clean).filter((c): c is string => c !== null))
  );

  let hours: ShopFacts["hours"] = null;
  if (s.alwaysOpen) {
    hours = { alwaysOpen: true, opens: "00:00", closes: "23:59" };
  } else {
    const opens = to24h(s.openTime);
    const closes = to24h(s.closeTime);
    if (opens && closes) hours = { alwaysOpen: false, opens, closes };
  }

  const hoursLabel = hours
    ? hours.alwaysOpen
      ? "Open 24 hours, every day"
      : `${to12h(hours.opens)} to ${to12h(hours.closes)}, every day`
    : null;

  return {
    name: clean(s.name) ?? "",
    description: clean(s.description),
    cuisines,
    address: clean(s.address),
    area: clean(s.area),
    priceRange: clean(s.priceRange),
    hours,
    hoursLabel,
  };
}

/* ---------- Menu-derived content ---------- */

/** Up to `limit` distinct item names, taken from different categories first. */
export function popularItemNames(menu: MenuLike, limit = 3): string[] {
  const names: string[] = [];
  const add = (name?: string) => {
    const value = name?.trim();
    if (value && !names.includes(value) && names.length < limit) names.push(value);
  };

  for (const cat of menu.categories) add(cat.items[0]?.name);
  for (const cat of menu.categories) for (const item of cat.items) add(item.name);

  return names;
}

/* ---------- Titles and descriptions ---------- */

/**
 * Page title, kept to about 60 characters so Google doesn't cut it off.
 * Leads with the exact restaurant name first — critical for branded
 * searches like "K Ramen Skardu", since Google weighs an exact match near
 * the start of the <title> heavily for that kind of query. `area` (a
 * neighborhood/locality, if you have one) lets the same title also catch
 * more specific searches like "Korean food Khomer Skardu". The site name
 * is appended only when there's room, since a title stuffed past ~60
 * characters just gets truncated in search results anyway.
 */
export function buildTitle(name: string, area?: string | null): string {
  const areaPart = area ? ` (${area})` : "";
  const candidates = [
    `${name} Menu & Delivery in ${CITY}${areaPart} | ${SITE_NAME}`,
    `${name} Menu & Delivery in ${CITY}${areaPart}`,
    `${name} Menu & Delivery in ${CITY}`,
    `${name} Delivery in ${CITY}`,
    `${name} ${CITY}`,
  ];
  return candidates.find((t) => t.length <= 60) ?? candidates[candidates.length - 1];
}

/**
 * Visible description for the page and the structured data. Uses the
 * owner's text when there is some; otherwise builds it from this shop's
 * own cuisine, menu and prices, so every page reads differently.
 * A real, hand-written description is still the best option.
 */
export function buildDescription(facts: ShopFacts, menu: MenuLike): string {
  if (facts.description) return facts.description;

  const cuisine = facts.cuisines.length ? `, serving ${joinList(facts.cuisines)}` : "";
  const popular = popularItemNames(menu, 3);
  const range = derivePriceRange(menu);

  const sentences = [
    `${facts.name} is a restaurant in ${CITY}, ${REGION}${cuisine}.`,
    popular.length ? `Popular items include ${joinList(popular)}.` : "",
    range && range.min < range.max
      ? `Menu prices range from ${formatRs(range.min)} to ${formatRs(range.max)}.`
      : "",
    `Order online through ${SITE_NAME} for delivery to your home, office, or hotel room, with Cash on Delivery.`,
  ];

  return sentences.filter(Boolean).join(" ");
}

/**
 * Meta description for search results (max ~155 characters). The owner's
 * description is used when present. Otherwise the most important parts
 * (name, delivery, payment) are kept first and details are added only
 * if they still fit.
 */
export function buildMetaDescription(facts: ShopFacts, menu: MenuLike, max = 155): string {
  if (facts.description) return truncate(facts.description, max);

  const cuisine = facts.cuisines.length ? `Serving ${joinList(facts.cuisines)}.` : "";
  const popular = popularItemNames(menu, 2);
  const areaPart = facts.area ? ` (${facts.area})` : "";

  // Listed in reading order. `priority` decides what survives if space runs out.
  const segments = [
    { text: `Order from ${facts.name} in ${CITY}${areaPart}, ${REGION}.`, priority: 0 },
    { text: cuisine, priority: 3 },
    { text: popular.length ? `Try ${joinList(popular)}.` : "", priority: 4 },
    { text: "Delivery to homes, offices and hotels.", priority: 1 },
    { text: "Cash on Delivery.", priority: 2 },
    { text: "Order online now.", priority: 5 },
  ].map((segment, index) => ({ ...segment, index }))
   .filter((segment) => segment.text);

  const chosen = new Set<number>();
  let length = 0;

  [...segments]
    .sort((a, b) => a.priority - b.priority)
    .forEach((segment) => {
      const cost = segment.text.length + (chosen.size > 0 ? 1 : 0);
      if (length + cost <= max) {
        chosen.add(segment.index);
        length += cost;
      }
    });

  if (chosen.size === 0) return truncate(segments[0].text, max);

  return segments
    .filter((segment) => chosen.has(segment.index))
    .map((segment) => segment.text)
    .join(" ");
}

/* ---------- Image SEO ---------- */

/**
 * Descriptive alt text for a menu item photo. Real alt text (not "photo1"
 * or a blank string) is what lets a dish photo itself surface in Google
 * Image search and Google Lens results for the dish name.
 */
export function buildItemImageAlt(itemName: string, shopName: string): string {
  return `${itemName} - ${shopName} in ${CITY}`;
}

/* ---------- Structured data (JSON-LD) ---------- */

export interface RestaurantJsonLdOptions {
  /** This shop's page path, e.g. "/skardu/k-ramen-skardu" — used to build `url`. */
  path: string;
  /** Photo URL(s); relative or absolute. The first is treated as the primary image. */
  images?: (string | undefined | null)[];
  telephone?: string | null;
  /** WGS84 coordinates, if you have them — improves local-pack/map eligibility. */
  geo?: { latitude: number; longitude: number } | null;
  /** Average rating (1-5) and how many reviews it's based on, if you track these. */
  rating?: { value: number; count: number } | null;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/**
 * Builds a schema.org Restaurant JSON-LD object. Render this inside
 * `<script type="application/ld+json">{JSON.stringify(json)}</script>`
 * on the page — this is the single highest-leverage on-page change for
 * ranking a branded, local search like "<name> <city>" #1: it hands
 * Google exact, structured facts (address, hours, price range, cuisine)
 * instead of making it infer them from prose, and is what makes the page
 * eligible for rich results (star rating, price range, hours) in the SERP.
 */
export function buildRestaurantJsonLd(
  facts: ShopFacts,
  menu: MenuLike,
  options: RestaurantJsonLdOptions
): Record<string, unknown> {
  const images = (options.images ?? [])
    .map((src) => absoluteUrl(src ?? undefined))
    .filter((src): src is string => !!src);

  const range = derivePriceRange(menu);

  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: facts.name,
    url: buildCanonicalUrl(options.path),
    description: buildMetaDescription(facts, menu),
    servesCuisine: facts.cuisines.length ? facts.cuisines : undefined,
    priceRange:
      facts.priceRange ?? (range ? `${formatRs(range.min)} - ${formatRs(range.max)}` : undefined),
    address: {
      "@type": "PostalAddress",
      streetAddress: facts.address ?? undefined,
      addressLocality: CITY,
      addressRegion: REGION,
      addressCountry: COUNTRY_CODE,
    },
    telephone: options.telephone ?? undefined,
    image: images.length ? images : undefined,
    acceptsReservations: "False",
    paymentAccepted: "Cash",
    currenciesAccepted: CURRENCY,
  };

  if (options.geo) {
    json.geo = {
      "@type": "GeoCoordinates",
      latitude: options.geo.latitude,
      longitude: options.geo.longitude,
    };
  }

  if (facts.hours) {
    json.openingHoursSpecification = {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAYS_OF_WEEK,
      opens: facts.hours.alwaysOpen ? "00:00" : facts.hours.opens,
      closes: facts.hours.alwaysOpen ? "23:59" : facts.hours.closes,
    };
  }

  if (options.rating && options.rating.count > 0) {
    json.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: options.rating.value,
      reviewCount: options.rating.count,
    };
  }

  // Strip undefined keys so the emitted JSON-LD stays clean — Google is
  // lenient about this, but a tidy payload is easier to debug in the Rich
  // Results Test.
  return JSON.parse(JSON.stringify(json));
}

/**
 * Builds a simple Home > Restaurant breadcrumb JSON-LD. Breadcrumb rich
 * results are a small but easy CTR win — they replace the plain URL line
 * in a search result with a readable path.
 */
export function buildBreadcrumbJsonLd(name: string, path: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: buildCanonicalUrl(path) },
    ],
  };
}