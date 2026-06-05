import { formatDate } from "@/lib/format";

export function HeroKicker({ edition = 24 }: { edition?: number }) {
  return (
    <section className="mx-auto max-w-screen-md px-5 pt-6 md:pt-12 pb-6">
      <div className="text-[11px] font-extrabold tracking-[0.06em] text-mandarina-deep uppercase mb-2.5">
        Edición #{String(edition).padStart(3, "0")} · {formatDate(new Date().toISOString())}
      </div>
      <h1 className="font-display text-[44px] md:text-[68px] font-extrabold tracking-[-0.045em] leading-[0.92] mb-3.5">
        Tu dinero,<br />
        <span className="text-mandarina italic">sin sustos</span>.
      </h1>
      <p className="text-[15px] md:text-lg leading-relaxed text-ink-soft">
        Centavo te explica las finanzas como te las debería haber explicado tu mejor cuate. Sin choros, sin tecnicismos, sin venderte nada raro.
      </p>
    </section>
  );
}
