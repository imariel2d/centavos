import "server-only";

const URL = process.env.DIRECTUS_URL ?? "http://localhost:8055";
const TOKEN = process.env.DIRECTUS_TOKEN;

type DirectusList<T> = { data: T[] };
type DirectusItem<T> = { data: T };

export async function directusFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...((init.headers as Record<string, string>) ?? {}),
  };
  if (TOKEN) headers.authorization = `Bearer ${TOKEN}`;

  const r = await fetch(`${URL}${path}`, {
    ...init,
    headers,
    next: { revalidate: 60, ...(init as { next?: object }).next },
  });
  if (!r.ok) {
    throw new Error(`Directus ${init.method ?? "GET"} ${path} → ${r.status} ${await r.text()}`);
  }
  return r.json() as Promise<T>;
}

export async function directusList<T>(path: string): Promise<T[]> {
  const json = await directusFetch<DirectusList<T>>(path);
  return json.data;
}

export async function directusOne<T>(path: string): Promise<T | null> {
  const json = await directusFetch<DirectusItem<T> | DirectusList<T>>(path);
  if (Array.isArray((json as DirectusList<T>).data)) {
    const arr = (json as DirectusList<T>).data;
    return arr[0] ?? null;
  }
  return (json as DirectusItem<T>).data ?? null;
}

// Returns a same-origin URL so the browser never talks to Directus directly.
// Served by app/api/cms/assets/[id]/route.ts.
export function fileUrl(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  return `/api/cms/assets/${id}`;
}
