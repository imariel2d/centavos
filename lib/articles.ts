// ──────────────────────────────────────────────────────────────
// Capa de datos. Routes/components solo consumen estos selectores.
// Branches on USE_MOCK_DATA env flag:
//   - false (default) → Directus (docker-compose stack)
//   - true            → data/mock.ts (offline / preview / tests)
// ──────────────────────────────────────────────────────────────
import "server-only";
import { directusFetch, directusList, directusOne, fileUrl } from "@/lib/directus";
import { USE_MOCK_DATA } from "@/lib/data-source";
import {
  ARTICLES as MOCK_ARTICLES,
  AUTHORS as MOCK_AUTHORS,
  CATEGORIES as MOCK_CATEGORIES,
  GLOSSARY as MOCK_GLOSSARY,
  HOME_PAGE as MOCK_HOME_PAGE,
  STORIES as MOCK_STORIES,
} from "@/data/mock";
import type {
  Article,
  ArticleBlock,
  Author,
  Category,
  CategoryFaq,
  CategorySlug,
  GlossaryTerm,
  HomeAd,
  HomeApp,
  HomeAppFeature,
  HomePageData,
  HomeStarterStep,
  ImageRef,
  Story,
} from "@/types";

// ── Directus row shapes (snake_case) ─────────────────────────
type Row<T> = T & { status?: string };

interface DCategoryRelatedTerm { glossary_terms_slug: DGlossary | string | null }
interface DCategory {
  slug: CategorySlug;
  name: string;
  blurb: string;
  count: number;
  seo_title?: string | null;
  seo_description?: string | null;
  intro_body?: ArticleBlock[] | null;
  faq?: CategoryFaq[] | null;
  related_terms?: DCategoryRelatedTerm[] | null;
}
interface DAuthor      { slug: string; name: string; role: string; avatar_color?: string | null }
interface DStory       { id: number; name: string; role: string; quote: string }
interface DGlossary    { slug: string; term: string; category: CategorySlug; definition: string; eli5: string }
interface DArticle {
  slug: string;
  title: string;
  short: string;
  excerpt: string;
  category: CategorySlug;
  author: DAuthor | string;
  published_at: string;
  date_updated: string | null;  // Directus system field
  read_minutes: number;
  hero_image: string | null;
  hero_image_alt: string | null;
  hero_image_caption: string | null;
  body: ArticleBlock[] | null;
  body_eli5: ArticleBlock[] | null;
}

// ── Directus → domain mappers ────────────────────────────────
const FALLBACK_AUTHOR: Author = { slug: "centavo", name: "Centavo", role: "" };

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

// Author may arrive as the joined object (fields=*,author.*), a bare slug
// string, or null when the M2O is empty / the related row was deleted.
function resolveAuthor(raw: DArticle["author"] | null | undefined): Author {
  if (!raw) return FALLBACK_AUTHOR;
  if (typeof raw === "string") return { slug: raw, name: raw, role: "" };
  if (typeof raw === "object" && raw.slug) return mapAuthor(raw);
  return FALLBACK_AUTHOR;
}

