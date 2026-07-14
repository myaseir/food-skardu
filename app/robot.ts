import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.mealbear.pk";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/checkout",
          "/_next/*",
        ],
      },
      {
        userAgent: "GPTBot", // OpenAI (ChatGPT)
        allow: "/",
        disallow: ["/checkout"],
      },
      {
        userAgent: "ChatGPT-User", // ChatGPT browsing/plugin fetches
        allow: "/",
        disallow: ["/checkout"],
      },
      {
        userAgent: "PerplexityBot", // Perplexity
        allow: "/",
        disallow: ["/checkout"],
      },
      {
        userAgent: "ClaudeBot", // Anthropic (Claude)
        allow: "/",
        disallow: ["/checkout"],
      },
      {
        userAgent: "anthropic-ai", // Anthropic (legacy tag, still seen)
        allow: "/",
        disallow: ["/checkout"],
      },
      {
        userAgent: "Google-Extended", // Google Gemini / AI Overviews training
        allow: "/",
        disallow: ["/checkout"],
      },
      {
        userAgent: "Applebot-Extended", // Apple Intelligence
        allow: "/",
        disallow: ["/checkout"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}