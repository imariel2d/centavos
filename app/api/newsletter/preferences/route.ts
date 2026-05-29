import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

type Action = "unsubscribe" | "resubscribe";

export async function POST(req: Request) {
  if (!DIRECTUS_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "Servicio no disponible." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const token = String(body.token ?? "").trim();
  const action = body.action as Action;

  if (!token || (action !== "unsubscribe" && action !== "resubscribe")) {
    return NextResponse.json(
      { ok: false, error: "Solicitud inválida." },
      { status: 400 },
    );
  }

  // Look up by unsubscribe_token (stable per subscriber)
  const lookupUrl =
    `${DIRECTUS_URL}/items/newsletter_subscribers` +
    `?filter[unsubscribe_token][_eq]=${encodeURIComponent(token)}` +
    `&limit=1&fields=id,status`;

  const lookup = await fetch(lookupUrl, {
    headers: { authorization: `Bearer ${DIRECTUS_TOKEN}` },
    cache: "no-store",
  });

  if (!lookup.ok) {
    console.error("[newsletter/preferences] lookup failed", lookup.status);
    return NextResponse.json(
      { ok: false, error: "No te encontramos." },
      { status: 404 },
    );
  }

  const { data } = (await lookup.json()) as {
    data: { id: number; status: string }[];
  };
  const subscriber = data[0];
  if (!subscriber) {
    return NextResponse.json(
      { ok: false, error: "No te encontramos." },
      { status: 404 },
    );
  }

  const now = new Date().toISOString();
  const patch =
    action === "unsubscribe"
      ? { status: "unsubscribed", unsubscribed_at: now }
      : { status: "confirmed", unsubscribed_at: null, confirmed_at: now };

  const update = await fetch(
    `${DIRECTUS_URL}/items/newsletter_subscribers/${subscriber.id}`,
    {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
      body: JSON.stringify(patch),
    },
  );

  if (!update.ok) {
    const errBody = await update.text().catch(() => "");
    console.error("[newsletter/preferences] update failed", update.status, errBody);
    return NextResponse.json(
      { ok: false, error: "No pudimos guardar." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
