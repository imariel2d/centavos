// Disable all caching for every route under /preview/* so editors always
// see the latest draft data from Directus without stale Next.js or CDN cache.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
