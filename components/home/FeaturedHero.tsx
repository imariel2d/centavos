import Link from "next/link";
import { Chip } from "@/components/Chip";
import { ImgPlaceholder } from "@/components/ImgPlaceholder";
import { categoryName } from "@/lib/format";
import type { Article } from "@/types";

export function FeaturedHero({ article }: { article: Article }) {
  return (
    <section className="mx-auto max-w-screen-md px-4 pb-7">
      <Link href={`/articulos/${article.slug}`} className="block bg-mandarina text-bg rounded-3xl overflow-hidden card-hover">
        <ImgPlaceholder label={`foto editorial · ${categoryName(article.category)}`} height={200} bg="var(--color-mandarina-deep)" fg="var(--color-peach)" />
        <div className="px-6 pt-5 pb-7">
          <Chip bg="var(--color-ink)" fg="var(--color-bg)" size="md">
            ⭐ Destacado · {categoryName(article.category)}
          </Chip>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.03em] leading-[1.0] mt-4 mb-3">
            {article.title}
          </h2>
          <p className="text-[14px] md:text-[15px] leading-relaxed opacity-95 mb-4">
            {article.excerpt}
          </p>
          <span className="inline-flex items-center gap-2 bg-ink text-bg rounded-full px-4 py-2.5 text-[13px] font-bold">
            Leer ahora
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M3 7h8M8 4l3 3-3 3" />
            </svg>
          </span>
        </div>
      </Link>
    </section>
  );
}
