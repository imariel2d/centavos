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

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export function categoryName(slug: CategorySlug): string {
  return CATEGORY_NAMES[slug] ?? slug;
}
