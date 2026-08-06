import { MetadataRoute } from "next";
import { shops } from "@/data/config";
import { blogPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  // Canonical domain confirmed as www.mealbear.pk. This must match
  // SITE_URL in app/blog/page.tsx and app/blog/[slug]/page.tsx exactly,
  // and every internal https://mealbear.pk link in data/blog-posts.ts
  // needs to use www too — see the updated versions of those files.
  const baseUrl = "https://www.mealbear.pk";

  // CHANGED: was `new Date()`, evaluated fresh on every build — which
  // means every static page (including /terms and /privacy, which
  // rarely change) reported "modified today" on every single deploy.
  // A lastModified date that's never accurate teaches Google to
  // discount the field for your whole site. Hardcode real dates for
  // pages that don't change often, and only use "today" as a fallback
  // for content that's actually dynamic (shop listings).
  const buildTimestamp = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: buildTimestamp,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      // TODO: swap in the actual date this page was last edited.
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      // TODO: set to whenever your terms were actually last revised.
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // /checkout intentionally excluded — no SEO value, blocked in robots.ts
  ];

  const shopRoutes: MetadataRoute.Sitemap = shops
    .filter((shop) => shop.isActive !== false)
    .map(
      (shop): MetadataRoute.Sitemap[number] => ({
        url: `${baseUrl}/${shop.type}/${shop.id}`,
        // Falls back to the build-time timestamp if the shop has no
        // updatedAt field yet — swap in shop.updatedAt once your data
        // source tracks per-shop edit times, so Google sees accurate
        // "last modified" signals instead of every shop looking equally
        // fresh on every deploy.
        lastModified: (shop as { updatedAt?: string | Date }).updatedAt
          ? new Date((shop as { updatedAt?: string | Date }).updatedAt!)
          : buildTimestamp,
        changeFrequency: "daily",
        priority: 0.8,
      })
    );

  // NEW: the /blog index and every individual /blog/[slug] post were
  // missing from the sitemap entirely. Without this, Google has no
  // guaranteed way to discover the per-post URLs beyond crawling links
  // from the index page — submitting the sitemap is what makes
  // discovery immediate and durable (see prior discussion on manual
  // "Request Indexing" vs sitemap submission). Dates are pulled from
  // each post's own publishedAt/updatedAt instead of a fake "today",
  // which is a real freshness signal search engines do weight,
  // especially for a "Complete Guide" style post you plan to revise.
  const blogIndexRoute: MetadataRoute.Sitemap[number] = {
    url: `${baseUrl}/blog`,
    lastModified: blogPosts.reduce((latest, post) => {
      const postDate = new Date(post.updatedAt || post.publishedAt);
      return postDate > latest ? postDate : latest;
    }, new Date(0)),
    changeFrequency: "weekly",
    priority: 0.7,
  };

  const blogPostRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...shopRoutes, blogIndexRoute, ...blogPostRoutes];
}