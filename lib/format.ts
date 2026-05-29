import type { CategorySlug } from "@/types";

// CategorySlug is a fixed TS union, so the slug→label map is a static
// contract — not "data". For all other category fields (blurb, count)
// go through the data layer (getAllCategories).
const CATEGORY_NAMES: Record<CategorySlug, string> = {
  ahorro:   "Ahorro",
  creditos: "Créditos",
  afore:    "AFORE",
  ppr:      "PPR",
};

/** Tailwind bg-* class per category. Single source of truth. */
export const CATEGORY_BG: Record<CategorySlug, string> = {
  ahorro:   "bg-peach",
  creditos: "bg-sand",
  afore:    "bg-sky",
  ppr:      "bg-sky",
};

/** CSS custom-property value per category (for inline `style`). */
export const CATEGORY_COLOR_VAR: Record<CategorySlug, string> = {
  ahorro:   "var(--color-peach)",
  creditos: "var(--color-sand)",
  afore:    "var(--color-sky)",
  ppr:      "var(--color-sky)",
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export function categoryName(slug: CategorySlug): string {
  return CATEGORY_NAMES[slug] ?? slug;
}
