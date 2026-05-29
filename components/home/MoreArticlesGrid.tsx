import { ArticleCard } from "@/components/ArticleCard";
import { SectionHead } from "@/components/SectionHead";
import type { Article } from "@/types";

export function MoreArticlesGrid({ articles }: { articles: Article[] }) {
  return (
    <section className="mx-auto max-w-screen-md px-4 pt-10 md:pt-14 pb-10">
      <div className="px-1">
        <SectionHead kicker="Sigue leyendo" title="Más artículos" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {articles.slice(0, 4).map((a) => (
          <ArticleCard key={a.slug} article={a} variant="default" />
        ))}
      </div>
    </section>
  );
}
