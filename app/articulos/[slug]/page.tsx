import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleShell } from "@/components/ArticleShell";
import { ArticleCard } from "@/components/ArticleCard";
import { DebugLog } from "@/components/DebugLog";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/articles";
import { articleJsonLd, breadcrumbsJsonLd, SITE } from "@/lib/seo";
import { categoryName, formatDate } from "@/lib/format";

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const url = `${SITE.url}/articulos/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    authors: [{ name: article.author.name }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url,
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      section: categoryName(article.category),
      images: article.heroImage.url
        ? [{ url: `${SITE.url}${article.heroImage.url}`, alt: article.heroImage.alt }]
        : [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug, 2);
  const categorySlug = article.category;
  const catName = categoryName(categorySlug);
  const publishedLabel = `${formatDate(article.publishedAt)} · ⏱ ${article.readMinutes} min`;

  return (
    <>
      <DebugLog label={`article:${article.slug}`} data={{ article, related }} />
      <Header />

      <main className="mx-auto max-w-screen-md pb-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="px-4 pt-4 text-[11px] text-ink-soft flex items-center gap-1.5">
          <Link href="/" className="hover:text-ink">Inicio</Link>
          <span aria-hidden>›</span>
          <Link href={`/categorias/${categorySlug}`} className="hover:text-ink">{catName}</Link>
          <span aria-hidden>›</span>
          <span className="text-ink truncate max-w-[60%]">{article.short}</span>
        </nav>

        {/* Client shell handles eli5 toggle via searchParams */}
        <Suspense>
          <ArticleShell
            body={article.body}
            bodyEli5={article.bodyEli5 ?? null}
            heroImageUrl={article.heroImage.url}
            heroImageAlt={article.heroImage.alt}
            heroCaption={article.heroImage.caption}
            categoryName={catName}
            title={article.title}
            authorName={article.author.name}
            publishedLabel={publishedLabel}
            slug={article.slug}
          />
        </Suspense>

        {/* Related */}
        {related.length > 0 && (
          <section className="px-4 pt-8">
            <h2 className="font-display text-xl font-extrabold tracking-[-0.025em] mb-3 px-1">
              También te puede latir
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {related.map((r, i) => (
                <ArticleCard key={r.slug} article={r} variant="compact" accentIndex={i + 1} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* JSON-LD */}
      <Script
        id={`ld-article-${article.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
      />
      <Script
        id={`ld-breadcrumbs-${article.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([
              { name: "Inicio", url: "/" },
              { name: catName, url: `/categorias/${categorySlug}` },
              { name: article.short, url: `/articulos/${article.slug}` },
            ])
          ),
        }}
      />
    </>
  );
}
