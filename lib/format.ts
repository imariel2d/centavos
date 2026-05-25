import { CATEGORIES } from "@/data/mock";
import type { Article } from "@/types";

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export function categoryName(slug: Article["category"]): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}
