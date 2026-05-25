import { SectionHead } from "@/components/SectionHead";
import type { Story } from "@/types";

const CARD_BG = ["var(--color-peach)", "var(--color-sand)", "var(--color-sky)"];

export function StoriesCarousel({ stories }: { stories: Story[] }) {
  return (
    <section className="pt-10 md:pt-14">
      <div className="mx-auto max-w-screen-md px-5">
        <SectionHead kicker="Historias reales" title="La banda nos cuenta" />
      </div>
      {/* Mobile: swipeable row. Desktop: grid (no horizontal scroll). */}
      <div
        className="mx-auto max-w-screen-md mt-4 px-4 pb-2
          flex gap-3 overflow-x-auto no-scrollbar
          md:grid md:grid-cols-3 md:overflow-visible"
      >
        {stories.map((s, i) => (
          <article
            key={i}
            className="flex-shrink-0 w-72 rounded-3xl p-5 md:w-auto"
            style={{ background: CARD_BG[i % CARD_BG.length] }}
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
  );
}
