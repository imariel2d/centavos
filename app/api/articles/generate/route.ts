import { NextResponse } from "next/server";
import { timingSafeEqual as nodeTimingSafeEqual } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { generateArticle, saveGeneratedArticle, type SavedArticleRef } from "@/lib/claude";

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
 * Body:    { topic?: string }    // optional — omit to let Claude pick
 * Auth:    x-cron-article: <ARTICLE_GENERATOR_SECRET>
 *          (also accepted as `Authorization: Bearer <…>` for manual curl/tests)
 *
 * Triggered by a Directus cron flow — Directus passes the secret via a
 * custom request header, which is friendlier than overloading Authorization
 * (Directus flows already use Authorization for their own auth).
 *
 * The publish date is **always** the server's current date — not accepted
 * from the request — so a stale or spoofed `date` field can't end up on a
 * draft. If `topic` is omitted (the cron path), Claude picks the topic
 * itself per the rules in the system prompt.
 *
 * Generates a full Centavo article via Claude Opus 4.8, saves it into the
 * Directus `articles` collection as `status=draft`, and returns both the
 * article object and the saved row's ID.
 *
 * Save failures don't fail the request — we always return 200 with the
 * generated article in the body, plus `saved: null` and `saveError`. This
 * way Directus' webhook retry doesn't re-trigger Claude (which would burn
 * tokens). Operators can replay manually from the response payload.
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

  // Body is optional. Only `topic` is honored — anything else is ignored.
  const body = await req.json().catch(() => ({}));
  const rawTopic = typeof body.topic === "string" ? body.topic.trim() : "";

  if (rawTopic.length > 500) {
    return NextResponse.json(
      { ok: false, error: "Tema demasiado largo (máx 500 caracteres)." },
      { status: 400 },
    );
  }
  // Empty string → undefined so generateArticle takes the "Claude picks" path.
  const topic = rawTopic || undefined;

  try {
    const { article, raw, usage } = await generateArticle({ topic });

    // Try to persist; never let a save failure cascade into "regenerate".
    let saved: SavedArticleRef | null = null;
    let saveError: string | null = null;
    try {
      saved = await saveGeneratedArticle(article);
    } catch (err) {
      saveError = err instanceof Error ? err.message : String(err);
      console.error("[articles/generate] directus save failed", saveError);
    }

    return NextResponse.json({
      ok: saveError === null,
      article,
      saved,
      saveError,
      raw,
      usage,
    });
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
