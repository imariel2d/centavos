import Link from "next/link";
import { SectionHead } from "@/components/SectionHead";

const AVATARS = ["bg-mandarina", "bg-yolk", "bg-sky", "bg-peach"];

export function AboutTeaser() {
  return (
    <section className="mx-auto max-w-screen-md px-4 pt-10">
      <div className="bg-surface border border-rule rounded-3xl px-5 py-6">
        <SectionHead kicker="Quiénes somos" title="Los que escribimos" />
        <div className="flex mb-4 mt-3">
          {AVATARS.map((c, i) => (
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
  );
}
