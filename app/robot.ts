import { MetadataRoute } from "next";

const BASE_URL = "https://www.mealbear.pk";

// Pages with no search value. Add any future private route here
// (for example /account or /order-history) and it applies to every bot.
//
// Do NOT add "/_next/". That folder holds the JavaScript and CSS Google
// needs to render your pages, and blocking it can hurt how they are indexed.
const DISALLOWED_PATHS = ["/checkout", "/cart", "/invoice", "/api/"];

// AI search and assistant crawlers. Listing them makes it explicit that they
// are welcome, so they can quote and link to Meal Bear in answers.
const AI_BOTS = [
  "GPTBot", // OpenAI (ChatGPT)
  "OAI-SearchBot", // ChatGPT search results
  "ChatGPT-User", // ChatGPT browsing on a user's behalf
  "PerplexityBot", // Perplexity
  "Perplexity-User", // Perplexity fetching a page for a user
  "ClaudeBot", // Anthropic (Claude)
  "Claude-SearchBot", // Claude search
  "Claude-User", // Claude fetching a page for a user
  "anthropic-ai", // Anthropic (legacy tag, still seen)
  "Google-Extended", // Controls Gemini training only. Does not affect Google Search or AI Overviews
  "Applebot-Extended", // Apple Intelligence
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Googlebot, Bingbot and every other crawler.
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      // One group for all AI bots. A bot with its own group ignores the "*"
      // group, so DISALLOWED_PATHS is repeated here (once, not per bot).
      {
        userAgent: AI_BOTS,
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}