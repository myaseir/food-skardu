import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // TODO: optimizeCss requires the `critters` package as a dependency —
  // if it's not installed, this makes the Vercel build fail entirely
  // (nothing deploys). Confirm `npm ls critters` succeeds before
  // re-enabling; commented out until confirmed.
  // experimental: {
  //   optimizeCss: true,
  // },

  images: {
    // Custom loader restores real optimization (WebP, responsive srcset,
    // lazy sizing — all Core Web Vitals / SEO factors) for Cloudinary
    // images specifically, instead of disabling optimization site-wide.
    loader: "custom",
    loaderFile: "./cloudinary-loader.ts",

    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],

    // Cache optimized images longer so repeat requests don't re-trigger optimization
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },

  // Removes the "X-Powered-By: Next.js" response header — small security/
  // hardening hygiene step, not itself an SEO factor but standard practice.
  poweredByHeader: false,

  // Enforces trailing-slash consistency so /restaurant/pizza-king and
  // /restaurant/pizza-king/ aren't treated as two different URLs by
  // Google — avoids duplicate-content dilution across your restaurant
  // pages. Only add this if it matches how your actual routes/sitemap
  // are already structured — flipping it after launch can create a
  // wave of redirects Google has to re-crawl.
  // trailingSlash: false,
};

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyzer(nextConfig);