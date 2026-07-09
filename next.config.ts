import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'foodpanda.dhmedia.io',
      },
      {
        protocol: 'https',
        hostname: 'static.tossdown.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dribbble.com', // NEW: Added Dribbble for Skardu Mart
      },
    ],
  },
};

export default nextConfig;