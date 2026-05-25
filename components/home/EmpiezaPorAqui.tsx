import Link from "next/link";
import { SectionHead } from "@/components/SectionHead";

const STEPS = [
  { n: "01", t: "¿Qué onda con el ahorro?",   d: "Lo más básico, en 5 min",     c: "bg-peach", href: "/categorias/ahorro" },
  { n: "02", t: "Buró de Crédito sin miedo",  d: "Spoiler: no es lista negra",  c: "bg-sand",  href: "/articulos/buro-de-credito-sin-miedo" },
  { n: "03", t: "Tu AFORE en 5 minutos",      d: "Sí, te puedes cambiar",       c: "bg-sky",   href: "/articulos/como-cambiar-afore-5-minutos" },
];

export function EmpiezaPorAqui() {
  return (
    <section className="mx-auto max-w-screen-md px-5 pt-8 md:pt-12">
      <SectionHead kicker="Para los que apenas empiezan" title="Empieza por aquí" />
      <div className="space-y-2.5 mt-5">
        {STEPS.map((s) => (
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
  );
}
