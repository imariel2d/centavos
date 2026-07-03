import type { MetadataRoute } from "next";
import {
  getAllArticles,
  getAllCategories,
  getLatestArticleDateByCategory,
} from "@/lib/articles";
import { SITE } from "@/lib/seo";

// Re-generate at most once per hour — avoids hitting Directus on every crawl.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, latestByCategory] = await Promise.all([
    getAllArticles(),
    getAllCategories(),
    getLatestArticleDateByCategory(),
  ]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`,              lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE.url}/blog`,          lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE.url}/blog/glosario`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/blog/nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => {
    const latest = latestByCategory[c.slug];
    return {
      url: `${SITE.url}/blog/categorias/${c.slug}`,
      lastModified: latest ? new Date(latest) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    };
  });

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE.url}/blog/articulos/${a.slug}`,
    lastModified: new Date(a.updatedAt ?? a.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
