import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope, Caveat } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { organizationJsonLd, websiteJsonLd, SITE } from "@/lib/seo";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "optional",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "optional",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf3e3",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Centavos · Finanzas sin sustos para la gente",
    template: "%s · Centavos",
  },
  description:
    "La app para anotar tus gastos y controlar tu presupuesto, más un blog de finanzas personales para México. Sin choros, sin tecnicismos.",
  keywords: [
    "app para anotar gastos", "control de gastos", "app de presupuesto personal",
    "app de finanzas personales", "gastos hormiga", "suscripciones",
    "finanzas personales", "México", "ahorro", "AFORE",
    "PPR", "Buró de Crédito", "educación financiera",
  ],
  authors: [{ name: "Centavos", url: SITE.url }],
  creator: "Centavos",
  publisher: "Centavos",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITE.url,
    siteName: SITE.name,
    title: "Centavos · Finanzas sin sustos para la gente",
    description: "La app para anotar tus gastos y el blog para entender tu lana. Sin choros.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Centavos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Centavos · Finanzas sin sustos",
    description: "Blog financiero mexicano sin choros.",
    // site: "@centavo_mx",
    // creator: "@centavo_mx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "Finance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${bricolage.variable} ${manrope.variable} ${caveat.variable}`}>
      <body className="bg-bg text-ink antialiased">
        {children}
        <Analytics />
        <SpeedInsights />

        {/* JSON-LD raíz: organización + sitio */}
        <Script id="ld-organization" type="application/ld+json" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <Script id="ld-website" type="application/ld+json" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
      </body>
    </html>
  );
}
