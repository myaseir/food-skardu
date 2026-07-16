import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Cache optimized images longer so repeat requests don't re-trigger optimization
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    // Skip Next's own optimization pipeline — since Cloudinary already
    // handles resizing/compression server-side, this avoids the sharp
    // step entirely and sidesteps the 500 for Cloudinary-hosted images.
    unoptimized: true,
  },
};

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyzer(nextConfig);