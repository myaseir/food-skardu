// app/blog/[slug]/page.tsx
//
// One URL per post: /blog/best-food-in-skardu-complete-guide, etc.
// This is the piece that was missing from the index-only setup — with
// everything living on /blog behind <details>, Google has exactly one
// URL to rank for every keyword across every post. This route gives
// each guide its own canonical URL, its own <title>/description, its
// own OG image, and its own Article + FAQPage JSON-LD, so each one can
// independently rank and independently show up as a rich result / AI
// Overview citation.
//
// Static generation: generateStaticParams pre-renders every slug at
// build time (SSG), so these pages are plain HTML — fast, and fully
// readable by crawlers with zero JS execution required.
//
// Content is rendered in full, visible in the DOM (not behind
// <details>) — on a dedicated page there's no reason to hide it, and
// fully visible body text is the safer bet for how content is weighed.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/data/blog-posts";
import { renderLinkedText } from "@/lib/render-linked-text";

const SITE_URL = "https://www.mealbear.pk";
const SITE_NAME = "Meal Bear Skardu";

type Props = {
  params: Promise<{ slug: string }>;
};

// Pre-render every post at build time. Add a post to blog-posts.ts and
// it automatically gets its own static page + metadata + JSON-LD next
// build — nothing else to wire up.
export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Up to 3 other posts, prioritizing same category first — cheap
  // internal linking that helps crawlers discover every post from
  // every post, not just from the index page.
  const relatedPosts = [
    ...blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...blogPosts.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.excerpt,
    url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { "@type": "Organization", name: post.author, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    image: post.image,
    keywords: post.keywords.join(", "),
    articleSection: post.category,
  };

  const faqSchema =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  const whatsappShareText = encodeURIComponent(`${post.title}, ${url}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
        {/* Breadcrumb nav, visible version matching the schema above */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <li>
              <Link href="/" className="hover:text-purple-600 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-purple-600 transition-colors">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 normal-case tracking-normal font-bold truncate max-w-[200px]">
              {post.title}
            </li>
          </ol>
        </nav>

        <article>
          <header className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-3">
              {post.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-4">
              {post.title}
            </h1>
            <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed mb-5">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              <span>{post.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>{publishedDate}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readTimeMinutes} min read</span>
            </div>
          </header>

          <div className="w-full h-56 md:h-80 rounded-3xl overflow-hidden bg-gray-50 mb-10">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Full body, rendered directly — this page's only job */}
          <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed mb-12">
            {post.content.map((block, i) =>
              block.startsWith("## ") ? (
                <h2
                  key={i}
                  className="font-black uppercase tracking-wide text-gray-900 text-sm pt-4"
                >
                  {block.replace("## ", "")}
                </h2>
              ) : (
                <p key={i}>{renderLinkedText(block)}</p>
              )
            )}
          </div>

          {/* FAQ block, matches the FAQPage schema above */}
          {post.faqs.length > 0 && (
            <section className="mb-12" aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="font-black uppercase tracking-wide text-gray-900 text-sm mb-5"
              >
                Common questions
              </h2>
              <div className="space-y-5">
                {post.faqs.map((faq, i) => (
                  <div key={i} className="border-b border-gray-100 pb-5">
                    <p className="font-bold text-gray-800 text-sm mb-1.5">
                      {faq.question}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA + share */}
          <div className="flex flex-wrap items-center gap-3 pt-2 pb-12 border-t border-gray-100 mt-2">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-widest bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 active:scale-95 transition-all mt-6"
            >
              Order now
            </Link>
            <a
              href={`https://wa.me/?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-green-600 transition-colors mt-6"
            >
              Share on WhatsApp
            </a>
          </div>
        </article>

        {/* Related posts: cheap internal linking, keeps crawlers moving
            between individual post pages rather than only through /blog */}
        {relatedPosts.length > 0 && (
          <section aria-labelledby="related-heading" className="mb-4">
            <h2
              id="related-heading"
              className="text-xl font-black uppercase tracking-tight text-gray-900 mb-6"
            >
              More guides
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-purple-200 hover:shadow-md transition-all"
                >
                  <div className="h-32 bg-gray-50">
                    <img
                      src={related.image}
                      alt={related.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-1.5">
                      {related.category}
                    </p>
                    <p className="font-extrabold text-gray-900 text-sm leading-snug">
                      {related.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}