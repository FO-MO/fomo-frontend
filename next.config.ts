import type { NextConfig } from "next";

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  "http://backend.fxcybqfhhqbfavdv.centralindia.azurecontainer.io";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${BACKEND}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
