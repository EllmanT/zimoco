import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    formats: ["image/webp"],
    qualities: [70, 75, 78, 80, 85],
    // Images uploaded to Zimoco's Prismic repo (only this repo's path is allowed).
    remotePatterns: [{ protocol: "https", hostname: "images.prismic.io", pathname: "/xcgt84rk/**" }],
  },
  async redirects() {
    return [
      { source: "/stock", destination: "/showroom", permanent: true },
      { source: "/stock/:slug", destination: "/showroom", permanent: true },
      { source: "/compare", destination: "/showroom", permanent: true },
      { source: "/source", destination: "/find-my-car", permanent: true },
      // The single local Hilux page became the FM-based Hilux Double Cab page.
      { source: "/showroom/toyota-hilux", destination: "/showroom/toyota-hilux-double-cab", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
