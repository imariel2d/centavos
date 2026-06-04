import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // { protocol: "https", hostname: "cdn.sanity.io" },
      // { protocol: "https", hostname: "images.ctfassets.net" },
    ],
  },

  async headers() {
    return [
      // Security + SEO headers on all responses.
      // Note: do NOT add X-Robots-Tag here — it would override the per-page
      // noindex logic (e.g. /preview/* and /buscar) and break granular indexing.
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "SAMEORIGIN" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
        ],
      },
      // Hashed Next.js static bundles — safe to cache forever (immutable).
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Public image assets.
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // www → non-www (permanent 301). Consolidates link equity into one domain.
      {
        source: "/(.*)",
        has: [{ type: "host", value: "www.centavos.mx" }],
        destination: "https://centavos.mx/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
