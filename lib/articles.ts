// ──────────────────────────────────────────────────────────────
// Capa de datos. Conectada a Directus (ver docker-compose.yml).
// Componentes y rutas no cambian: consumen esta API.
// ──────────────────────────────────────────────────────────────
import "server-only";
import { directusList, directusOne, fileUrl } from "@/lib/directus";
import type {
  Article,
  ArticleBlock,
  Author,
  Category,
  CategorySlug,
  GlossaryTerm,
  ImageRef,
  Story,
} from "@/types";

// ── Tipos de fila Directus (snake_case en DB) ────────────────
type Row<T> = T & { status?: string };

interface DCategory {
  slug: CategorySlug;
  name: string;
  blurb: string;
  count: number;
}
interface DAuthor {
  slug: string;
  name: string;
  role: string;
  avatar_color?: string | null;
}
interface DStory {
  id: number;
  name: string;
  role: string;
  quote: string;
}
interface DGlossary {
  slug: string;
  term: string;
  category: CategorySlug;
  definition: string;
  eli5: string;
}
interface DArticle {
  slug: string;
  title: string;
  short: string;
  excerpt: string;
  category: CategorySlug;
  author: DAuthor | string;
  published_at: string;
  read_minutes: number;
  hero_image: string | null;
  hero_image_alt: string | null;
  hero_image_caption: string | null;
  body: ArticleBlock[] | null;
  body_eli5: ArticleBlock[] | null;
}

// ── Mappers Directus → dominio ───────────────────────────────
const mapAuthor = (a: DAuthor): Author => ({
  slug: a.slug,
  name: a.name,
  role: a.role,
  avatarColor: a.avatar_color ?? undefined,
});

const mapHero = (a: DArticle): ImageRef => ({
  url: fileUrl(a.hero_image),
  alt: a.hero_image_alt ?? "",
  caption: a.hero_image_caption ?? undefined,
});

const mapArticle = (a: Row<DArticle>): Article => ({
  slug: a.slug,
  title: a.title,
  short: a.short,
  excerpt: a.excerpt,
  category: a.category,
  author: typeof a.author === "string"
    ? { slug: a.author, name: a.author, role: "" }
    : mapAuthor(a.author),
  publishedAt: a.published_at,
  readMinutes: a.read_minutes,
  heroImage: mapHero(a),
  body: a.body ?? [],
  bodyEli5: a.body_eli5 ?? undefined,
});

// Only fetch published rows
const PUB = "filter[status][_eq]=published";
const ARTICLE_FIELDS = "fields=*,author.*";

// ── Artículos ────────────────────────────────────────────────
export async function getAllArticles(): Promise<Article[]> {
  const rows = await directusList<Row<DArticle>>(
    `/items/articles?${PUB}&${ARTICLE_FIELDS}&sort=-published_at&limit=-1`,
  );
  return rows.map(mapArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const row = await directusOne<Row<DArticle>>(
    `/items/articles/${encodeURIComponent(slug)}?${ARTICLE_FIELDS}`,
  );
  return row ? mapArticle(row) : null;
}

export async function getArticlesByCategory(category: CategorySlug): Promise<Article[]> {
  const rows = await directusList<Row<DArticle>>(
    `/items/articles?${PUB}&filter[category][_eq]=${category}&${ARTICLE_FIELDS}&sort=-published_at&limit=-1`,
  );
  return rows.map(mapArticle);
}

export async function getLatestArticles(limit = 6): Promise<Article[]> {
  const rows = await directusList<Row<DArticle>>(
    `/items/articles?${PUB}&${ARTICLE_FIELDS}&sort=-published_at&limit=${limit}`,
  );
  return rows.map(mapArticle);
}

export async function getTrendingArticles(limit = 5): Promise<Article[]> {
  // CMS no tracks pageviews yet; trending == latest.
  return getLatestArticles(limit);
}

export async function getRelatedArticles(slug: string, limit = 2): Promise<Article[]> {
  const current = await getArticleBySlug(slug);
  if (!current) return [];
  const sameCat = await directusList<Row<DArticle>>(
    `/items/articles?${PUB}&filter[category][_eq]=${current.category}&filter[slug][_neq]=${encodeURIComponent(slug)}&${ARTICLE_FIELDS}&sort=-published_at&limit=${limit}`,
  );
  if (sameCat.length >= limit) return sameCat.slice(0, limit).map(mapArticle);
  const fill = await directusList<Row<DArticle>>(
    `/items/articles?${PUB}&filter[category][_neq]=${current.category}&filter[slug][_neq]=${encodeURIComponent(slug)}&${ARTICLE_FIELDS}&sort=-published_at&limit=${limit - sameCat.length}`,
  );
  return [...sameCat, ...fill].map(mapArticle);
}

export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.trim();
  if (!q) return [];
  const enc = encodeURIComponent(q);
  const rows = await directusList<Row<DArticle>>(
    `/items/articles?${PUB}&filter[_or][0][title][_icontains]=${enc}&filter[_or][1][excerpt][_icontains]=${enc}&filter[_or][2][category][_icontains]=${enc}&${ARTICLE_FIELDS}&sort=-published_at&limit=50`,
  );
  return rows.map(mapArticle);
}

// ── Categorías ────────────────────────────────────────────────
export async function getAllCategories(): Promise<Category[]> {
  return directusList<DCategory>(`/items/categories?${PUB}&sort=name&limit=-1`);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return directusOne<DCategory>(`/items/categories/${encodeURIComponent(slug)}`);
}

// ── Glosario ──────────────────────────────────────────────────
export async function getAllGlossaryTerms(): Promise<GlossaryTerm[]> {
  return directusList<DGlossary>(`/items/glossary_terms?${PUB}&sort=term&limit=-1`);
}

// ── Historias ─────────────────────────────────────────────────
export async function getStories(): Promise<Story[]> {
  const rows = await directusList<DStory>(`/items/stories?${PUB}&limit=-1`);
  return rows.map(({ name, role, quote }) => ({ name, role, quote }));
}
