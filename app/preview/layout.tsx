import type { Metadata } from "next";

// Disable all caching for every route under /preview/* so editors always
// see the latest draft data from Directus without stale Next.js or CDN cache.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Prevent search engines from indexing draft/preview pages.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
