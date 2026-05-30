import { NextResponse } from "next/server";
import { timingSafeEqual as nodeTimingSafeEqual } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import {
  generateArticle,
  saveGeneratedArticle,
  type GeneratedArticle,
  type SavedArticleRef,
} from "@/lib/claude";

// ──────────────────────────────────────────────────────────────────────
// MOCK MODE — flip to `true` to skip the Claude call and persist the
// canned MOCK_ARTICLE below instead. Useful for exercising the Directus
// save path (auth → DIRECTUS_TOKEN scopes → author M2O resolution → schema
// shape) without burning Anthropic tokens or waiting 30–60s per attempt.
// MUST stay `false` in production — flip it locally for smoke tests, then
// flip back before committing.
// ──────────────────────────────────────────────────────────────────────
const USE_MOCK_ARTICLE = true;

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
      { ok: false, error: "Service not configured." },
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
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  // Body is optional. Only `topic` is honored — anything else is ignored.
  const body = await req.json().catch(() => ({}));
  const rawTopic = typeof body.topic === "string" ? body.topic.trim() : "";

  if (rawTopic.length > 500) {
    return NextResponse.json(
      { ok: false, error: "Topic too long (max 500 characters)." },
      { status: 400 },
    );
  }
  // Empty string → undefined so generateArticle takes the "Claude picks" path.
  const topic = rawTopic || undefined;

  try {
    // Mock mode bypasses Claude entirely. Auth still applies above — never
    // expose a path that writes to Directus without the shared secret.
    let article: GeneratedArticle;
    let raw: string;
    let usage: Anthropic.Messages.Usage | null;
    if (USE_MOCK_ARTICLE) {
      console.warn("[articles/generate] MOCK MODE — Claude call skipped");
      article = MOCK_ARTICLE;
      raw = JSON.stringify(MOCK_ARTICLE, null, 2);
      usage = null;
    } else {
      const result = await generateArticle({ topic });
      article = result.article;
      raw = result.raw;
      usage = result.usage;
    }

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
      mock: USE_MOCK_ARTICLE,
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

// ──────────────────────────────────────────────────────────────────────
// Mock article — only used when USE_MOCK_ARTICLE is true (top of file).
// Shape matches GeneratedArticle. publishedAt is intentionally static
// so the same row hits Directus on every mock invocation (slug collision
// on the second hit is expected — that's how you know save→Directus is
// actually wired up).
// ──────────────────────────────────────────────────────────────────────
const MOCK_ARTICLE: GeneratedArticle = {
  slug: "aportaciones-voluntarias-afore-oxxo-50-pesos",
  status: "draft",
  title:
    "Aportaciones voluntarias a tu AFORE: cómo meter $50 desde el OXXO (y por qué sí mueven la aguja)",
  short: "Voluntarias a tu AFORE",
  category: "afore",
  author: {
    slug: "",
    name: "Ana Lucía Vargas",
    role: "AFORE & PPR",
  },
  publishedAt: "2026-05-29",
  readMinutes: 7,
  excerpt:
    "Meter $50 a tu AFORE desde el OXXO suena ridículo, pero el interés compuesto no opina igual.",
  heroImage: {
    alt: "Persona pagando en una tienda de conveniencia con una tarjeta",
    caption: "Sí, puedes ahorrar para tu retiro mientras compras un café.",
  },
  body: [
    {
      type: "paragraph",
      html: "Hay una idea muy clavada en la cabeza de muchos: que el ahorro para el retiro es cosa de cuando ya ganes mucho, cuando ya tengas casa, cuando ya cumplas 40. Spoiler: para entonces te perdiste lo mejor del juego, que es el tiempo. Y lo más raro es que hoy puedes empezar con $50 desde la misma tienda donde compras tus Sabritas.",
    },
    {
      type: "paragraph",
      html: "Hoy te quiero hablar de las <strong>aportaciones voluntarias a tu AFORE</strong>: qué son, cómo meterlas literalmente desde un OXXO o 7-Eleven, y por qué cantidades que parecen ridículas sí terminan importando. Sin choro, con números.",
    },
    {
      type: "heading",
      level: 2,
      text: "¿Qué son las aportaciones voluntarias?",
      id: "que-son",
    },
    {
      type: "paragraph",
      html: "Tu AFORE recibe dinero de tres lugares: lo que aporta tu patrón, lo que aporta el gobierno, y lo que tú decidas meter por tu cuenta. Eso último son las <strong>aportaciones voluntarias</strong>: dinero extra que tú agregas a tu cuenta individual para que crezca invertido durante años.",
    },
    {
      type: "paragraph",
      html: "No son obligatorias, no te las descuentan, y tú decides cuándo y cuánto. Hay de varios tipos, pero las dos que te importan son: las de <strong>corto plazo</strong> (puedes sacarlas a partir de 2 o 6 meses según tu AFORE) y las de <strong>largo plazo</strong>, que tienen beneficios fiscales pero las amarras hasta tu retiro.",
    },
    {
      type: "tip",
      title: "Empieza por las de corto plazo",
      html: "Si te da miedo amarrar tu dinero, arranca con aportaciones de corto plazo. Te dan la tranquilidad de poder retirarlas si de plano lo necesitas, y aun así ya están generando rendimiento. El miedo a 'no poder sacarlo' es lo que frena a la mayoría.",
    },
    {
      type: "heading",
      level: 2,
      text: "Cómo meterlas desde el OXXO (en serio)",
      id: "como-meterlas",
    },
    {
      type: "paragraph",
      html: "Esto es lo que casi nadie sabe: no necesitas ir a una sucursal ni llenar formatos eternos. Tienes varias rutas y todas son rápidas:",
    },
    {
      type: "paragraph",
      html: "<strong>1. App de tu AFORE.</strong> Casi todas (Profuturo, XXI Banorte, Coppel, Citibanamex, etc.) ya tienen app donde domicilias una aportación recurrente o metes un monto único con tu tarjeta. Lo configuras en 5 minutos.",
    },
    {
      type: "paragraph",
      html: "<strong>2. En tienda de conveniencia.</strong> En OXXO, 7-Eleven, Farmacias del Ahorro y otras puedes depositar a tu AFORE dando tu CURP o tu número de cuenta. Desde $50. El dinero llega a tu cuenta individual en un par de días.",
    },
    {
      type: "paragraph",
      html: "<strong>3. App AforeMóvil / Afore en tu celular.</strong> La app oficial te deja aportar, ver tu saldo y hasta localizar tu AFORE si no sabes cuál tienes. Útil si nunca te has metido a revisar.",
    },
    {
      type: "pullquote",
      text: "El mejor momento para empezar fue hace diez años. El segundo mejor es el próximo café que te compres.",
    },
    {
      type: "heading",
      level: 2,
      text: "Por qué $50 sí mueven la aguja",
      id: "por-que-importa",
    },
    {
      type: "paragraph",
      html: "Ya sé, $50 suena a nada. Pero el truco no es el monto, es la <strong>constancia multiplicada por el tiempo</strong>. Las AFORE invierten tu dinero en algo llamado SIEFORE, y a largo plazo han dado rendimientos reales decentes. Veamos qué pasa si metes poquito pero siempre.",
    },
    {
      type: "chart",
      title: "Aportar $500 al mes durante 30 años",
      subtitle:
        "Supuesto: rendimiento anual promedio de ~6% nominal. Cifras ilustrativas.",
      primary: {
        label: "Lo que tú metiste de tu bolsa",
        value: "$180,000",
      },
      secondary: {
        label: "Lo que tendrías al final",
        value: "~$500,000",
      },
    },
    {
      type: "paragraph",
      html: "Metiste 180 mil pesos repartidos en tres décadas (como $16 al día), y terminas con medio millón. La diferencia, esos ~320 mil pesos extra, no salieron de tu bolsa: los puso el <strong>interés compuesto</strong>. Y ojo, eso solo es lo voluntario, encima de lo que ya aporta tu patrón.",
    },
    {
      type: "paragraph",
      html: "Ahora, ¿$50 una vez? Pues no, eso no te jubila. La gracia es convertirlo en hábito: $50 a la semana, $200 al mes, lo que aguante tu presupuesto sin que te duela. La cantidad crece contigo conforme ganas más.",
    },
    {
      type: "heading",
      level: 2,
      text: "Lo que nadie te dice",
      id: "trampas",
    },
    {
      type: "paragraph",
      html: "<strong>Beneficio fiscal real:</strong> las aportaciones voluntarias de largo plazo (las que dejas amarradas para el retiro) son deducibles de impuestos hasta cierto tope. Si haces declaración anual, puedes recuperar una parte vía devolución del SAT. Mucha gente deja ese dinero en la mesa.",
    },
    {
      type: "paragraph",
      html: "<strong>La comisión importa:</strong> las AFORE cobran una comisión sobre saldo. Hoy son bajas y reguladas, pero si tu AFORE da malos rendimientos consistentes, puedes cambiarte. Revisa el comparativo de la CONSAR una vez al año, no más.",
    },
    {
      type: "paragraph",
      html: "<strong>No la confundas con tu cuenta de banco:</strong> esto es para el retiro. Si vas a estar metiendo y sacando cada mes, mejor un fondo de emergencia aparte. La AFORE brilla cuando la dejas trabajar en paz por años.",
    },
    {
      type: "heading",
      level: 2,
      text: "La filosofía Baguette",
      id: "filosofia",
    },
    {
      type: "paragraph",
      html: "Aquí en Centavo lo decimos siempre: <strong>no necesitas sufrir para construir bien</strong>. El retiro no se gana apretándote la vida y comiendo arroz blanco tres años. Se gana metiendo cantidades chiquitas, automáticas, que ni sientes, y dejando que el tiempo haga el trabajo pesado.",
    },
    {
      type: "paragraph",
      html: "$50 desde el OXXO no te van a hacer rico mañana. Pero te entrenan el hábito, te quitan el miedo, y te ponen en el juego. Y estar en el juego a los 27 vale muchísimo más que estar perfecto a los 47.",
    },
    {
      type: "story",
      name: "Karla",
      role: "Diseñadora freelance, 29 años, CDMX",
      quote:
        "Como soy freelance pensaba que la AFORE no era para mí porque no tengo patrón. Empecé metiendo $200 al mes desde la app, sin que me doliera. Lo bonito es que en marzo deduje parte en mi declaración y el SAT me devolvió una lana. Ahora subí a $600 y ni lo extraño.",
    },
    {
      type: "recap",
      title: "Para llevar",
      items: [
        "Las aportaciones voluntarias son dinero extra que TÚ metes a tu AFORE, aparte de lo de tu patrón.",
        "Puedes empezar con $50 desde OXXO, 7-Eleven, la app de tu AFORE o AforeMóvil.",
        "$500 al mes por 30 años pueden volverse ~$500,000, y solo pusiste $180,000.",
        "Las de largo plazo son deducibles de impuestos: el SAT te puede devolver una parte.",
        "El truco no es el monto, es la constancia por el tiempo. Empieza hoy, sube después.",
      ],
    },
  ],
  bodyEli5: [
    {
      type: "paragraph",
      html: "Tu AFORE es una alcancía gigante para cuando seas viejito. Tu trabajo le mete dinero, pero tú también puedes echarle de tu bolsa.",
    },
    {
      type: "paragraph",
      html: "Puedes meter desde $50 en el OXXO con tu CURP. Suena a nada, pero ese dinero crece solito durante muchos años hasta volverse mucho más.",
    },
    {
      type: "paragraph",
      html: "Lo importante no es meter mucho de golpe, sino meter poquito seguido. Si lo dejas ahí y no lo tocas, el tiempo lo multiplica. Y no tienes que sufrir para lograrlo.",
    },
  ],
};
