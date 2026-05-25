// Proxies Directus /assets/:id so the browser never talks to Directus directly.
// Forwards range/etag headers so <img> caching still works.
import { NextRequest } from "next/server";

const DIRECTUS_URL   = process.env.DIRECTUS_URL   ?? "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

const FORWARD_REQ  = ["range", "if-none-match", "if-modified-since", "accept"];
const FORWARD_RES  = ["content-type", "content-length", "content-range", "accept-ranges", "cache-control", "etag", "last-modified"];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const qs = req.nextUrl.search; // pass through ?width=... transforms etc.

  const headers: Record<string, string> = {};
  for (const h of FORWARD_REQ) {
    const v = req.headers.get(h);
    if (v) headers[h] = v;
  }
  if (DIRECTUS_TOKEN) headers.authorization = `Bearer ${DIRECTUS_TOKEN}`;

  const upstream = await fetch(
    `${DIRECTUS_URL}/assets/${encodeURIComponent(id)}${qs}`,
    { headers, cache: "no-store" },
  );

  const resHeaders = new Headers();
  for (const h of FORWARD_RES) {
    const v = upstream.headers.get(h);
    if (v) resHeaders.set(h, v);
  }
  return new Response(upstream.body, { status: upstream.status, headers: resHeaders });
}
