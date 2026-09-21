import { MetadataRoute } from "next";
import { shops } from "@/data/config";
import { blogPosts } from "@/data/blog-posts";

// Must match SITE_URL everywhere else (metadata, blog pages, JSON-LD).
const baseUrl = "https://www.mealbear.pk";

// Real "last edited" dates for pages that rarely change. Update a date only
// when you actually change that page's content. Google learns to ignore
// lastmod values that are never accurate.
const PAGE_DATES = {
  about: "2026-09-22", // rewritten with the new FAQ and schema
  faq: "2026-06-01",
  contact: "2026-06-01",
  terms: "2026-01-01", // TODO: set to when the terms were last revised
  privacy: "2026-07-01", // matches "Last Updated: July 2026" on the page; bump it when you edit the policy
} as const;

/** Returns a valid Date, or undefined. A bad date would otherwise crash the sitemap build. */
function toDate(value?: string | Date | null): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Adds lastModified only when we know it. A missing date is better than a fake one. */
function entry(url: string, lastModified?: Date): MetadataRoute.Sitemap[number] {
  return lastModified ? { url, lastModified } : { url };
}

/** Uses shop.updatedAt if your data has it; otherwise returns undefined. */
const shopUpdatedAt = (shop: object) =>
  toDate((shop as { updatedAt?: string | Date }).updatedAt);

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = blogPosts.map((post) => ({
    slug: post.slug,
    lastModified: toDate(post.updatedAt || post.publishedAt),
  }));

  // The blog index changes whenever any post does.
  const latestPostDate = posts.reduce<Date | undefined>(
    (latest, post) =>
      post.lastModified && (!latest || post.lastModified > latest)
        ? post.lastModified
        : latest,
    undefined
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    entry(baseUrl), // homepage: its content changes constantly, so no fixed date
    entry(`${baseUrl}/about`, toDate(PAGE_DATES.about)),
    entry(`${baseUrl}/faq`, toDate(PAGE_DATES.faq)),
    entry(`${baseUrl}/contact`, toDate(PAGE_DATES.contact)),
    entry(`${baseUrl}/blog`, latestPostDate),
    entry(`${baseUrl}/terms`, toDate(PAGE_DATES.terms)),
    entry(`${baseUrl}/privacy`, toDate(PAGE_DATES.privacy)),
    // /checkout is left out on purpose: no SEO value, and it is blocked in robots.ts
  ];

  // One URL per active shop: /restaurant/[id] or /mart/[id].
  const shopRoutes: MetadataRoute.Sitemap = shops
    .filter((shop) => shop.isActive !== false)
    .map((shop) => entry(`${baseUrl}/${shop.type}/${shop.id}`, shopUpdatedAt(shop)));

  const blogPostRoutes: MetadataRoute.Sitemap = posts.map((post) =>
    entry(`${baseUrl}/blog/${post.slug}`, post.lastModified)
  );

  return [...staticRoutes, ...shopRoutes, ...blogPostRoutes];
}