// SEO helpers — JSON-LD schema builders.
// Inserta el output como <script type="application/ld+json"> en cada página.

import type { Article, CategoryFaq, GlossaryTerm } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://centavos.mx";
const SITE_NAME = "Centavos";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "sameAs": [
      // "https://twitter.com/centavo_mx",
      // "https://instagram.com/centavos.mx",
    ],
    "description": "Blog financiero mexicano: le ayudamos a la banda a perderle el miedo a la lana.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "inLanguage": "es-MX",
    "potentialAction": {
      "@type": "SearchAction",
      "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/buscar?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.heroImage.url
      ? [article.heroImage.url]
      : [`${SITE_URL}/og/${article.slug}.png`],
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "author": {
      "@type": "Person",
      "name": article.author.name,
      "url": `${SITE_URL}/autor/${article.author.slug}`,
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.png` },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articulos/${article.slug}`,
    },
    "inLanguage": "es-MX",
    "articleSection": article.category,
  };
}

export function breadcrumbsJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": `${SITE_URL}${item.url}`,
    })),
  };
}

export function definedTermSetJsonLd(terms: GlossaryTerm[]) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Glosario financiero",
    "url": `${SITE_URL}/glosario`,
    "hasDefinedTerm": terms.map((t) => ({
      "@type": "DefinedTerm",
      "name": t.term,
      "description": t.definition,
      "url": `${SITE_URL}/glosario#${t.slug}`,
    })),
  };
}

export function faqPageJsonLd(faq: CategoryFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer },
    })),
  };
}

export function collectionPageJsonLd(args: {
  name: string;
  description: string;
  url: string;
  itemCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": args.name,
    "description": args.description,
    "url": `${SITE_URL}${args.url}`,
    "inLanguage": "es-MX",
    "isPartOf": { "@type": "WebSite", "name": SITE_NAME, "url": SITE_URL },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": args.itemCount,
    },
  };
}

export const SITE = { url: SITE_URL, name: SITE_NAME };
