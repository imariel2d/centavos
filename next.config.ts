import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // { protocol: "https", hostname: "cdn.sanity.io" },
      // { protocol: "https", hostname: "images.ctfassets.net" },
    ],
  },
  // Disable Next.js's default X-Frame-Options so we can control
  // framing per-route via Content-Security-Policy instead.
  async headers() {
    return [
      {
        // Re-apply SAMEORIGIN to everything except the preview route.
        source: "/((?!preview).*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        // Preview routes: allow embedding from any origin (Directus iframe).
        source: "/preview/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
    ];
  },
};

export default nextConfig;
