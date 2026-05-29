import Link from "next/link";
import { SectionHead } from "@/components/SectionHead";
import { CATEGORY_BG } from "@/lib/format";
import type { Category } from "@/types";

export function CategoriesGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-screen-md px-4 pt-10 md:pt-14">
      <div className="px-1">
        <SectionHead kicker="Explora" title="Por categoría" />
      </div>
      <div className="grid grid-cols-2 gap-2.5 mt-4">
        {categories.map((c) => {
          const bg = CATEGORY_BG[c.slug] ?? "bg-peach";
          return (
            <Link
              key={c.slug}
              href={`/categorias/${c.slug}`}
              className={`${bg} card-hover rounded-3xl px-4 py-5 min-h-[130px] flex flex-col justify-between text-ink`}
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
  );
}
