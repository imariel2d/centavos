import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { breadcrumbsJsonLd, SITE } from "@/lib/seo";
import { getAllAuthors, getArticleCount } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Acerca de · Quiénes somos",
  description: "Centavos es una publicación independiente mexicana. Nuestra misión: ayudar a la gente a perderle el miedo a las finanzas.",
  alternates: { canonical: `${SITE.url}/nosotros` },
  openGraph: {
    title: "Acerca de Centavo",
    description: "Quiénes somos y qué hacemos.",
    url: `${SITE.url}/nosotros`,
  },
};

const MANIFESTO = [
  { n: "01", t: "Nadie nace sabiendo", d: "Las finanzas no se enseñan en la escuela.", c: "bg-peach" },
  { n: "02", t: "El miedo viene del lenguaje", d: "Si te lo explican en chino, parece imposible. Si te lo explican en cristiano, es bastante manejable.", c: "bg-sand" },
  { n: "03", t: "Cero comisiones, cero recetas", d: "No te vamos a vender que en 6 meses estarás retirado. Eso es mentira. Te vamos a decir lo que sí funciona.", c: "bg-sky" },
];

export default async function AboutPage() {
  const [authors, articleCount] = await Promise.all([
    getAllAuthors(),
    getArticleCount(),
  ]);
  const contactEmail = process.env.CONTACT_EMAIL;

  // "Lectores al mes" is a placeholder until analytics is wired up
  // (Plausible/Umami) — set READERS_PER_MONTH in .env to override.
  const readers = process.env.READERS_PER_MONTH;
  const NUMBERS = [
    ...(readers ? [{ n: readers, l: "Lectores al mes" }] : []),
    { n: String(articleCount), l: "Artículos" },
    { n: String(authors.length), l: "Personas escribiendo" },
  ];

  return (
    <>
      <Header />

      <main className="mx-auto max-w-screen-md pb-12">
        {/* Hero */}
        <section className="px-6 pt-7 pb-7">
          <div className="font-hand text-3xl text-mandarina-deep leading-none mb-2">quiénes somos</div>
          <h1 className="font-display text-[40px] md:text-[64px] font-extrabold tracking-[-0.05em] leading-[0.95] mb-5">
            Le ayudamos a la gente a<br />
            <span className="text-mandarina italic">perderle el miedo</span> al dinero.
          </h1>
          <p className="text-[15px] md:text-base leading-relaxed text-ink-soft max-w-prose">
            Centavo es una publicación independiente, hecha en México, para mexicanas y mexicanos jóvenes que sienten que las finanzas son para otros. Spoiler: no lo son.
          </p>
        </section>

        {/* Manifesto */}
        <section className="px-4 pt-3">
          <h2 className="font-display text-[15px] font-extrabold tracking-[-0.013em] text-mandarina-deep mb-3 px-1">
            Lo que creemos
          </h2>
          <div className="space-y-2.5">
            {MANIFESTO.map((m) => (
              <article key={m.n} className={`${m.c} rounded-3xl px-5 py-5`}>
                <div className="font-display text-3xl font-extrabold tracking-[-0.04em] text-ink/40 leading-none mb-2.5">{m.n}</div>
                <h3 className="font-display text-[19px] font-extrabold tracking-[-0.025em] mb-2">{m.t}</h3>
                <p className="text-[13px] leading-relaxed opacity-85 m-0">{m.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Numbers */}
        <section className="px-4 pt-8">
          <div className="bg-ink text-bg rounded-3xl px-5 py-6">
            <div className="text-[11px] font-extrabold tracking-wider text-mandarina uppercase mb-4">
              Centavo en números
            </div>
            <div className="grid grid-cols-2 gap-5">
              {NUMBERS.map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.04em] leading-none">
                    {s.n}
                  </div>
                  <div className="text-[11px] opacity-70 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="equipo" className="px-4 pt-8 scroll-mt-20">
          <h2 className="font-display text-lg font-extrabold tracking-[-0.018em] mb-3 px-1">El equipo</h2>
          <ul className="divide-y divide-rule">
            {authors.map((p) => (
              <li key={p.slug}>
                <Link href={`#`} className="flex gap-3.5 items-center py-3.5 px-1">
                  <div
                    className="w-12 h-12 rounded-full flex-shrink-0"
                    style={{ background: p.avatarColor }}
                    aria-hidden
                  />
                  <div className="flex-1">
                    <div className="font-display text-[15px] font-bold tracking-[-0.013em]">{p.name}</div>
                    <div className="text-xs text-ink-soft mt-0.5">{p.role}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M5 3l4 4-4 4" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA — only rendered when CONTACT_EMAIL is set */}
        {contactEmail && (
          <section id="contacto" className="px-4 pt-8 scroll-mt-20">
            <div className="bg-mandarina text-ink rounded-3xl px-5 py-6">
              <h2 className="font-display text-[22px] font-extrabold tracking-[-0.025em] leading-snug mb-2.5">
                ¿Tienes una historia que contar?
              </h2>
              <p className="text-[13px] opacity-85 leading-relaxed mb-3.5">
                Si te tocó perderle el miedo a algo financiero, queremos saber. Las mejores historias salen aquí.
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-block bg-ink text-bg rounded-full px-5 py-2.5 text-[13px] font-bold"
              >
                Cuéntanos →
              </a>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <Script
        id="ld-about-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([
              { name: "Inicio", url: "/" },
              { name: "Nosotros", url: "/nosotros" },
            ])
          ),
        }}
      />
    </>
  );
}
