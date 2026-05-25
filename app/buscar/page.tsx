import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryStrip } from "@/components/CategoryStrip";
import { ArticleCard } from "@/components/ArticleCard";
import {
  getAllCategories,
  getAllGlossaryTerms,
  getTrendingArticles,
  searchArticles,
} from "@/lib/articles";
import { categoryName } from "@/lib/format";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca artículos, términos del glosario e historias en Centavo.",
  alternates: { canonical: `${SITE.url}/buscar` },
  robots: { index: false, follow: true }, // las páginas de búsqueda no se indexan
};

type SearchParams = { q?: string };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const hasQuery = query.length > 0;

  const [results, categories, trending, glossary] = await Promise.all([
    hasQuery ? searchArticles(query) : Promise.resolve([]),
    getAllCategories(),
    getTrendingArticles(4),
    hasQuery ? getAllGlossaryTerms() : Promise.resolve([]),
  ]);

  const glossaryHit = hasQuery
    ? glossary.find((g) => g.term.toLowerCase().includes(query.toLowerCase()))
    : null;

  return (
    <>
      <Header />

      <main className="mx-auto max-w-screen-md pb-12">
        {/* Search form */}
        <section className="px-4 pt-5">
          <form action="/buscar" method="get">
            <label htmlFor="q" className="sr-only">Buscar</label>
            <div className="flex items-center gap-3 px-4 py-3.5 bg-surface border-2 border-ink rounded-2xl">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="9" cy="9" r="6.5" /><path d="M14 14l4 4" strokeLinecap="round" />
              </svg>
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="¿Qué quieres aprender?"
                autoFocus
                className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-ink-soft"
              />
              {hasQuery && (
                <Link href="/buscar" aria-label="Limpiar" className="w-6 h-6 rounded-full bg-peach grid place-items-center text-[14px] font-bold">
                  ×
                </Link>
              )}
            </div>
          </form>
        </section>

        {!hasQuery ? (
          // ── Empty state ──────────────────────────────────────
          <>
            <section className="px-4 pt-6">
              <h2 className="font-display text-base font-extrabold tracking-[-0.013em] mb-2.5">
                Búsquedas recientes
              </h2>
              <div className="flex gap-2 flex-wrap">
                {["cómo ahorrar", "buró", "PPR vs AFORE", "primera tarjeta", "AFORE Inbursa"].map((s) => (
                  <Link
                    key={s}
                    href={`/buscar?q=${encodeURIComponent(s)}`}
                    className="px-3.5 py-2 bg-surface border border-rule rounded-full text-[13px] font-semibold flex items-center gap-1.5"
                  >
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                      <path d="M7 4v3l2 1" /><circle cx="7" cy="7" r="5.5" />
                    </svg>
                    {s}
                  </Link>
                ))}
              </div>
            </section>

            <section className="px-4 pt-7">
              <h2 className="font-display text-base font-extrabold tracking-[-0.013em] mb-3">
                Explora por tema
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((c, i) => {
                  const bgs = ["bg-peach", "bg-sand", "bg-sky", "bg-mandarina"];
                  const isOrange = i === 3;
                  return (
                    <Link
                      key={c.slug}
                      href={`/categorias/${c.slug}`}
                      className={`${bgs[i]} card-hover rounded-3xl px-4 py-5 min-h-[130px] flex flex-col justify-between ${isOrange ? "text-bg" : "text-ink"}`}
                    >
                      <div className="font-display text-2xl font-extrabold tracking-[-0.04em] leading-none">{c.name}</div>
                      <div>
                        <div className="text-[11px] opacity-75 mb-1 leading-snug">{c.blurb}</div>
                        <div className="text-[11px] font-bold">{c.count} artículos →</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="px-5 pt-8">
              <h2 className="font-display text-base font-extrabold tracking-[-0.013em] mb-3">🔥 Trending</h2>
              <ol className="divide-y divide-rule">
                {trending.map((a, i) => (
                  <li key={a.slug}>
                    <Link href={`/articulos/${a.slug}`} className="flex gap-3 py-3 items-center">
                      <span className="w-8 h-8 rounded-full bg-mandarina text-bg grid place-items-center font-display font-extrabold text-[14px] flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[10px] text-mandarina-deep font-extrabold tracking-wider uppercase">
                          {categoryName(a.category)}
                        </span>
                        <span className="block font-display text-[15px] font-bold tracking-[-0.013em] leading-snug mt-0.5">
                          {a.short}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          </>
        ) : (
          // ── Results ──────────────────────────────────────────
          <>
            <div className="px-4 pt-4 flex justify-between items-center">
              <p className="text-sm text-ink-soft">
                <b className="text-ink">{results.length}</b>{" "}
                resultado{results.length === 1 ? "" : "s"} para &quot;{query}&quot;
              </p>
            </div>

            <div className="mx-auto max-w-screen-md px-4 pt-3 pb-2">
              <CategoryStrip />
            </div>

            {results.length === 0 ? (
              <section className="px-5 pt-8 text-center">
                <div className="font-hand text-mandarina-deep text-2xl mb-2">Nada por aquí</div>
                <p className="text-ink-soft mb-5">
                  No encontramos artículos con &quot;{query}&quot;. Prueba con otra palabra o explora por categoría.
                </p>
              </section>
            ) : (
              <>
                {/* Top match destacado */}
                <section className="px-4 pt-4">
                  <div className="text-[10px] text-mandarina-deep font-extrabold tracking-wider uppercase mb-2 px-1">
                    ★ Resultado destacado
                  </div>
                  <ArticleCard article={results[0]} variant="feature" accentIndex={3} />
                </section>

                {/* Glossary suggestion */}
                {glossaryHit && (
                  <section className="px-4 pt-4">
                    <Link href={`/glosario#${glossaryHit.slug}`} className="block bg-yolk rounded-2xl px-5 py-4 card-hover">
                      <div className="text-[10px] text-ink font-extrabold tracking-wider uppercase mb-1">
                        📖 Del glosario
                      </div>
                      <div className="font-display text-xl font-extrabold tracking-[-0.025em] mb-1">
                        {glossaryHit.term}
                      </div>
                      <p className="text-[13px] leading-relaxed m-0">{glossaryHit.definition}</p>
                    </Link>
                  </section>
                )}

                {/* Other results */}
                {results.length > 1 && (
                  <section className="px-5 pt-6">
                    <div className="text-[11px] text-ink-soft font-bold tracking-wider uppercase mb-3">
                      Más resultados
                    </div>
                    <ul className="divide-y divide-rule">
                      {results.slice(1).map((a, i) => (
                        <li key={a.slug}>
                          <Link href={`/articulos/${a.slug}`} className="flex gap-3.5 py-3.5 items-start">
                            <div
                              className="w-14 h-14 rounded-xl flex-shrink-0"
                              style={{ background: ["var(--color-peach)", "var(--color-sand)", "var(--color-sky)"][i % 3] }}
                              aria-hidden
                            />
                            <div className="flex-1">
                              <div className="text-[10px] text-mandarina-deep font-extrabold tracking-wider uppercase">
                                {categoryName(a.category)}
                              </div>
                              <div className="font-display text-[15px] font-bold tracking-[-0.013em] leading-snug mt-0.5 mb-1">
                                {a.title}
                              </div>
                              <div className="text-[11px] text-ink-soft">
                                {a.author.name} · ⏱ {a.readMinutes} min
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
