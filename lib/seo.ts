// SEO helpers — JSON-LD schema builders.
// Inserta el output como <script type="application/ld+json"> en cada página.

import type { Article, GlossaryTerm } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://centavo.mx";
const SITE_NAME = "Centavo";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "sameAs": [
      // "https://twitter.com/centavo_mx",
      // "https://instagram.com/centavo.mx",
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

export const SITE = { url: SITE_URL, name: SITE_NAME };
