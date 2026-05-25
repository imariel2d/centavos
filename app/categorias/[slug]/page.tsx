import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import {
  getAllCategories,
  getArticlesByCategory,
  getCategoryBySlug,
} from "@/lib/articles";
import { breadcrumbsJsonLd, SITE } from "@/lib/seo";
import { categoryName, formatDate } from "@/lib/format";
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
  return {
    title: `${cat.name} · ${cat.count} artículos`,
    description: `${cat.blurb}. Artículos sobre ${cat.name.toLowerCase()} explicados sin choros y para principiantes.`,
    alternates: { canonical: `${SITE.url}/categorias/${cat.slug}` },
    openGraph: {
      title: `${cat.name} · Centavo`,
      description: cat.blurb,
      url: `${SITE.url}/categorias/${cat.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const articles = await getArticlesByCategory(slug as CategorySlug);
  const allCategories = await getAllCategories();
  const others = allCategories.filter((c) => c.slug !== cat.slug);
  const catIndex = allCategories.findIndex((c) => c.slug === cat.slug);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-screen-md pb-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="px-4 pt-4 text-[11px] text-ink-soft flex items-center gap-1.5">
          <Link href="/" className="hover:text-ink">Inicio</Link>
          <span aria-hidden>›</span>
          <span className="text-ink">{cat.name}</span>
        </nav>

        {/* Header bloque de color */}
        <header className="bg-peach px-6 py-7 md:py-10 mt-3 mx-4 rounded-3xl">
          <div className="text-[11px] font-extrabold tracking-wider text-mandarina-deep uppercase mb-2.5">
            Categoría · {String(catIndex + 1).padStart(2, "0")}/{allCategories.length}
          </div>
          <h1 className="font-display text-[56px] md:text-[80px] font-extrabold tracking-[-0.05em] leading-[0.9] mb-3">
            {cat.name}
          </h1>
          <p className="text-[15px] md:text-base text-ink/80 leading-relaxed mb-5">
            {cat.blurb}. Aprende a manejar el tema desde cero, sin tecnicismos y sin que te quieran vender productos.
          </p>
          <div className="flex gap-5 text-[12px] text-ink">
            <div>
              <div className="font-display text-[22px] font-extrabold tracking-[-0.025em]">{cat.count}</div>
              <div className="opacity-70">artículos</div>
            </div>
            <div>
              <div className="font-display text-[22px] font-extrabold tracking-[-0.025em]">~6 min</div>
              <div className="opacity-70">lectura promedio</div>
            </div>
          </div>
        </header>

        {/* Filtros */}
        <section className="px-4 pt-7">
          <div className="text-[11px] text-ink-soft font-bold tracking-wider uppercase mb-2.5 px-1">
            Filtrar por subtema
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["Todo", "Lo básico", "Avanzado", "Apps", "Bancos"].map((t, i) => (
              <span
                key={t}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold ${
                  i === 0 ? "bg-ink text-bg" : "bg-surface text-ink border border-rule"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Lista de artículos */}
        <section className="px-4 pt-6">
          {articles.length === 0 ? (
            <p className="text-center text-ink-soft py-12">Aún no hay artículos en esta categoría.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {articles.map((a, i) => (
                <ArticleCard key={a.slug} article={a} variant={i === 0 ? "feature" : "default"} accentIndex={i} />
              ))}
            </div>
          )}
        </section>

        {/* Lista en formato horizontal */}
        {articles.length > 1 && (
          <section className="px-5 pt-8">
            <h2 className="font-display text-base font-extrabold tracking-[-0.013em] mb-2">
              Todos los artículos
            </h2>
            <ul className="divide-y divide-rule">
              {articles.map((a) => (
                <li key={a.slug}>
                  <Link href={`/articulos/${a.slug}`} className="flex gap-3.5 items-start py-4">
                    <div
                      className="w-16 h-16 rounded-xl flex-shrink-0"
                      style={{ background: "var(--color-peach)" }}
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

        {/* Otras categorías */}
        <section className="bg-bg px-4 py-7 mt-8">
          <div className="text-[11px] text-ink-soft font-bold tracking-wider uppercase mb-3 px-1">
            Otras categorías
          </div>
          <div className="grid grid-cols-2 gap-2">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/categorias/${c.slug}`}
                className="bg-surface border border-rule rounded-2xl px-4 py-3.5 card-hover"
              >
                <div className="font-display text-lg font-extrabold tracking-[-0.025em]">{c.name}</div>
                <div className="text-[11px] text-ink-soft mt-1">{c.count} artículos</div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <Script
        id={`ld-cat-${cat.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([
              { name: "Inicio", url: "/" },
              { name: cat.name, url: `/categorias/${cat.slug}` },
            ])
          ),
        }}
      />
    </>
  );
}
