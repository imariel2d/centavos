import { NextResponse } from "next/server";
import { timingSafeEqual as nodeTimingSafeEqual } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { generateArticle } from "@/lib/claude";

// Constant-time compare to avoid leaking the secret via timing side channels.
// Short-circuits on length mismatch (length isn't sensitive — different
// secrets of different lengths is normal).
function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return nodeTimingSafeEqual(ab, bb);
}

export const runtime = "nodejs";
// Article generation routinely takes 30–60s with adaptive thinking on.
// Bump Vercel's default 10s function timeout. (Hobby plan caps at 60s; Pro 300s.)
export const maxDuration = 300;

const ADMIN_SECRET = process.env.ARTICLE_GENERATOR_SECRET;

/**
 * POST /api/articles/generate
 *
 * Body:    { topic: string, date?: string }
 * Auth:    x-cron-article: <ARTICLE_GENERATOR_SECRET>
 *          (also accepted as `Authorization: Bearer <…>` for manual curl/tests)
 *
 * Triggered by a Directus cron flow — Directus passes the secret via a
 * custom request header, which is friendlier than overloading Authorization
 * (Directus flows already use Authorization for their own auth).
 *
 * Generates a full Centavo article via Claude Opus 4.8 and returns it as
 * a JSON object the editor can drop straight into Directus / TS source.
 */
export async function POST(req: Request) {
  if (!ADMIN_SECRET) {
    console.error("[articles/generate] ARTICLE_GENERATOR_SECRET missing");
    return NextResponse.json(
      { ok: false, error: "Servicio no configurado." },
      { status: 503 },
    );
  }

  // Primary auth path: x-cron-article header (Directus cron flow).
  // Fallback: Authorization: Bearer <secret> (manual curl / scripts).
  const cronHeader = req.headers.get("x-cron-article") ?? "";
  const authHeader = req.headers.get("authorization") ?? "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  const token = cronHeader || bearerToken;
  if (!token || !timingSafeEqual(token, ADMIN_SECRET)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  const dateInput = typeof body.date === "string" ? body.date.trim() : "";

  if (!topic || topic.length > 500) {
    return NextResponse.json(
      { ok: false, error: "Tema inválido (1–500 caracteres)." },
      { status: 400 },
    );
  }

  // Default to today in YYYY-MM-DD if no date is provided.
  const date = dateInput || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { ok: false, error: "Fecha inválida. Usa YYYY-MM-DD." },
      { status: 400 },
    );
  }

  try {
    const { article, raw, usage } = await generateArticle(topic, date);
    return NextResponse.json({ ok: true, article, raw, usage });
  } catch (err) {
    // Surface Anthropic errors with their real status codes so the caller
    // can tell auth failures (401) from rate limits (429) from server errors.
    if (err instanceof Anthropic.APIError) {
      console.error(
        "[articles/generate] anthropic error",
        err.status,
        err.message,
      );
      const status = err.status && err.status >= 400 && err.status < 600
        ? err.status
        : 502;
      return NextResponse.json(
        { ok: false, error: `Anthropic: ${err.message}` },
        { status },
      );
    }

    const message = err instanceof Error ? err.message : String(err);
    console.error("[articles/generate] failed", message);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
