/**
 * POST /api/newsletter/digest
 *
 * Sends the weekly digest (last 5 published articles) to all confirmed
 * newsletter subscribers. Called by a Directus Flow on a cron schedule
 * every Tuesday at 8 AM PT (16:00 UTC).
 *
 * Protected by the CRON_SECRET header so only Directus (or a trusted caller)
 * can trigger it.
 */
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";
import { digestEmailHtml, digestEmailSubject } from "@/lib/emails/digest";
import type { DigestArticle } from "@/lib/emails/digest";

export const runtime = "nodejs";

const DIRECTUS_URL   = process.env.DIRECTUS_URL   ?? "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
const SITE_URL       = process.env.NEXT_PUBLIC_SITE_URL ?? "https://centavos.mx";
const NEWSLETTER_CRON_SECRET    = process.env.NEWSLETTER_CRON_SECRET;

// ── Types ─────────────────────────────────────────────────────
interface DArticleRow {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  read_minutes: number;
  status: string;
}

interface DSubscriberRow {
  email: string;
  unsubscribe_token: string;
  status: string;
}

// ── Helpers ───────────────────────────────────────────────────
async function directusGet<T>(path: string): Promise<T> {
  const r = await fetch(`${DIRECTUS_URL}${path}`, {
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      ...(DIRECTUS_TOKEN ? { authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
    },
  });
  if (!r.ok) throw new Error(`Directus GET ${path} → ${r.status}`);
  return r.json() as Promise<T>;
}

function editionLabel(): string {
  return new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year:  "numeric",
    timeZone: "America/Los_Angeles",
  }).format(new Date());
}

// ── Handler ───────────────────────────────────────────────────
export async function POST(req: Request) {
  // 1. Auth — require the secret Directus sends as a header.
  if (NEWSLETTER_CRON_SECRET) {
    const incoming = req.headers.get("x-cron-secret");
    if (incoming !== NEWSLETTER_CRON_SECRET) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!DIRECTUS_TOKEN) {
    return NextResponse.json({ ok: false, error: "DIRECTUS_TOKEN missing" }, { status: 503 });
  }

  // 2. Fetch last 5 published articles.
  const articlesRes = await directusGet<{ data: DArticleRow[] }>(
    "/items/articles?filter[status][_eq]=published&sort=-published_at&limit=5&fields=slug,title,excerpt,category,read_minutes,status",
  );
  const articles: DigestArticle[] = articlesRes.data.map((a) => ({
    slug:        a.slug,
    title:       a.title,
    excerpt:     a.excerpt,
    category:    a.category,
    readMinutes: a.read_minutes ?? 0,
  }));

  if (articles.length === 0) {
    return NextResponse.json({ ok: false, error: "No published articles found" }, { status: 404 });
  }

  // 3. Fetch all confirmed subscribers.
  const subsRes = await directusGet<{ data: DSubscriberRow[] }>(
    "/items/newsletter_subscribers?filter[status][_eq]=confirmed&limit=-1&fields=email,unsubscribe_token,status",
  );
  const subscribers = subsRes.data;

  if (subscribers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No confirmed subscribers" });
  }

  // 4. Send one email per subscriber (sequential to stay within Resend rate limits).
  const edition = editionLabel();
  const subject = digestEmailSubject(edition);

  let sent = 0;
  const errors: string[] = [];

  for (const sub of subscribers) {
    const preferencesUrl = `${SITE_URL}/blog/preferencias?t=${sub.unsubscribe_token}`;
    const html = digestEmailHtml({ articles, preferencesUrl, edition });

    try {
      await sendEmail({ to: sub.email, subject, html });
      sent++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[digest] failed for ${sub.email}:`, msg);
      errors.push(sub.email);
    }
  }

  console.log(`[digest] sent=${sent} errors=${errors.length} total=${subscribers.length}`);

  return NextResponse.json({
    ok:     true,
    sent,
    errors: errors.length,
    total:  subscribers.length,
  });
}
