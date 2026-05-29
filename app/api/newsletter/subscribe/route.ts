import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { sendEmail } from "@/lib/resend";
import { welcomeEmailHtml, welcomeEmailSubject } from "@/lib/emails/welcome";

export const runtime = "nodejs";

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://centavos.mx";

// Intentionally permissive — server-side guard against blank/garbage,
// not a full RFC 5322 validator. The browser already does the strict check.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  if (!DIRECTUS_TOKEN) {
    console.error("[newsletter/subscribe] DIRECTUS_TOKEN missing");
    return NextResponse.json(
      { ok: false, error: "Servicio no disponible." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const source = String(body.source ?? "homepage_cta").slice(0, 64);

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Correo inválido." },
      { status: 400 },
    );
  }

  const confirmToken = randomBytes(32).toString("hex");
  const unsubscribeToken = randomBytes(32).toString("hex");

  const r = await fetch(`${DIRECTUS_URL}/items/newsletter_subscribers`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
    body: JSON.stringify({
      email,
      source,
      status: "confirmed", // we welcome them immediately; no double opt-in
      confirmed_at: new Date().toISOString(),
      confirm_token: confirmToken,
      unsubscribe_token: unsubscribeToken,
    }),
  });

  if (r.ok) {
    // Best-effort welcome email — never fail the subscription if Resend hiccups.
    sendWelcome(email, unsubscribeToken).catch((err) => {
      console.error("[newsletter/subscribe] welcome email failed", err);
    });
    return NextResponse.json({ ok: true });
  }

  const errBody = await r.json().catch(() => ({}));
  const code = errBody?.errors?.[0]?.extensions?.code;

  // Duplicate email → treat as success so we don't leak who's on the list.
  if (code === "RECORD_NOT_UNIQUE") {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  console.error("[newsletter/subscribe] directus error", r.status, errBody);
  return NextResponse.json(
    { ok: false, error: "No pudimos suscribirte. Intenta más tarde." },
    { status: 500 },
  );
}

async function sendWelcome(email: string, unsubscribeToken: string): Promise<void> {
  const preferencesUrl = `${SITE_URL}/preferencias?t=${unsubscribeToken}`;
  await sendEmail({
    to: email,
    subject: welcomeEmailSubject,
    html: welcomeEmailHtml({ preferencesUrl }),
  });
}
