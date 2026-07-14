import { MetadataRoute } from "next";
import { shops } from "@/data/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.mealbear.pk";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // /checkout intentionally excluded — no SEO value, blocked in robots.ts
  ];

  const shopRoutes: MetadataRoute.Sitemap = shops
    .filter((shop) => shop.isActive !== false)
    .map((shop) => ({
      url: `${baseUrl}/${shop.type}/${shop.id}`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    }));

  return [...staticRoutes, ...shopRoutes];
}