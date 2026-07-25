import { MetadataRoute } from "next";

const BASE_URL = "https://www.mealbear.pk";

// Single source of truth for disallowed paths — every bot block below
// pulls from this, so adding a new private route (e.g. a future
// /account or /order-history page) only needs to be added once instead
// of copy-pasted into 8 separate rule blocks.
const DISALLOWED_PATHS = [
  "/checkout",
  "/_next/*",
  "/api/*",
  "/cart",
];

const AI_BOTS = [
  "GPTBot", // OpenAI (ChatGPT)
  "ChatGPT-User", // ChatGPT browsing/plugin fetches
  "PerplexityBot", // Perplexity
  "ClaudeBot", // Anthropic (Claude)
  "anthropic-ai", // Anthropic (legacy tag, still seen)
  "Google-Extended", // Google Gemini / AI Overviews training
  "Applebot-Extended", // Apple Intelligence
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOWED_PATHS,
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}