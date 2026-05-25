import Link from "next/link";
import { CATEGORIES } from "@/data/mock";
import type { CategorySlug } from "@/types";

export function CategoryStrip({ active }: { active?: CategorySlug }) {
  return (
    <nav
      aria-label="Categorías"
      className="flex gap-2 overflow-x-auto no-scrollbar px-4 -mx-4 pb-1"
    >
      {CATEGORIES.map((c) => {
        const isActive = c.slug === active;
        return (
          <Link
            key={c.slug}
            href={`/categorias/${c.slug}`}
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
