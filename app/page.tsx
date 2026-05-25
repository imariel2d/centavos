import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chip } from "@/components/Chip";
import { SectionHead } from "@/components/SectionHead";
import { CategoryStrip } from "@/components/CategoryStrip";
import { ArticleCard } from "@/components/ArticleCard";
import { ImgPlaceholder } from "@/components/ImgPlaceholder";
import { NewsletterForm } from "@/components/NewsletterForm";
import {
  getAllCategories,
  getLatestArticles,
  getStories,
  getTrendingArticles,
} from "@/lib/articles";
import { categoryName, formatDate } from "@/lib/format";
import { GLOSSARY } from "@/data/mock";

export const revalidate = 3600; // ISR: revalida cada hora

export default async function HomePage() {
  const articles = await getLatestArticles(6);
  const trending = await getTrendingArticles(5);
  const stories = await getStories();
  const categories = await getAllCategories();
  const [hero, ...rest] = articles;

  return (
    <>
      <Header />

      <main>
        {/* 1 — Hero kicker */}
        <section className="mx-auto max-w-screen-md px-5 pt-6 md:pt-12 pb-6">
          <div className="text-[11px] font-extrabold tracking-[0.06em] text-mandarina-deep uppercase mb-2.5">
            Edición #024 · {formatDate(new Date().toISOString())}
          </div>
          <h1 className="font-display text-[44px] md:text-[68px] font-extrabold tracking-[-0.045em] leading-[0.92] mb-3.5">
            Tu lana,<br />
            <span className="text-mandarina italic">sin sustos</span>.
          </h1>
          <p className="text-[15px] md:text-lg leading-relaxed text-ink-soft">
            Centavo te explica las finanzas como te las debería haber explicado tu mejor cuate. Sin choros, sin tecnicismos, sin venderte nada raro.
          </p>
        </section>

        {/* 2 — Featured hero card */}
        <section className="mx-auto max-w-screen-md px-4 pb-7">
          <Link href={`/articulos/${hero.slug}`} className="block bg-mandarina text-bg rounded-3xl overflow-hidden card-hover">
            <ImgPlaceholder label={`foto editorial · ${categoryName(hero.category)}`} height={200} bg="var(--color-mandarina-deep)" fg="var(--color-peach)" />
            <div className="px-6 pt-5 pb-7">
              <Chip bg="var(--color-ink)" fg="var(--color-bg)" size="md">
                ⭐ Destacado · {categoryName(hero.category)}
              </Chip>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.03em] leading-[1.0] mt-4 mb-3">
                {hero.title}
              </h2>
              <p className="text-[14px] md:text-[15px] leading-relaxed opacity-95 mb-4">
                {hero.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 bg-ink text-bg rounded-full px-4 py-2.5 text-[13px] font-bold">
                Leer ahora
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="M3 7h8M8 4l3 3-3 3" />
                </svg>
              </span>
            </div>
          </Link>
        </section>

        {/* 3 — Category strip */}
        <div className="mx-auto max-w-screen-md">
          <CategoryStrip />
        </div>

        {/* 4 — Empieza por aquí (newbies path) */}
        <section className="mx-auto max-w-screen-md px-5 pt-8 md:pt-12">
          <SectionHead kicker="Para los que apenas empiezan" title="Empieza por aquí" />
          <div className="space-y-2.5 mt-5">
            {[
              { n: "01", t: "¿Qué onda con el ahorro?",   d: "Lo más básico, en 5 min",     c: "bg-peach", href: "/categorias/ahorro"   },
              { n: "02", t: "Buró de Crédito sin miedo",  d: "Spoiler: no es lista negra",  c: "bg-sand",  href: "/articulos/buro-de-credito-sin-miedo" },
              { n: "03", t: "Tu AFORE en 5 minutos",      d: "Sí, te puedes cambiar",       c: "bg-sky",   href: "/articulos/como-cambiar-afore-5-minutos" },
            ].map((s) => (
              <Link key={s.n} href={s.href} className={`${s.c} card-hover flex items-center gap-4 rounded-2xl px-5 py-4`}>
                <span className="font-display text-2xl font-extrabold tracking-[-0.04em] text-ink/40 leading-none">{s.n}</span>
                <span className="flex-1">
                  <span className="block font-display text-[17px] font-bold tracking-[-0.018em] leading-tight">{s.t}</span>
                  <span className="block text-[12px] text-ink/65 mt-0.5">{s.d}</span>
                </span>
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="M5 3l4 4-4 4" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* 5 — Manifesto */}
        <section className="bg-ink text-bg px-5 py-10 md:py-14 mt-10 md:mt-14">
          <div className="mx-auto max-w-screen-md">
            <div className="font-hand text-mandarina text-3xl leading-none mb-2">Lo que creemos</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-5">
              Nadie nace sabiendo de finanzas.<br />
              <span className="text-yolk italic">Ni tú, ni nosotros</span> tampoco.
            </h2>
            <p className="text-[14px] md:text-base leading-relaxed opacity-80 max-w-prose">
              En Centavo te contamos lo que ojalá te hubieran enseñado en la escuela. Sin choros, sin recetas mágicas, sin venderte productos que no necesitas.
            </p>
          </div>
        </section>

        {/* 6 — Lo nuevo */}
        <section className="mx-auto max-w-screen-md px-5 pt-10 md:pt-14">
          <SectionHead kicker="Esta semana" title="Lo nuevo en Centavo" />
          <div className="mt-5">
            {rest.slice(0, 3).map((a, i) => (
              <Link
                key={a.slug}
                href={`/articulos/${a.slug}`}
                className={`flex gap-3.5 items-start py-4 ${i < 2 ? "border-b border-rule" : ""}`}
              >
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0"
                  style={{ background: ["var(--color-peach)", "var(--color-sand)", "var(--color-sky)"][i] }}
                  aria-hidden
                />
                <div className="flex-1">
                  <div className="text-[10px] text-mandarina-deep font-extrabold tracking-wider uppercase mb-1">
                    {categoryName(a.category)}
                  </div>
                  <div className="font-display text-[17px] font-bold tracking-[-0.018em] leading-tight mb-1">
                    {a.title}
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    {a.author.name} · ⏱ {a.readMinutes} min
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 7 — ELI5 spotlight A/B */}
        <section className="mx-auto max-w-screen-md px-4 pt-10">
          <div className="bg-surface rounded-3xl px-5 py-6 border border-rule">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-full bg-mandarina text-bg grid place-items-center font-display font-extrabold" aria-hidden>5</span>
              <div>
                <div className="font-display text-[17px] font-extrabold tracking-[-0.018em]">
                  Modo &quot;como si tuviera 5&quot;
                </div>
                <div className="text-[11px] text-ink-soft">Mira cómo cambia un artículo</div>
              </div>
            </div>
            <div className="bg-bg rounded-xl px-3.5 py-3.5 mb-2">
              <div className="text-[9px] text-ink-soft font-bold tracking-wider mb-1.5 uppercase">▢ Modo normal</div>
              <p className="text-[12px] italic leading-snug m-0">
                &quot;El interés compuesto es el rendimiento generado sobre el capital y los intereses previamente acumulados...&quot;
              </p>
            </div>
            <div className="bg-peach rounded-xl px-3.5 py-3.5">
              <div className="text-[9px] text-mandarina-deep font-extrabold tracking-wider mb-1.5 uppercase">▣ Como si tuviera 5</div>
              <p className="text-[13px] leading-snug m-0">
                &quot;Imagínate una bola de nieve. Le pones $100 y empieza a rodar. Al año pesa $108. Al siguiente, esos $108 ruedan, y así sucesivamente. <b>Tu lana hace lanitas.</b>&quot;
              </p>
            </div>
          </div>
        </section>

        {/* 8 — Calculator preview */}
        <section className="mx-auto max-w-screen-md px-4 pt-6">
          <div className="bg-ink text-bg rounded-3xl px-6 py-7">
            <h3 className="font-display text-2xl font-extrabold tracking-[-0.022em] mb-1.5 leading-none">
              ¿Cuánto crece tu lana?
            </h3>
            <p className="text-[13px] opacity-70 mb-5">Mueve la barra y te decimos.</p>
            <div className="text-[11px] opacity-60 font-bold tracking-wider mb-1.5 uppercase">Ahorras al mes</div>
            <div className="font-display text-[40px] font-extrabold text-mandarina tracking-[-0.04em] leading-none">$1,500</div>
            <div className="relative h-1 bg-white/15 rounded-full mt-4">
              <div className="h-full w-[30%] bg-mandarina rounded-full" />
              <div className="absolute -top-1.5 w-4.5 h-4.5 rounded-full bg-mandarina border-[3px] border-bg" style={{ left: "calc(30% - 9px)", width: 18, height: 18 }} />
            </div>
            <div className="flex justify-between text-[10px] opacity-50 mt-1.5 font-semibold">
              <span>$500</span><span>$5,000</span>
            </div>
            <div className="bg-white/5 rounded-2xl px-4 py-4 mt-5">
              <div className="text-[11px] text-yolk font-bold tracking-wider mb-1 uppercase">En 30 años tendrías</div>
              <div className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.035em] leading-none">$1,847,200</div>
              <div className="text-[11px] opacity-65 mt-1">Con rendimiento real de 5% anual</div>
            </div>
          </div>
        </section>

        {/* 9 — Trending */}
        <section className="mx-auto max-w-screen-md px-5 pt-10 md:pt-14">
          <SectionHead kicker="🔥 Trending" title="Lo que la banda está leyendo" />
          <ol className="mt-3 divide-y divide-rule">
            {trending.map((a, i) => (
              <li key={a.slug}>
                <Link href={`/articulos/${a.slug}`} className="flex gap-3.5 items-center py-3.5">
                  <span
                    className={`font-display text-3xl font-extrabold tracking-[-0.04em] leading-none w-8 ${
                      i === 0 ? "text-mandarina" : "text-ink-soft/40"
                    }`}
                  >
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

        {/* 10 — Stories carousel */}
        <section className="pt-10 md:pt-14">
          <div className="mx-auto max-w-screen-md px-5">
            <SectionHead kicker="Historias reales" title="La banda nos cuenta" />
          </div>
          <div className="mx-auto max-w-screen-md flex gap-3 overflow-x-auto no-scrollbar px-4 mt-4 pb-2">
            {stories.map((s, i) => (
              <article
                key={i}
                className="flex-shrink-0 w-72 rounded-3xl p-5"
                style={{ background: ["var(--color-peach)", "var(--color-sand)", "var(--color-sky)"][i] }}
              >
                <div className="font-hand text-mandarina-deep text-3xl leading-none mb-2" aria-hidden>&ldquo;</div>
                <p className="font-display text-base font-semibold leading-snug tracking-[-0.013em] text-ink mb-5 min-h-[100px]">
                  {s.quote}
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-ink/15" aria-hidden />
                  <div>
                    <div className="text-xs font-bold">{s.name}</div>
                    <div className="text-[10px] opacity-60">{s.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 11 — Categories grid */}
        <section className="mx-auto max-w-screen-md px-4 pt-10 md:pt-14">
          <div className="px-1">
            <SectionHead kicker="Explora" title="Por categoría" />
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {categories.map((c, i) => {
              const bgs = ["bg-peach", "bg-sand", "bg-sky", "bg-mandarina"];
              const isOrange = i === 3;
              return (
                <Link
                  key={c.slug}
                  href={`/categorias/${c.slug}`}
                  className={`${bgs[i]} card-hover rounded-3xl px-4 py-5 min-h-[130px] flex flex-col justify-between ${isOrange ? "text-bg" : "text-ink"}`}
                >
                  <div className="font-display text-2xl md:text-3xl font-extrabold tracking-[-0.04em] leading-none">{c.name}</div>
                  <div>
                    <div className="text-[11px] opacity-75 mb-1 leading-snug">{c.blurb}</div>
                    <div className="text-[11px] font-bold">{c.count} artículos →</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 12 — Quiénes somos teaser */}
        <section className="mx-auto max-w-screen-md px-4 pt-10">
          <div className="bg-surface border border-rule rounded-3xl px-5 py-6">
            <SectionHead kicker="Quiénes somos" title="Los que escribimos" />
            <div className="flex mb-4 mt-3">
              {["bg-mandarina", "bg-yolk", "bg-sky", "bg-peach"].map((c, i) => (
                <div
                  key={i}
                  className={`${c} w-10 h-10 rounded-full border-2 border-surface`}
                  style={{ marginLeft: i === 0 ? 0 : -10 }}
                  aria-hidden
                />
              ))}
              <div className="bg-bg w-10 h-10 rounded-full border-2 border-surface grid place-items-center font-display font-extrabold text-[11px]" style={{ marginLeft: -10 }}>
                +3
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-3">
              Somos un equipo de 7 escribiendo desde CDMX, Monterrey y Mérida. Educadores financieros, periodistas, y un par de exhipotecarios arrepentidos.
            </p>
            <Link href="/nosotros" className="text-[12px] text-mandarina-deep font-bold">
              Conoce al equipo →
            </Link>
          </div>
        </section>

        {/* 13 — Glossary teaser */}
        <section className="mx-auto max-w-screen-md px-5 pt-10 md:pt-14">
          <SectionHead kicker="Glosario" title="Términos sin choro" />
          <div className="mt-4">
            {GLOSSARY.slice(0, 3).map((g, i) => (
              <div key={g.slug} className={`py-4 ${i < 2 ? "border-b border-rule" : ""}`}>
                <div className="flex items-baseline gap-2.5 mb-1.5">
                  <div className="font-display text-[22px] font-extrabold tracking-[-0.025em] text-mandarina">
                    {g.term}
                  </div>
                  <div className="text-[10px] text-ink-soft font-bold tracking-wider uppercase">en cristiano</div>
                </div>
                <p className="text-[14px] leading-relaxed m-0">{g.definition}</p>
              </div>
            ))}
          </div>
          <Link href="/glosario" className="inline-block mt-4 text-[13px] text-mandarina-deep font-bold">
            Ver glosario completo →
          </Link>
        </section>

        {/* 14 — Newsletter */}
        <section id="newsletter" className="mx-auto max-w-screen-md px-4 pt-10 md:pt-14">
          <div className="bg-mandarina text-ink rounded-3xl px-6 py-7 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-yolk/50" aria-hidden />
            <div className="relative">
              <div className="font-hand text-2xl leading-none mb-1">psst...</div>
              <h3 className="font-display text-[26px] md:text-3xl font-extrabold tracking-[-0.028em] leading-none mb-2.5">
                Centavo en tu correo,<br />una vez al mes.
              </h3>
              <p className="text-[13px] opacity-80 leading-snug mb-4">
                Lo mejor del mes resumido. Cero spam, garantizado por nuestro abogado (y por nosotros, que no tenemos abogado).
              </p>
              <NewsletterForm />
            </div>
          </div>
        </section>

        {/* 15 — Sponsor */}
        <section className="mx-auto max-w-screen-md px-4 pt-10">
          <div className="text-[10px] text-ink-soft tracking-wider font-bold uppercase mb-2 px-1">Patrocinado</div>
          <a href="#" className="block bg-surface border border-rule rounded-2xl px-4 py-4 card-hover">
            <div className="flex gap-3.5 items-center">
              <div className="w-12 h-12 rounded-xl bg-sand flex-shrink-0" aria-hidden />
              <div className="flex-1">
                <div className="font-display font-bold text-[15px] tracking-[-0.013em]">Banco patrocinador</div>
                <div className="text-xs text-ink-soft mt-0.5 leading-snug">Espacio para anuncio nativo · CTA del partner</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M5 3l4 4-4 4" />
              </svg>
            </div>
          </a>
        </section>

        {/* 16 — More articles grid */}
        <section className="mx-auto max-w-screen-md px-4 pt-10 md:pt-14 pb-10">
          <div className="px-1">
            <SectionHead kicker="Sigue leyendo" title="Más artículos" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {rest.slice(0, 4).map((a, i) => (
              <ArticleCard key={a.slug} article={a} variant="default" accentIndex={i} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
