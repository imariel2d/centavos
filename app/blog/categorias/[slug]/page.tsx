import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleBody } from "@/components/ArticleBody";
import { HomeAd } from "@/components/home/HomeAd";
import {
  getAllCategories,
  getArticlesByCategory,
  getCategoryBySlug,
  getHomeAd,
} from "@/lib/articles";
import {
  breadcrumbsJsonLd,
  collectionPageJsonLd,
  faqPageJsonLd,
  SITE,
} from "@/lib/seo";
import { categoryName, formatDate, CATEGORY_BG, CATEGORY_COLOR_VAR } from "@/lib/format";
import type { CategorySlug } from "@/types";

export const revalidate = 3600;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  const name = cat.name ?? "Categoría";
  const blurb = cat.blurb ?? "";
  const title = cat.seoTitle ?? `${name} · ${cat.count} artículos`;
  const description =
    cat.seoDescription ??
    `${blurb}. Artículos sobre ${name.toLowerCase()} explicados sin choros y para principiantes.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}/blog/categorias/${cat.slug}` },
    openGraph: {
      title: cat.seoTitle ?? `${name} · Centavos`,
      description: cat.seoDescription ?? blurb,
      url: `${SITE.url}/blog/categorias/${cat.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const [articles, allCategories, ad] = await Promise.all([
    getArticlesByCategory(slug as CategorySlug),
    getAllCategories(),
    getHomeAd(),
  ]);
  const others = allCategories.filter((c) => c.slug !== cat.slug);
  const catIndex = allCategories.findIndex((c) => c.slug === cat.slug);

  const name = cat.name ?? "Categoría";
  const blurb = cat.blurb ?? "";
  const count = cat.count ?? 0;
  // catIndex is -1 if the slug isn't in the listing (e.g. unpublished)
  const position = catIndex >= 0 ? catIndex + 1 : 1;
  const total = allCategories.length || 1;

  return (
    <>
      <Header />

      <main className="mx-auto max-w-screen-md pb-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="px-4 pt-4 text-[11px] text-ink-soft flex items-center gap-1.5">
          <Link href="/" className="hover:text-ink">Inicio</Link>
          <span aria-hidden>›</span>
          <span className="text-ink">{name}</span>
        </nav>

        {/* Header bloque de color */}
        <header className={`${CATEGORY_BG[slug as CategorySlug] ?? "bg-peach"} px-6 py-7 md:py-10 mt-3 mx-4 rounded-3xl`}>
          <div className="text-[11px] font-extrabold tracking-wider text-mandarina-deep uppercase mb-2.5">
            Categoría · {String(position).padStart(2, "0")}/{total}
          </div>
          <h1 className="font-display text-[56px] md:text-[80px] font-extrabold tracking-[-0.05em] leading-[0.9] mb-3">
            {name}
          </h1>
          <p className="text-[15px] md:text-base text-ink/80 leading-relaxed mb-5">
            {blurb ? `${blurb}. ` : ""}Aprende a manejar el tema desde cero, sin tecnicismos y sin que te quieran vender productos.
          </p>
          <div className="flex gap-5 text-[12px] text-ink">
            <div>
              <div className="font-display text-[22px] font-extrabold tracking-[-0.025em]">{count}</div>
              <div className="opacity-70">artículos</div>
            </div>
            <div>
              <div className="font-display text-[22px] font-extrabold tracking-[-0.025em]">~6 min</div>
              <div className="opacity-70">lectura promedio</div>
            </div>
          </div>
        </header>

        {/* Intro largo (SEO) */}
        {cat.introBody && (
          <section className="pt-7 pb-2">
            <ArticleBody blocks={cat.introBody} />
          </section>
        )}

        {/* Lista de artículos */}
        <section className="px-4 pt-6">
          {articles.length === 0 ? (
            <p className="text-center text-ink-soft py-12">Aún no hay artículos en esta categoría.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {articles.map((a, i) => (
                <ArticleCard key={a.slug} article={a} variant={i === 0 ? "feature" : "default"} />
              ))}
            </div>
          )}
        </section>

        {ad && <HomeAd ad={ad} placement="category_below_grid" />}

        {/* Lista en formato horizontal */}
        {articles.length > 1 && (
          <section className="px-5 pt-8">
            <h2 className="font-display text-base font-extrabold tracking-[-0.013em] mb-2">
              Todos los artículos
            </h2>
            <ul className="divide-y divide-rule">
              {articles.map((a) => (
                <li key={a.slug}>
                  <Link href={`/app/blog/articulos/${a.slug}`} className="flex gap-3.5 items-start py-4">
                    <div
                      className="w-16 h-16 rounded-xl flex-shrink-0"
                      style={{ background: CATEGORY_COLOR_VAR[a.category] ?? "var(--color-peach)" }}
                      aria-hidden
                    />
                    <div className="flex-1">
                      <div className="text-[10px] text-mandarina-deep font-extrabold tracking-wider uppercase">
                        {categoryName(a.category)}
                      </div>
                      <div className="font-display text-[16px] font-bold tracking-[-0.013em] leading-tight my-1">
                        {a.title}
                      </div>
                      <div className="text-[11px] text-ink-soft">
                        {a.author.name} · ⏱ {a.readMinutes} min · {formatDate(a.publishedAt)}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        {cat.faq && cat.faq.length > 0 && (
          <section className="px-4 pt-10">
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.022em] mb-4 px-1">
              Preguntas frecuentes sobre {name.toLowerCase()}
            </h2>
            <div className="space-y-2">
              {cat.faq.map((f, i) => (
                <details
                  key={i}
                  className="bg-surface border border-rule rounded-2xl px-5 py-4 group"
                >
                  <summary className="font-display text-[16px] font-bold tracking-[-0.013em] cursor-pointer list-none flex items-center justify-between gap-3">
                    <span>{f.question}</span>
                    <span className="text-mandarina-deep text-xl leading-none group-open:rotate-45 transition-transform" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="text-[14px] leading-relaxed mt-3 text-ink-soft">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Términos relacionados (internal linking) */}
        {cat.relatedTerms && cat.relatedTerms.length > 0 && (
          <section className="px-4 pt-10">
            <h2 className="font-display text-base font-extrabold tracking-[-0.013em] mb-3 px-1">
              Términos relacionados
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {cat.relatedTerms.map((t) => (
                <Link
                  key={t.slug}
                  href={`/glosario#${t.slug}`}
                  className="bg-peach text-mandarina-deep rounded-2xl px-4 py-3 text-[13px] font-bold card-hover"
                >
                  {t.term}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Otras categorías */}
        {others.length > 0 && (
          <section className="bg-bg px-4 py-7 mt-8">
            <div className="text-[11px] text-ink-soft font-bold tracking-wider uppercase mb-3 px-1">
              Otras categorías
            </div>
            <div className="grid grid-cols-2 gap-2">
              {others.map((c) => (
                <Link
                  key={c.slug}
                  href={`/app/blog/categorias/${c.slug}`}
                  className="bg-surface border border-rule rounded-2xl px-4 py-3.5 card-hover"
                >
                  <div className="font-display text-lg font-extrabold tracking-[-0.025em]">{c.name ?? "Categoría"}</div>
                  <div className="text-[11px] text-ink-soft mt-1">{c.count ?? 0} artículos</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <Script
        id={`ld-cat-${cat.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([
              { name: "Inicio", url: "/" },
              { name, url: `/blog/categorias/${cat.slug}` },
            ])
          ),
        }}
      />
      <Script
        id={`ld-cat-collection-${cat.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageJsonLd({
              name,
              description: cat.seoDescription ?? blurb,
              url: `/blog/categorias/${cat.slug}`,
              itemCount: articles.length,
            })
          ),
        }}
      />
      {cat.faq && cat.faq.length > 0 && (
        <Script
          id={`ld-cat-faq-${cat.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(cat.faq)) }}
        />
      )}
    </>
  );
}
