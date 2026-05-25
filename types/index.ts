// Tipos compartidos del dominio.
// Cuando conectes el CMS: estos siguen siendo el contrato interno.
// Escribe un mapper de tu formato (Portable Text, Rich Text, etc.) → ArticleBlock[].

export type CategorySlug = "ahorro" | "creditos" | "afore" | "ppr";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  count: number;
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  avatarColor?: string;
}

export interface ImageRef {
  url?: string; // si está vacío, se usa placeholder
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

// Bloques de cuerpo del artículo. El CMS WYSIWYG produce HTML/PortableText/RichText;
// aquí los normalizamos a un formato discriminado fácil de renderizar.
export type ArticleBlock =
  | { type: "paragraph"; html: string }
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "image"; image: ImageRef }
  | { type: "pullquote"; text: string }
  | { type: "tip"; title?: string; html: string }
  | { type: "chart"; title: string; subtitle: string; primary: { label: string; value: string }; secondary: { label: string; value: string } }
  | { type: "recap"; title?: string; items: string[] }
  | { type: "story"; name: string; role: string; quote: string };

export interface Article {
  slug: string;
  title: string;
  short: string;          // título corto para cards
  excerpt: string;
  category: CategorySlug;
  author: Author;
  publishedAt: string;    // ISO 8601
  readMinutes: number;
  heroImage: ImageRef;
  body: ArticleBlock[];
  // Versión "ELI5" del cuerpo (opcional — si falta, se muestra una nota)
  bodyEli5?: ArticleBlock[];
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  category: CategorySlug;
  definition: string;
  eli5: string;
}

export interface Story {
  name: string;
  role: string;
  quote: string;
}