const mapArticle = (a: Row<DArticle>): Article => ({
  slug: a.slug,
  title: a.title ?? "",
  short: a.short ?? a.title ?? "",
  excerpt: a.excerpt ?? "",
  category: a.category,
  author: resolveAuthor(a.author),
  publishedAt: a.published_at ?? new Date().toISOString(),
  updatedAt: a.date_updated ?? undefined,
  readMinutes: a.read_minutes ?? 0,
  heroImage: mapHero(a),
  body: Array.isArray(a.body) ? a.body : [],
  bodyEli5: Array.isArray(a.body_eli5) ? a.body_eli5 : undefined,
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
  // Single-item endpoint doesn't take a filter; enforce published here.
  if (!row || row.status !== "published") return null;
  return mapArticle(row);
}

/** Fetches any article regardless of status — for draft previews only. */
export async function getArticleDraftBySlug(slug: string): Promise<Article | null> {
  if (USE_MOCK_DATA) return MOCK_ARTICLES.find((a) => a.slug === slug) ?? null;
  const row = await directusOne<Row<DArticle>>(
    `/items/articles/${encodeURIComponent(slug)}?${ARTICLE_FIELDS}`,
  );
  if (!row) return null;
  return mapArticle(row);
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
// Counts come from a live aggregate over published articles — the `count`
// field on the Directus category row is ignored (treat it as a placeholder).
async function getArticleCountsByCategory(): Promise<Record<string, number>> {
  if (USE_MOCK_DATA) {
    const counts: Record<string, number> = {};
    for (const a of MOCK_ARTICLES) counts[a.category] = (counts[a.category] ?? 0) + 1;
    return counts;
  }
  const json = await directusFetch<{ data: { category: string; count: string | number }[] }>(
    `/items/articles?aggregate[count]=*&groupBy[]=category&${PUB}`,
  );
  return Object.fromEntries(json.data.map((r) => [r.category, Number(r.count)]));
}

/**
 * Latest `published_at` per category — used by the sitemap to emit a real
 * `<lastmod>` instead of "now" for every category route.
 */
export async function getLatestArticleDateByCategory(): Promise<Record<string, string>> {
  if (USE_MOCK_DATA) {
    const map: Record<string, string> = {};
    for (const a of MOCK_ARTICLES) {
      if (!map[a.category] || +new Date(a.publishedAt) > +new Date(map[a.category])) {
        map[a.category] = a.publishedAt;
      }
    }
    return map;
  }
  const json = await directusFetch<{
    data: { category: string; max: { published_at: string } }[];
  }>(`/items/articles?aggregate[max]=published_at&groupBy[]=category&${PUB}`);
  return Object.fromEntries(json.data.map((r) => [r.category, r.max.published_at]));
}

// Deep fields for the detail endpoint — list endpoint skips M2M to stay light.
const CATEGORY_DEEP_FIELDS = "fields=*,related_terms.glossary_terms_slug.*";

function mapCategory(row: DCategory, count: number): Category {
  const relatedTerms = Array.isArray(row.related_terms)
    ? row.related_terms
        .map((r) => r.glossary_terms_slug)
        .filter((t): t is DGlossary => !!t && typeof t === "object")
    : undefined;
  return {
    slug: row.slug,
    name: row.name,
    blurb: row.blurb,
    count,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    introBody:
      Array.isArray(row.intro_body) && row.intro_body.length > 0 ? row.intro_body : undefined,
    faq: Array.isArray(row.faq) && row.faq.length > 0 ? row.faq : undefined,
    relatedTerms: relatedTerms && relatedTerms.length > 0 ? relatedTerms : undefined,
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const counts = await getArticleCountsByCategory();
  if (USE_MOCK_DATA) {
    return MOCK_CATEGORIES.map((c) => ({ ...c, count: counts[c.slug] ?? 0 }));
  }
  const rows = await directusList<DCategory>(`/items/categories?${PUB}&sort=name&limit=-1`);
  return rows.map((c) => mapCategory(c, counts[c.slug] ?? 0));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (USE_MOCK_DATA) {
    const row = MOCK_CATEGORIES.find((c) => c.slug === slug);
    if (!row) return null;
    const counts = await getArticleCountsByCategory();
    return { ...row, count: counts[row.slug] ?? 0 };
  }
  const row = await directusOne<Row<DCategory>>(
    `/items/categories/${encodeURIComponent(slug)}?${CATEGORY_DEEP_FIELDS}`,
  );
  if (!row) return null;
  // Single-item endpoint doesn't take a filter; enforce published here.
  if (row.status !== "published") return null;
  const counts = await getArticleCountsByCategory();
  return mapCategory(row, counts[row.slug] ?? 0);
}

// ── Authors ──────────────────────────────────────────────────
export async function getAllAuthors(): Promise<Author[]> {
  if (USE_MOCK_DATA) return Object.values(MOCK_AUTHORS);
  const rows = await directusList<Row<DAuthor>>(`/items/authors?${PUB}&sort=name&limit=-1`);
  return rows.map(mapAuthor);
}

// ── Counts ───────────────────────────────────────────────────
export async function getArticleCount(): Promise<number> {
  if (USE_MOCK_DATA) return MOCK_ARTICLES.length;
  const json = await directusFetch<{ data: { count: string | number }[] }>(
    `/items/articles?aggregate[count]=*&${PUB}`,
  );
  return Number(json.data[0]?.count ?? 0);
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

// ── Home Page (singleton with M2M article relations) ────────
// Directus junction rows arrive as:
//   { articles_slug: DArticle, sort: number, color?: string }
interface DJunctionRow {
  articles_slug: Row<DArticle> | string | null;
  sort?: number;
  color?: "peach" | "sand" | "sky";
}

interface DHomePage {
  starter_steps?: DJunctionRow[];
  trending?: DJunctionRow[];
  more_articles?: DJunctionRow[];
  ad_enabled?: boolean | null;
  ad_label?: string | null;
  ad_brand?: string | null;
  ad_headline?: string | null;
  ad_body?: string | null;
  ad_cta?: string | null;
  ad_href?: string | null;
  ad_image?: string | null;
  ad_image_alt?: string | null;
  app_enabled?: boolean | null;
  app_kicker?: string | null;
  app_headline?: string | null;
  app_body?: string | null;
  app_store_url?: string | null;
  app_play_url?: string | null;
  app_screenshot?: string | null;
  app_screenshot_alt?: string | null;
  app_features?: unknown;
}

const HOME_FIELDS = [
  "starter_steps.sort",
  "starter_steps.color",
  "starter_steps.articles_slug.*",
  "starter_steps.articles_slug.author.*",
  "trending.sort",
  "trending.articles_slug.*",
  "trending.articles_slug.author.*",
  "more_articles.sort",
  "more_articles.articles_slug.*",
  "more_articles.articles_slug.author.*",
  "ad_enabled",
  "ad_label",
  "ad_brand",
  "ad_headline",
  "ad_body",
  "ad_cta",
  "ad_href",
  "ad_image",
  "ad_image_alt",
  "app_enabled",
  "app_kicker",
  "app_headline",
  "app_body",
  "app_store_url",
  "app_play_url",
  "app_screenshot",
  "app_screenshot_alt",
  "app_features",
].join(",");

function isPublishedArticle(
  r: DJunctionRow,
): r is DJunctionRow & { articles_slug: Row<DArticle> } {
  return (
    r.articles_slug != null &&
    typeof r.articles_slug === "object" &&
    r.articles_slug.status === "published"
  );
}

function junctionToArticles(rows: DJunctionRow[] | undefined): Article[] {
  if (!rows) return [];
  return rows.filter(isPublishedArticle).map((r) => mapArticle(r.articles_slug));
}

function junctionToStarters(rows: DJunctionRow[] | undefined): HomeStarterStep[] {
  if (!rows) return [];
  return rows.filter(isPublishedArticle).map((r) => ({
    article: mapArticle(r.articles_slug),
    color: r.color ?? "peach",
  }));
}

function mapHomeAd(row: DHomePage): HomeAd | null {
  if (!row.ad_enabled) return null;
  const brand = row.ad_brand?.trim();
  const headline = row.ad_headline?.trim();
  const href = row.ad_href?.trim();
  if (!brand || !headline || !href) return null;
  return {
    label: row.ad_label?.trim() || "Anuncio",
    brand,
    headline,
    body: row.ad_body?.trim() ?? "",
    cta: row.ad_cta?.trim() || "Ver más",
    href,
    imageUrl: fileUrl(row.ad_image),
    imageAlt: row.ad_image_alt?.trim() ?? "",
  };
}

// Directus list-interface rows are untyped JSON — validate each entry.
function parseAppFeatures(raw: unknown): HomeAppFeature[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((f) => {
    if (f == null || typeof f !== "object") return [];
    const { emoji, title, description } = f as Record<string, unknown>;
    if (typeof title !== "string" || !title.trim()) return [];
    return [{
      emoji: typeof emoji === "string" ? emoji.trim() : "",
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
    }];
  });
}

function mapHomeApp(row: DHomePage): HomeApp | null {
  if (!row.app_enabled) return null;
  const headline = row.app_headline?.trim();
  if (!headline) return null;
  return {
    kicker: row.app_kicker?.trim() || "Nuestra app · iOS y Android",
    headline,
    body: row.app_body?.trim() ?? "",
    storeUrl: row.app_store_url?.trim() || undefined,
    playUrl: row.app_play_url?.trim() || undefined,
    screenshotUrl: fileUrl(row.app_screenshot),
    screenshotAlt: row.app_screenshot_alt?.trim() || "App Centavos",
    features: parseAppFeatures(row.app_features),
  };
}

const EMPTY_HOME: HomePageData = {
  starterSteps: [],
  trending: [],
  moreArticles: [],
  ad: null,
  app: null,
};

const HOME_AD_FIELDS = [
  "ad_enabled", "ad_label", "ad_brand", "ad_headline",
  "ad_body", "ad_cta", "ad_href", "ad_image", "ad_image_alt",
].join(",");

/** Fetches just the ad slot — for pages that don't need the rest of the home payload. */
export async function getHomeAd(): Promise<HomeAd | null> {
  if (USE_MOCK_DATA) return MOCK_HOME_PAGE.ad;
  try {
    const row = await directusOne<DHomePage>(
      `/items/home_page?fields=${HOME_AD_FIELDS}`,
    );
    return row ? mapHomeAd(row) : null;
  } catch {
    return null;
  }
}

export async function getHomePage(): Promise<HomePageData> {
  if (USE_MOCK_DATA) return MOCK_HOME_PAGE;
  try {
    const row = await directusOne<DHomePage>(
      `/items/home_page?fields=${HOME_FIELDS}`,
    );
    if (!row) return EMPTY_HOME;
    return {
      starterSteps: junctionToStarters(row.starter_steps),
      trending: junctionToArticles(row.trending),
      moreArticles: junctionToArticles(row.more_articles),
      ad: mapHomeAd(row),
      app: mapHomeApp(row),
    };
  } catch {
    // Collection may not exist yet — gracefully degrade.
    return EMPTY_HOME;
  }
}
