import Link from "next/link";
import { SectionHead } from "@/components/SectionHead";
import { categoryName } from "@/lib/format";
import type { Article } from "@/types";

const TILE_BG = ["var(--color-peach)", "var(--color-sand)", "var(--color-sky)"];

export function LoNuevo({ articles }: { articles: Article[] }) {
  return (
    <section className="mx-auto max-w-screen-md px-5 pt-10 md:pt-14">
      <SectionHead kicker="Esta semana" title="Lo nuevo en Centavo" />
      <div className="mt-5">
        {articles.slice(0, 3).map((a, i) => (
          <Link
            key={a.slug}
            href={`/articulos/${a.slug}`}
            className={`flex gap-3.5 items-start py-4 ${i < 2 ? "border-b border-rule" : ""}`}
          >
            <div
              className="w-16 h-16 rounded-xl flex-shrink-0"
              style={{ background: TILE_BG[i] }}
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
  );
}
