import Link from "next/link";
import type { Article } from "@/types";
import { Chip } from "./Chip";
import { categoryName, CATEGORY_BG } from "@/lib/format";

type Variant = "default" | "compact" | "feature";

export function ArticleCard({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: Variant;
}) {
  const a = article;
  const accent = CATEGORY_BG[a.category] ?? "bg-peach";

  if (variant === "compact") {
    return (
      <Link
        href={`/app/blog/articulos/${a.slug}`}
        className={`${accent} card-hover rounded-2xl p-4 flex flex-col justify-between min-h-[150px] text-ink`}
      >
        <Chip bg="var(--color-ink)" fg="var(--color-bg)" size="sm">
          {categoryName(a.category)}
        </Chip>
        <div className="mt-3">
          <div className="font-display text-[16px] font-bold tracking-[-0.018em] leading-tight mb-2">
            {a.short}
          </div>
          <div className="text-[11px] font-semibold opacity-70">
            ⏱ {a.readMinutes} min
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "feature") {
    return (
      <Link
        href={`/app/blog/articulos/${a.slug}`}
        className="block bg-mandarina text-bg rounded-3xl overflow-hidden card-hover"
      >
        <div className="px-6 pt-6 pb-7">
          <Chip bg="var(--color-ink)" fg="var(--color-bg)" size="md">
            ⭐ Destacado · {categoryName(a.category)}
          </Chip>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.03em] leading-[1.02] mt-4 mb-3">
            {a.title}
          </h2>
          <p className="text-[14px] leading-relaxed opacity-90 mb-4">{a.excerpt}</p>
          <span className="inline-flex items-center gap-2 bg-ink text-bg rounded-full px-4 py-2.5 text-[13px] font-bold">
            Leer ahora
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M3 7h8M8 4l3 3-3 3" />
            </svg>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/app/blog/articulos/${a.slug}`}
      className={`${accent} card-hover block rounded-3xl p-5 text-ink`}
    >
      <Chip bg="var(--color-ink)" fg="var(--color-bg)" size="md">
        {categoryName(a.category)}
      </Chip>
      <h3 className="font-display text-[19px] font-extrabold tracking-[-0.024em] leading-[1.1] mt-3 mb-2">
        {a.title}
      </h3>
      <p className="text-[13px] opacity-80 leading-relaxed mb-3">{a.excerpt}</p>
      <div className="text-[11px] opacity-65 font-semibold">
        {a.author.name} · ⏱ {a.readMinutes} min
      </div>
    </Link>
  );
}
