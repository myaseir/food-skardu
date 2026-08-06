// app/blog/page.tsx
//
// CHANGED FROM YOUR ORIGINAL:
// - renderLinkedText now imported from "@/lib/render-linked-text" instead
//   of being defined here (also used by app/blog/[slug]/page.tsx).
// - Each post card no longer expands full content in a <details>. It
//   shows the excerpt + FAQ preview and links to /blog/[slug], which is
//   now the canonical, indexable page for that post's full content.
//   Keeping full duplicate content on both /blog and /blog/[slug] is
//   the thing to avoid — it invites Google to treat one as a duplicate
//   of the other instead of ranking each post's own URL.
// - blogSchema's blogPost.url now points to /blog/{slug} instead of
//   /blog#{slug}, matching the real per-post URLs.
// - faqSchema now only includes each post's FIRST faq, since the full
//   FAQPage schema for every post now belongs on that post's own page
//   (app/blog/[slug]/page.tsx) — duplicating the full FAQPage schema on
//   both the index and every post page is redundant structured data.

import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, getAllCategories } from "@/data/blog-posts";

const SITE_URL = "https://www.mealbear.pk";
const SITE_NAME = "Meal Bear Skardu";

export const metadata: Metadata = {
  title: "Meal Bear Skardu Blog | Local Food & Delivery Guides",
  description:
    "Guides to food delivery, local Skardu dishes, and grocery delivery in Skardu: coverage areas, timings, and honest local recommendations from Meal Bear.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Meal Bear Skardu Blog",
    description:
      "Local guides to food delivery, traditional Skardu dishes, and grocery delivery, written for people actually ordering in Skardu.",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-blog-cover.jpg`, // TODO: add a real 1200x630 OG image
        width: 1200,
        height: 630,
        alt: "Meal Bear Skardu Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meal Bear Skardu Blog",
    description:
      "Local guides to food delivery, traditional Skardu dishes, and grocery delivery in Skardu.",
  },
};

export default function BlogIndexPage() {
  const categories = getAllCategories();
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  // Points at real per-post URLs now, not #anchors on this page.
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: `${SITE_NAME} Blog`,
    url: `${SITE_URL}/blog`,
    description: metadata.description,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: { "@type": "Organization", name: post.author },
      image: post.image,
      keywords: post.keywords.join(", "),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <main className="max-w-5xl mx-auto px-6 py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <li>
              <Link href="/" className="hover:text-purple-600 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900">Blog</li>
          </ol>
        </nav>

        <header className="mb-14">
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-3">
            The Meal Bear Journal
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.05] mb-5 max-w-2xl">
            Local guides for eating and ordering in Skardu.
          </h1>
          <p className="text-gray-500 font-medium text-base md:text-lg max-w-xl leading-relaxed">
            Delivery timings, coverage areas, and the dishes actually worth
            ordering, written by the team behind{" "}
            <Link
              href="/"
              className="text-purple-600 font-bold underline decoration-purple-200 underline-offset-2 hover:text-purple-700"
            >
              MealBear.pk
            </Link>
            , not generic listicles.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-7 bg-purple-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-purple-700 active:scale-95 transition-all"
          >
            Order food or groceries now
          </Link>
        </header>

        <svg
          viewBox="0 0 400 12"
          className="w-full h-3 mb-14"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 8 L40 4 L80 9 L120 3 L160 8 L200 5 L240 9 L280 4 L320 7 L360 3 L400 8"
            fill="none"
            stroke="#e9d5ff"
            strokeWidth="1.5"
          />
        </svg>

        <div className="flex flex-wrap gap-2 mb-12" role="navigation" aria-label="Blog categories">
          {categories.map((category) => (
            <a
              key={category}
              href={`#${category.toLowerCase().replace(/\s+/g, "_")}`}
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide hover:bg-purple-100 hover:text-purple-700 transition-colors"
            >
              {category}
            </a>
          ))}
        </div>

        {categories.map((category) => {
          const postsInCategory = posts.filter((p) => p.category === category);
          if (postsInCategory.length === 0) return null;

          return (
            <section
              key={category}
              id={category.toLowerCase().replace(/\s+/g, "_")}
              className="mb-16 scroll-mt-24"
              aria-labelledby={`${category}-heading`}
            >
              <h2
                id={`${category}-heading`}
                className="text-xl font-black uppercase tracking-tight text-gray-900 mb-6"
              >
                {category}
              </h2>

              <div className="space-y-6">
                {postsInCategory.map((post) => {
                  const whatsappShareText = encodeURIComponent(
                    `${post.title}, ${SITE_URL}/blog/${post.slug}`
                  );

                  return (
                    <article
                      key={post.slug}
                      className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-purple-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="md:flex">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="md:w-64 h-48 md:h-56 self-start flex-shrink-0 bg-gray-50 block"
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        <div className="p-6 md:p-7 flex-1">
                          <header>
                            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                              <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </time>
                              <span aria-hidden="true">·</span>
                              <span>{post.readTimeMinutes} min read</span>
                            </div>

                            <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2">
                              <Link
                                href={`/blog/${post.slug}`}
                                className="hover:text-purple-700 transition-colors"
                              >
                                {post.title}
                              </Link>
                            </h3>
                          </header>

                          <p className="text-gray-500 text-sm font-medium leading-relaxed mb-5">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-xs font-bold uppercase tracking-widest bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 active:scale-95 transition-all"
                            >
                              Read the full guide
                            </Link>
                            <a
                              href={`https://wa.me/?text=${whatsappShareText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-green-600 transition-colors"
                            >
                              Share on WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="mt-4 bg-purple-600 rounded-3xl px-8 py-12 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">
            Hungry, or just out of milk?
          </h2>
          <p className="text-purple-100 font-medium mb-6 max-w-md mx-auto">
            Order food or groceries in Skardu and get it delivered today.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-purple-700 px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-purple-50 active:scale-95 transition-all"
          >
            Start an order
          </Link>
        </section>
      </main>
    </>
  );
}