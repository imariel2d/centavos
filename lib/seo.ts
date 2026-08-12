// SEO helpers — JSON-LD schema builders.
// Inserta el output como <script type="application/ld+json"> en cada página.

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
    "description":
      "App gratuita para anotar gastos y controlar tu presupuesto, hecha en México.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "inLanguage": "es-MX",
  };
}

/**
 * Schema de la app (rich results de descarga en Google).
 * Sin aggregateRating hasta tener reseñas reales — Google penaliza cifras inventadas.
 */
export function mobileApplicationJsonLd(args: { storeUrl?: string; playUrl?: string }) {
  const sameAs = [args.storeUrl, args.playUrl].filter(Boolean) as string[];
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": SITE_NAME,
    "description":
      "App para anotar tus gastos, armar presupuestos por categoría y llevar tus suscripciones. Sin conectar tu banco. Gratis para iOS y Android.",
    "url": SITE_URL,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "iOS, Android",
    "inLanguage": "es-MX",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "MXN" },
    ...(args.storeUrl ? { "installUrl": args.storeUrl } : {}),
    ...(sameAs.length ? { "sameAs": sameAs } : {}),
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
  };
}

/** Saca el ID numérico de una URL de App Store (…/app/id1234567890) para el Smart App Banner. */
export function appStoreId(storeUrl: string | undefined): string | undefined {
  return storeUrl?.match(/\/id(\d+)/)?.[1];
}

export const SITE = { url: SITE_URL, name: SITE_NAME };
