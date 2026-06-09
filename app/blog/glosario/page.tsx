import type { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chip } from "@/components/Chip";
import { getAllCategories, getAllGlossaryTerms } from "@/lib/articles";
import { definedTermSetJsonLd, breadcrumbsJsonLd, SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Glosario · Términos financieros sin choro",
  description: "Glosario de términos financieros en español mexicano, explicados en cristiano y también como si tuvieras 5 años.",
  alternates: { canonical: `${SITE.url}/glosario` },
  openGraph: {
    title: "Glosario financiero · Centavo",
    description: "Términos financieros explicados sin choros.",
    url: `${SITE.url}/glosario`,
  },
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default async function GlossaryPage() {
  const [glossary, categories] = await Promise.all([
    getAllGlossaryTerms(),
    getAllCategories(),
  ]);
  const terms = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  const presentLetters = new Set(terms.map((t) => t.term[0].toUpperCase()));

  return (
    <>
      <Header />

      <main className="mx-auto max-w-screen-md pb-12">
        {/* Header */}
        <header className="px-6 pt-5 pb-5">
          <div className="font-hand text-2xl text-mandarina-deep leading-none mb-1.5">glosario</div>
          <h1 className="font-display text-[44px] md:text-[60px] font-extrabold tracking-[-0.05em] leading-[0.95] mb-3">
            Términos<br />sin choro.
          </h1>
          <p className="text-[14px] md:text-base text-ink-soft leading-relaxed max-w-prose">
            {terms.length}+ palabras financieras explicadas <i>en cristiano</i> — y también <i>como si tuvieras 5</i>.
          </p>
        </header>

        {/* Search */}
        <section className="px-4 pb-4">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-surface border border-rule rounded-2xl">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="9" cy="9" r="6.5" /><path d="M14 14l4 4" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Buscar término..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-soft"
              aria-label="Buscar término"
            />
          </div>
        </section>

        {/* A–Z index */}
        <nav aria-label="Índice alfabético" className="px-4 pb-4">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {ALPHABET.map((l) => {
              const has = presentLetters.has(l);
              return (
                <a
                  key={l}
                  href={has ? `#letter-${l}` : undefined}
                  className={`w-7 h-7 rounded-full grid place-items-center font-display text-[13px] font-bold flex-shrink-0 ${
                    has
                      ? "bg-mandarina text-bg"
                      : "bg-surface text-ink-soft border border-rule cursor-default"
                  }`}
                >
                  {l}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Terms list */}
        <section className="px-4 pb-8">
          <ul className="space-y-2.5">
            {terms.map((t) => {
              const cat = categories.find((c) => c.slug === t.category);
              return (
                <li key={t.slug} id={t.slug} className="scroll-mt-20">
                  <a id={`letter-${t.term[0].toUpperCase()}`} className="absolute" aria-hidden />
                  <article className="bg-surface border border-rule rounded-2xl px-5 py-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-display text-[26px] font-extrabold tracking-[-0.03em] leading-none">
                        {t.term}
                      </h3>
                      {cat && (
                        <Chip bg="var(--color-peach)" fg="var(--color-mandarina-deep)" size="sm">
                          {cat.name}
                        </Chip>
                      )}
                    </div>
                    <p className="text-[13px] leading-relaxed mb-3 m-0">{t.definition}</p>
                    <div className="bg-peach rounded-xl px-3 py-2.5 flex gap-2">
                      <span className="w-[22px] h-[22px] rounded-full bg-mandarina text-bg grid place-items-center font-display font-extrabold text-[11px] flex-shrink-0">
                        5
                      </span>
                      <span className="text-[12px] leading-snug italic">{t.eli5}</span>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <Footer />

      <Script
        id="ld-glossary"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetJsonLd(glossary)) }}
      />
      <Script
        id="ld-glossary-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([
              { name: "Inicio", url: "/" },
              { name: "Glosario", url: "/glosario" },
            ])
          ),
        }}
      />
    </>
  );
}
