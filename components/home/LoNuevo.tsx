import Link from "next/link";
import Image from "next/image";
import { SectionHead } from "@/components/SectionHead";
import { categoryName, CATEGORY_COLOR_VAR } from "@/lib/format";
import type { Article } from "@/types";

export function LoNuevo({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-screen-md px-5 pt-10 md:pt-14">
      <SectionHead kicker="Esta semana" title="Lo nuevo en Centavos" />
      <div className="mt-5">
        {articles.slice(0, 3).map((a, i) => (
          <Link
            key={a.slug}
            href={`/articulos/${a.slug}`}
            className={`flex gap-3.5 items-start py-4 ${i < Math.min(articles.length, 3) - 1 ? "border-b border-rule" : ""}`}
          >
            {a.heroImage.url ? (
              <Image
                src={a.heroImage.url}
                alt={a.heroImage.alt}
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl flex-shrink-0 object-cover"
                unoptimized
              />
            ) : (
              <div
                className="w-16 h-16 rounded-xl flex-shrink-0"
                style={{ background: CATEGORY_COLOR_VAR[a.category] ?? "var(--color-peach)" }}
                aria-hidden
              />
            )}
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
