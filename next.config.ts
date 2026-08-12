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
      // El blog ya no está disponible: todo /blog/* (y las URLs viejas que
      // apuntaban al blog) se redirige a la home con 301.
      { source: "/blog",             destination: "/", permanent: true },
      { source: "/blog/:path*",      destination: "/", permanent: true },
      { source: "/articulos/:slug",  destination: "/", permanent: true },
      { source: "/categorias/:slug", destination: "/", permanent: true },
      { source: "/glosario",         destination: "/", permanent: true },
      { source: "/nosotros",         destination: "/", permanent: true },
      { source: "/buscar",           destination: "/", permanent: true },
      { source: "/preferencias",     destination: "/", permanent: true },
      { source: "/privacidad",       destination: "/", permanent: true },
      { source: "/terminos",         destination: "/", permanent: true },
      // La landing de la app vivía en /app; ahora es la página raíz.
      { source: "/app",              destination: "/",                      permanent: true },
    ];
  },
};

export default nextConfig;
