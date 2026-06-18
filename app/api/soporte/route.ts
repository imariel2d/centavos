import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

// Intentionally permissive — server-side guard against blank/garbage,
// not a full RFC 5322 validator. The browser already does the strict check.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Length limits — kept in sync with the maxLength/minLength on the form.
const TITLE_MAX = 120;
const EMAIL_MAX = 254;
const DESC_MIN = 5;
const DESC_MAX = 2000;

export async function POST(req: Request) {
  if (!DIRECTUS_TOKEN) {
    console.error("[soporte] DIRECTUS_TOKEN missing");
    return NextResponse.json(
      { ok: false, error: "Servicio no disponible." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));

  // Honeypot — real users never fill this hidden field.
  if (String(body.company ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const title = String(body.title ?? "").trim();
  const userEmail = String(body.user_email ?? "").trim().toLowerCase();
  const description = String(body.description ?? "").trim();

  if (!title || title.length > TITLE_MAX) {
    return NextResponse.json(
      { ok: false, error: "Escribe un asunto." },
      { status: 400 },
    );
  }
  if (!userEmail || userEmail.length > EMAIL_MAX || !EMAIL_RE.test(userEmail)) {
    return NextResponse.json(
      { ok: false, error: "Correo inválido." },
      { status: 400 },
    );
  }
  if (description.length < DESC_MIN || description.length > DESC_MAX) {
    return NextResponse.json(
      { ok: false, error: "Cuéntanos un poco más en el mensaje." },
      { status: 400 },
    );
  }

  const r = await fetch(`${DIRECTUS_URL}/items/app_support`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
    body: JSON.stringify({ title, user_email: userEmail, description }),
  });

  if (r.ok) {
    return NextResponse.json({ ok: true });
  }

  const errBody = await r.json().catch(() => ({}));
  console.error("[soporte] directus error", r.status, errBody);
  return NextResponse.json(
    { ok: false, error: "No pudimos enviar tu mensaje. Intenta más tarde." },
    { status: 500 },
  );
}
