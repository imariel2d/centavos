import Link from "next/link";
import { SectionHead } from "@/components/SectionHead";
import type { CategorySlug, HomeStarterStep } from "@/types";

const CATEGORY_COLOR: Record<CategorySlug, string> = {
  ahorro:   "bg-peach",
  creditos: "bg-sand",
  afore:    "bg-sky",
  ppr:      "bg-sky",
};

export function EmpiezaPorAqui({ steps }: { steps: HomeStarterStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section className="mx-auto max-w-screen-md px-5 pt-8 md:pt-12">
      <SectionHead kicker="Para los que apenas empiezan" title="Empieza por aquí" />
      <div className="space-y-2.5 mt-5">
        {steps.map((s, i) => (
          <Link
            key={s.article.slug}
            href={`/articulos/${s.article.slug}`}
            className={`${CATEGORY_COLOR[s.article.category] ?? "bg-peach"} card-hover flex items-center gap-4 rounded-2xl px-5 py-4`}
          >
            <span className="font-display text-2xl font-extrabold tracking-[-0.04em] text-ink/40 leading-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1">
              <span className="block font-display text-[17px] font-bold tracking-[-0.018em] leading-tight">{s.article.short}</span>
              <span className="block text-[12px] text-ink/65 mt-0.5">{s.article.excerpt}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M5 3l4 4-4 4" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
