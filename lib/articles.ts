// ──────────────────────────────────────────────────────────────
// Capa de datos. Routes/components solo consumen estos selectores.
// Branches on USE_MOCK_DATA env flag:
//   - false (default) → Directus (docker-compose stack)
//   - true            → data/mock.ts (offline / preview / tests)
// ──────────────────────────────────────────────────────────────
import "server-only";
import { directusList, directusOne, fileUrl } from "@/lib/directus";
import { USE_MOCK_DATA } from "@/lib/data-source";
import {
  ARTICLES as MOCK_ARTICLES,
  AUTHORS as MOCK_AUTHORS,
  CATEGORIES as MOCK_CATEGORIES,
  GLOSSARY as MOCK_GLOSSARY,
  STORIES as MOCK_STORIES,
} from "@/data/mock";
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

// ── Directus row shapes (snake_case) ─────────────────────────
type Row<T> = T & { status?: string };

interface DCategory  { slug: CategorySlug; name: string; blurb: string; count: number }
interface DAuthor    { slug: string; name: string; role: string; avatar_color?: string | null }
interface DStory     { id: number; name: string; role: string; quote: string }
interface DGlossary  { slug: string; term: string; category: CategorySlug; definition: string; eli5: string }
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

// ── Directus → domain mappers ────────────────────────────────
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

const PUB = "filter[status][_eq]=published";
const ARTICLE_FIELDS = "fields=*,author.*";

// ── Articles ─────────────────────────────────────────────────
export async function getAllArticles(): Promise<Article[]> {
  if (USE_MOCK_DATA) return MOCK_ARTICLES;
  const rows = await directusList<Row<DArticle>>(
    `/items/articles?${PUB}&${ARTICLE_FIELDS}&sort=-published_at&limit=-1`,
  );
  return rows.map(mapArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (USE_MOCK_DATA) return MOCK_ARTICLES.find((a) => a.slug === slug) ?? null;
  const row = await directusOne<Row<DArticle>>(
    `/items/articles/${encodeURIComponent(slug)}?${ARTICLE_FIELDS}`,
  );
  return row ? mapArticle(row) : null;
}

export async function getArticlesByCategory(category: CategorySlug): Promise<Article[]> {
  if (USE_MOCK_DATA) return MOCK_ARTICLES.filter((a) => a.category === category);
  const rows = await directusList<Row<DArticle>>(
    `/items/articles?${PUB}&filter[category][_eq]=${category}&${ARTICLE_FIELDS}&sort=-published_at&limit=-1`,
  );
  return rows.map(mapArticle);
}

export async function getLatestArticles(limit = 6): Promise<Article[]> {
  if (USE_MOCK_DATA) {
    return [...MOCK_ARTICLES]
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      .slice(0, limit);
  }
  const rows = await directusList<Row<DArticle>>(
    `/items/articles?${PUB}&${ARTICLE_FIELDS}&sort=-published_at&limit=${limit}`,
  );
  return rows.map(mapArticle);
}

export async function getTrendingArticles(limit = 5): Promise<Article[]> {
  // Trending == latest until we hook up pageviews.
  return getLatestArticles(limit);
}

export async function getRelatedArticles(slug: string, limit = 2): Promise<Article[]> {
  const current = await getArticleBySlug(slug);
  if (!current) return [];

  if (USE_MOCK_DATA) {
    return MOCK_ARTICLES
      .filter((a) => a.slug !== slug && a.category === current.category)
      .concat(MOCK_ARTICLES.filter((a) => a.slug !== slug && a.category !== current.category))
      .slice(0, limit);
  }

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

  if (USE_MOCK_DATA) {
    const needle = q.toLowerCase();
    return MOCK_ARTICLES.filter((a) =>
      a.title.toLowerCase().includes(needle) ||
      a.excerpt.toLowerCase().includes(needle) ||
      a.category.toLowerCase().includes(needle)
    );
  }

  const enc = encodeURIComponent(q);
  const rows = await directusList<Row<DArticle>>(
    `/items/articles?${PUB}&filter[_or][0][title][_icontains]=${enc}&filter[_or][1][excerpt][_icontains]=${enc}&filter[_or][2][category][_icontains]=${enc}&${ARTICLE_FIELDS}&sort=-published_at&limit=50`,
  );
  return rows.map(mapArticle);
}

// ── Categories ───────────────────────────────────────────────
export async function getAllCategories(): Promise<Category[]> {
  if (USE_MOCK_DATA) return MOCK_CATEGORIES;
  return directusList<DCategory>(`/items/categories?${PUB}&sort=name&limit=-1`);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (USE_MOCK_DATA) return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  return directusOne<DCategory>(`/items/categories/${encodeURIComponent(slug)}`);
}

// ── Authors ──────────────────────────────────────────────────
export async function getAllAuthors(): Promise<Author[]> {
  if (USE_MOCK_DATA) return Object.values(MOCK_AUTHORS);
  const rows = await directusList<Row<DAuthor>>(`/items/authors?${PUB}&sort=name&limit=-1`);
  return rows.map(mapAuthor);
}

// ── Glossary ─────────────────────────────────────────────────
export async function getAllGlossaryTerms(): Promise<GlossaryTerm[]> {
  if (USE_MOCK_DATA) return MOCK_GLOSSARY;
  return directusList<DGlossary>(`/items/glossary_terms?${PUB}&sort=term&limit=-1`);
}

// ── Stories ──────────────────────────────────────────────────
export async function getStories(): Promise<Story[]> {
  if (USE_MOCK_DATA) return MOCK_STORIES;
  const rows = await directusList<DStory>(`/items/stories?${PUB}&limit=-1`);
  return rows.map(({ name, role, quote }) => ({ name, role, quote }));
}
