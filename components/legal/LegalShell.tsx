import { AppHeader } from "@/components/home/AppHeader";
import { AppFooter } from "@/components/home/AppFooter";
import { BackToTop } from "./BackToTop";

export type LegalSection = { id: string; title: string };

/**
 * Layout compartido para las páginas legales de la app (/app/terminos,
 * /app/privacidad): navbar oscuro (AppHeader), TOC lateral en desktop,
 * contenido ~720px y footer compartido (AppFooter).
 */
export function LegalShell({
  title,
  updated,
  intro,
  sections,
  children,
}: {
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />

      <main className="mx-auto max-w-screen-lg px-5 pb-16 md:grid md:grid-cols-[230px_1fr] md:gap-10">
        {/* TOC lateral (solo desktop) */}
        <aside className="hidden md:block pt-12" aria-label="Tabla de contenidos">
          <nav className="sticky top-20">
            <div className="text-[10px] font-extrabold tracking-[0.06em] text-[#9b8675] uppercase mb-3">
              En esta página
            </div>
            <ol className="space-y-1.5 border-l border-rule">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block pl-3 -ml-px border-l border-transparent text-[12px] leading-snug text-ink-soft hover:text-mandarina-deep hover:border-mandarina-deep"
                  >
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        {/* Contenido */}
        <article className="max-w-[720px] pt-10 md:pt-12">
          <p className="text-[12px] font-bold tracking-wide text-[#9b8675] uppercase mb-3">
            Última actualización: {updated}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-[-0.035em] leading-[1.0] mb-5">
            {title}
          </h1>
          <div className="text-[15px] leading-relaxed text-ink-soft mb-10">{intro}</div>

          <div className="legal-body space-y-10">{children}</div>
        </article>
      </main>

      <AppFooter />

      <BackToTop />
    </>
  );
}

/** Sección numerada con anchor estable (#seccion-N). */
export function LegalSectionBlock({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={`seccion-${n}`} className="scroll-mt-20">
      <h2 className="font-display text-xl md:text-2xl font-extrabold tracking-[-0.022em] mb-3">
        {n}. {title}
      </h2>
      <div className="space-y-3 text-[14.5px] leading-relaxed text-ink/85 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_b]:text-ink [&_a]:text-mandarina-deep [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </section>
  );
}
