// ──────────────────────────────────────────────────────────────
// Capa de datos. PUNTO DE INTEGRACIÓN del CMS.
//
// Cuando conectes Sanity / Contentful / Strapi / etc.: reemplaza
// el cuerpo de estas funciones por queries al CMS. Los componentes
// y rutas ya consumen esta API — no toques nada más.
// ──────────────────────────────────────────────────────────────
import "server-only";
import { ARTICLES, CATEGORIES, GLOSSARY, STORIES } from "@/data/mock";
import type { Article, Category, CategorySlug, GlossaryTerm, Story } from "@/types";

// ── Artículos ────────────────────────────────────────────────
export async function getAllArticles(): Promise<Article[]> {
  return ARTICLES;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

export async function getArticlesByCategory(category: CategorySlug): Promise<Article[]> {
  return ARTICLES.filter((a) => a.category === category);
}

export async function getLatestArticles(limit = 6): Promise<Article[]> {
  return [...ARTICLES]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, limit);
}

export async function getTrendingArticles(limit = 5): Promise<Article[]> {
  // El CMS podría devolver esto por pageviews; por ahora: latest.
  return getLatestArticles(limit);
}

export async function getRelatedArticles(slug: string, limit = 2): Promise<Article[]> {
  const current = ARTICLES.find((a) => a.slug === slug);
  if (!current) return [];
  return ARTICLES
    .filter((a) => a.slug !== slug && a.category === current.category)
    .concat(ARTICLES.filter((a) => a.slug !== slug && a.category !== current.category))
    .slice(0, limit);
}

export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ARTICLES.filter((a) =>
    a.title.toLowerCase().includes(q) ||
    a.excerpt.toLowerCase().includes(q) ||
    a.category.toLowerCase().includes(q)
  );
}

// ── Categorías ────────────────────────────────────────────────
export async function getAllCategories(): Promise<Category[]> {
  return CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

// ── Glosario ──────────────────────────────────────────────────
export async function getAllGlossaryTerms(): Promise<GlossaryTerm[]> {
  return GLOSSARY;
}

// ── Historias ─────────────────────────────────────────────────
export async function getStories(): Promise<Story[]> {
  return STORIES;
}
