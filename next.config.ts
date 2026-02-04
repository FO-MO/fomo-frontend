import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'h7j2k5hp-1337.inc1.devtunnels.ms',
      },
    ],
  },
};

export default nextConfig;
