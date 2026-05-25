import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chip } from "@/components/Chip";
import { Eli5Toggle } from "@/components/Eli5Toggle";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleCard } from "@/components/ArticleCard";
import { ImgPlaceholder } from "@/components/ImgPlaceholder";
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
type SearchParams = { eli5?: string };

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
        ? [{ url: article.heroImage.url, alt: article.heroImage.alt }]
        : [{ url: "/og-default.png", width: 1200, height: 630, alt: article.title }],
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
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const { eli5: eli5Param } = await searchParams;
  const eli5 = eli5Param === "1" && (await getArticleBySlug(slug))?.bodyEli5 != null;

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug, 2);
  const blocks = eli5 && article.bodyEli5 ? article.bodyEli5 : article.body;
  const categorySlug = article.category;
  const catName = categoryName(categorySlug);

  return (
    <>
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

        {/* Title block — colored card */}
        <header className="px-4 pt-3">
          <div className={`rounded-3xl px-5 py-6 ${eli5 ? "bg-mandarina text-bg" : "bg-peach text-ink"}`}>
            <Chip
              bg="var(--color-ink)"
              fg={eli5 ? "var(--color-mandarina)" : "var(--color-bg)"}
              size="md"
            >
              {catName}
            </Chip>
            <h1 className="font-display text-[30px] md:text-[42px] font-extrabold tracking-[-0.034em] leading-[1.02] mt-4 mb-4 text-balance">
              {article.title}
            </h1>
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex-shrink-0"
                style={{ background: eli5 ? "var(--color-bg)" : "var(--color-surface)" }}
                aria-hidden
              />
              <div>
                <div className="font-bold text-[13px]">{article.author.name}</div>
                <div className="text-[11px] opacity-70">
                  {formatDate(article.publishedAt)} · ⏱ {article.readMinutes} min
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ELI5 toggle */}
        <Eli5Toggle on={eli5} />

        {/* Hero image */}
        <div className="px-4 pb-1">
          <ImgPlaceholder
            label={eli5 ? "ilustración amigable" : "foto editorial"}
            height={220}
            bg={eli5 ? "var(--color-peach)" : "var(--color-sand)"}
            fg="var(--color-mandarina-deep)"
            rounded
          />
          {article.heroImage.caption && (
            <p className="text-[11px] text-ink-soft italic mt-1.5 px-1.5 leading-snug">
              {article.heroImage.caption} <span className="not-italic opacity-60">· Foto: Cortesía</span>
            </p>
          )}
        </div>

        {/* Body */}
        <article className="pt-6">
          <ArticleBody blocks={blocks} />
        </article>

        {/* Share */}
        <section className="px-5 pt-6 pb-2">
          <div className="text-[11px] text-ink-soft font-bold tracking-wider uppercase mb-2.5">
            Compártelo con la banda
          </div>
          <div className="flex gap-2 flex-wrap">
            {["WhatsApp", "X", "Copiar"].map((s) => (
              <button
                key={s}
                className="px-4 py-2.5 bg-surface border border-rule rounded-full text-[13px] font-semibold"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

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
