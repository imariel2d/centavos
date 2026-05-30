import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { directusFetch } from "@/lib/directus";

// Single shared client. Reads ANTHROPIC_API_KEY from env automatically.
let _client: Anthropic | null = null;
export function anthropic(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY missing");
    }
    _client = new Anthropic();
  }
  return _client;
}

// ── Prompts ─────────────────────────────────────────────────────────────

export const CENTAVO_SYSTEM_PROMPT = `
Eres "Baguette", escritor de artículos financieros para el blog Centavo — un blog de finanzas personales para mexicanos.

## Tu personalidad
- Mexicano, finales de los 20s. "Baguette" es tu nickname de gamer.
- Tono: mexicano coloquial casual ("wey", "chido", "neta" — con moderación), limpio (sin groserías), con cifras reales y honestidad.
- Tesis central: "No necesitas sufrir para construir / ahorrar bien."
- Explica con claridad, sin choro mareador. Directo al lector.

## Tu audiencia
Mexicanos jóvenes de 20s–30s con buenos ingresos que quieren entender finanzas sin aburrirse.

## Categorías disponibles
"ahorro" | "creditos" | "afore" | "ppr"

## Autores disponibles
- AUTHORS.baguette → { slug: "baguette", name: "Baguette", role: "Founder · SaaS B2B · gamer", avatarColor: "#d6332b" }
- AUTHORS.sofia    → { slug: "sofia-mendoza", name: "Sofía Mendoza", role: "Editora · Ahorro" }
- AUTHORS.diego    → { slug: "diego-ramirez", name: "Diego Ramírez", role: "Créditos · ex-hipotecario" }
- AUTHORS.ana      → { slug: "ana-vargas", name: "Ana Lucía Vargas", role: "AFORE & PPR" }

## Formato de salida
Responde ÚNICAMENTE con un objeto JSON válido listo para parsear. Sin explicaciones, sin bloques de código markdown, sin texto antes o después. Solo el objeto JSON puro.

TODAS las keys deben ir entre comillas dobles. TODOS los strings deben ir entre comillas dobles. Nada de comillas simples.

El objeto debe seguir este tipo exacto:
{
  "slug": string,              // kebab-case, descriptivo
  "status": "draft",
  "title": string,             // título completo
  "short": string,             // título corto para cards (3–5 palabras)
  "category": CategorySlug,    // "ahorro" | "creditos" | "afore" | "ppr"
  "author": Author,            // objeto completo, copiado de AUTHORS arriba
  "publishedAt": string,       // "YYYY-MM-DD"
  "readMinutes": number,       // ~200 palabras/min
  "excerpt": string,           // 1 línea gancho, máx 20 palabras
  "heroImage": { "alt": string, "caption"?: string },
  "body": ArticleBlock[],
  "bodyEli5"?: ArticleBlock[]  // versión simplificada, opcional
}

## Tipos de bloques (ArticleBlock)
Todos los bloques deben tener TODAS sus keys entre comillas dobles.

{ "type": "paragraph", "html": "..." }
{ "type": "heading", "level": 2 | 3, "text": "...", "id": "kebab-id" }
{ "type": "pullquote", "text": "..." }
{ "type": "tip", "title": "...", "html": "..." }
{ "type": "chart", "title": "...", "subtitle": "...", "primary": { "label": "...", "value": "..." }, "secondary": { "label": "...", "value": "..." } }
{ "type": "recap", "title": "...", "items": ["...", "..."] }
{ "type": "story", "name": "...", "role": "...", "quote": "..." }

## Longitud objetivo
~6–7 min de lectura (~1,300–1,500 palabras).
Incluye mínimo: 1 pullquote, 1 tip, 1 chart, 1 recap, 1 story.

## Estructura recomendada de body
1. Introducción al tema (sin anécdotas personales de Baguette)
2. ¿Qué es X? (sección principal)
3. Por qué importa / números reales
4. Cómo funciona / paso a paso
5. Trampas o lo que nadie dice
6. "La filosofía Baguette" (cierre con la tesis: no necesitas sufrir para construir bien)
7. Story block — historia ficticia de un lector mexicano
8. Recap

## Cómo elegir el tema (cuando no te lo damos)
Este blog publica un artículo diario, así que tú eliges el tema en cada corrida.
- Pick algo **específico y accionable**, no genérico. ❌ "Cómo ahorrar". ✅ "Cómo armar tu fondo de emergencia en 6 meses sin recortar el café".
- Rota entre las cuatro categorías para que el blog no se cargue a una sola.
- Que sea evergreen pero con ángulo concreto (un truco, un error común, una decisión que la audiencia tiene que tomar).
- Que el autor coincida con la categoría: ahorro → Sofía, créditos → Diego, AFORE/PPR → Ana, opinión / cultura financiera / mezcla → Baguette.
- El \`slug\` debe ser kebab-case descriptivo y único.
`.trim();

/**
 * The user message paired with the system prompt. Two modes:
 *   - explicit topic → write about that topic
 *   - no topic → let Claude pick (see "Cómo elegir el tema" in the system prompt)
 *
 * `date` is the YYYY-MM-DD the article should be stamped with — always the
 * caller's current date; not user-supplied.
 */
