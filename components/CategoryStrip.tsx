import Link from "next/link";
import { getAllCategories } from "@/lib/articles";
import type { CategorySlug } from "@/types";

export async function CategoryStrip({ active }: { active?: CategorySlug }) {
  const categories = await getAllCategories();
  return (
    <nav
      aria-label="Categorías"
      className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-1"
    >
      {categories.map((c) => {
        const isActive = c.slug === active;
        return (
          <Link
            key={c.slug}
            href={`/app/blog/categorias/${c.slug}`}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap flex-shrink-0 ${
              isActive
                ? "bg-ink text-bg"
                : "bg-surface text-ink border border-rule"
            }`}
          >
            {c.name}
          </Link>
        );
      })}
    </nav>
  );
}
