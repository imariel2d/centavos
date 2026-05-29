import Link from "next/link";
import { SectionHead } from "@/components/SectionHead";
import { categoryName } from "@/lib/format";
import type { Article } from "@/types";

export function TrendingList({ articles }: { articles: Article[] }) {
  return (
    <section className="mx-auto max-w-screen-md px-5 pt-10 md:pt-14">
      <SectionHead kicker="🔥 Trending" title="Lo que la banda está leyendo" />
      <ol className="mt-3 divide-y divide-rule">
        {articles.map((a, i) => (
          <li key={a.slug}>
            <Link href={`/articulos/${a.slug}`} className="flex gap-3.5 items-center py-3.5 transition-opacity duration-150 hover:opacity-70">
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
  );
}