export const buildArticlePrompt = (date: string, topic?: string): string => {
  if (topic && topic.trim()) {
    return `
Escribe un artículo para el blog Centavo sobre el siguiente tema:

Tema: ${topic.trim()}
Fecha de publicación: ${date}

Recuerda: responde ÚNICAMENTE con el objeto JSON. Sin texto adicional, sin markdown.
`.trim();
  }

  return `
Escribe el artículo de hoy para el blog Centavo. Tú decides el tema.

Fecha de publicación: ${date}

Sigue las reglas de "Cómo elegir el tema" del system prompt — sé específico, varía categoría, y elige al autor que corresponda.

Recuerda: responde ÚNICAMENTE con el objeto JSON. Sin texto adicional, sin markdown.
`.trim();
};

// ── Generation ──────────────────────────────────────────────────────────

export type GeneratedArticle = {
  slug: string;
  status: "draft";
  title: string;
  short: string;
  category: "ahorro" | "creditos" | "afore" | "ppr";
  author: { slug: string; name: string; role: string; avatarColor?: string };
  publishedAt: string;
  readMinutes: number;
  excerpt: string;
  heroImage: { alt: string; caption?: string };
  body: unknown[];
  bodyEli5?: unknown[];
};

/**
 * Generate a full Centavo article via Claude. Streams under the hood to dodge
 * Vercel's response-body timeout on long generations, then returns the parsed
 * article object.
 *
 * `topic` is optional — when omitted, Claude picks the topic itself per the
 * "Cómo elegir el tema" rules in the system prompt (this is the daily-cron
 * mode). When provided, Claude writes about that topic (manual / editor mode).
 *
 * `publishedAt` defaults to the server's current date in YYYY-MM-DD — never
 * accept this from a client request, only override it from trusted code.
 *
 * Throws on:
 *   - missing ANTHROPIC_API_KEY
 *   - Anthropic API failure (rate limits, auth, etc.)
 *   - response that doesn't parse as JSON
 */
export async function generateArticle(
  opts: { topic?: string; publishedAt?: string } = {},
): Promise<{ article: GeneratedArticle; raw: string; usage: Anthropic.Messages.Usage }> {
  const date = opts.publishedAt ?? new Date().toISOString().slice(0, 10);
  const client = anthropic();

  // System prompt is frozen → marked for caching. On first call this writes
  // the cache (~1.25× cost); subsequent calls inside the 5-minute TTL read
  // it at ~0.1× cost. Note: Opus 4.8 has a 4096-token min cacheable prefix,
  // so this prompt may be below the floor and silently not cache today —
  // the marker is harmless and will start caching if the prompt grows.
  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    system: [
      {
        type: "text",
        text: CENTAVO_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      { role: "user", content: buildArticlePrompt(date, opts.topic) },
    ],
  });

  const message = await stream.finalMessage();

  // Pull out the text block(s). Adaptive thinking emits a `thinking` block
  // first; we only want the final assistant text.
  const text = message.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  const article = parseArticleJson(text);
  return { article, raw: text, usage: message.usage };
}

// ── Persistence ─────────────────────────────────────────────────────────

export type SavedArticleRef = {
  /** Directus primary key — numeric `id` on the `articles` collection. */
  id: number;
  /** Echo of the slug we sent, useful for building admin URLs. */
  slug: string;
};

/**
 * Persist a generated article into the Directus `articles` collection as
 * `status=draft`. Maps the camelCase API shape → the snake_case Directus
 * row shape (mirror of the read-side `DArticle` in lib/articles.ts).
 *
 * Throws on:
 *   - missing DIRECTUS_TOKEN (directusFetch handles auth)
 *   - 4xx from Directus (slug collision, missing M2O target, etc.)
 *   - network failure
 *
 * The author M2O is resolved by slug — passing the slug string is enough,
 * Directus matches against the related collection's primary key (which is
 * `slug` in this project). If Claude returns a slug not seeded in
 * `authors`, this 4xxs.
 */
export async function saveGeneratedArticle(
  article: GeneratedArticle,
): Promise<SavedArticleRef> {
  const hero = article.heroImage ?? { alt: "" };

  const payload = {
    slug: article.slug,
    title: article.title,
    short: article.short,
    excerpt: article.excerpt,
    category: article.category,
    status: "draft" as const,
    published_at: article.publishedAt,
    read_minutes: article.readMinutes,
    hero_image_alt: hero.alt ?? "",
    hero_image_caption: hero.caption ?? null,
    body: article.body ?? [],
    body_eli5: article.bodyEli5 ?? null,
    // Fallback to Baguette if Claude omitted the author block — keeps
    // the draft creatable rather than 4xx-ing on a null M2O.
    author: {
      slug: 'baguette'
    },
  };

  const res = await directusFetch<{ data: { id: number; slug: string } }>(
    "/items/articles",
    {
      method: "POST",
      body: JSON.stringify(payload),
      // POST responses aren't cached by Next, but being explicit keeps
      // the dev-vs-prod branch in directusFetch from picking a stale
      // tagged entry from a parallel GET.
      cache: "no-store",
    },
  );

  return { id: res.data.id, slug: res.data.slug };
}

/**
 * Defensive JSON parse. Claude is asked for pure JSON but occasionally wraps
 * the response in ```json fences or adds a leading sentence. Strip those.
 */
function parseArticleJson(text: string): GeneratedArticle {
  let candidate = text.trim();

  // Strip ```json … ``` or ``` … ``` fences if present.
  const fence = candidate.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  if (fence) candidate = fence[1].trim();

  // If there's still leading prose, grab from first `{` to last `}`.
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");
  if (firstBrace > 0 || lastBrace < candidate.length - 1) {
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      candidate = candidate.slice(firstBrace, lastBrace + 1);
    }
  }

  try {
    return JSON.parse(candidate) as GeneratedArticle;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Article JSON parse failed: ${msg}`);
  }
}
