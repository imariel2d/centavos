import Link from "next/link";
import { BackToTop } from "./BackToTop";

export type LegalSection = { id: string; title: string };

/**
 * Layout compartido para las páginas legales de la app (/app/terminos,
 * /app/privacidad): header sticky simple, TOC lateral en desktop,
 * contenido ~720px y footer con links cruzados.
 */
export function LegalShell({
  title,
  updated,
  intro,
  sections,
  crossLink,
  children,
}: {
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
  crossLink: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur-sm border-b border-rule">
        <div className="mx-auto max-w-screen-lg flex items-center justify-between px-5 py-3">
          <Link href="/" aria-label="Centavos · Inicio" className="font-display text-xl font-extrabold tracking-[-0.03em] text-mandarina-deep select-none">
            centavos
          </Link>
          <nav className="flex items-center gap-5 text-[13px] font-semibold">
            <Link href={crossLink.href} className="hover:text-mandarina-deep">
              {crossLink.label}
            </Link>
            <Link href="/" className="bg-ink text-bg rounded-full px-4 py-1.5 hover:opacity-85">
              La app
            </Link>
          </nav>
        </div>
      </header>

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

      <footer className="border-t border-rule">
        <div className="mx-auto max-w-screen-lg px-5 py-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-ink-soft">
          <span className="font-display font-extrabold text-mandarina-deep text-sm">centavos</span>
          <Link href="/app/terminos" className="hover:text-mandarina-deep">Términos y Condiciones</Link>
          <Link href="/app/privacidad" className="hover:text-mandarina-deep">Aviso de Privacidad</Link>
          <Link href="/app/eliminar-cuenta" className="hover:text-mandarina-deep">Eliminar cuenta</Link>
          <Link href="/app/soporte" className="hover:text-mandarina-deep">Soporte</Link>
          <a href="mailto:hola@centavos.mx" className="hover:text-mandarina-deep">hola@centavos.mx</a>
          <span className="ml-auto">© {new Date().getFullYear()} Centavos</span>
        </div>
      </footer>

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
