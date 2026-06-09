import type { HomeAppFeature } from "@/types";

const CARD_BG = ["bg-peach", "bg-sand", "bg-sky"];

/** Tarjetas de funciones de la app (gastos, suscripciones, presupuestos…). */
export function AppFeatures({ features }: { features: HomeAppFeature[] }) {
  if (features.length === 0) return null;

  return (
    <section className="mx-auto max-w-screen-md px-5 pb-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {features.map((f, i) => (
          <div key={f.title} className={`${CARD_BG[i % CARD_BG.length]} rounded-2xl px-5 py-5`}>
            {f.emoji && (
              <div className="text-2xl mb-2" aria-hidden>
                {f.emoji}
              </div>
            )}
            <div className="font-display text-[17px] font-extrabold tracking-[-0.018em] leading-tight mb-1">
              {f.title}
            </div>
            {f.description && (
              <p className="text-[12px] text-ink/70 leading-relaxed">{f.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
