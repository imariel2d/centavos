import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope, Caveat } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { organizationJsonLd, websiteJsonLd, SITE } from "@/lib/seo";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
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
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf3e3",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Centavos · Finanzas sin sustos para la banda",
    template: "%s · Centavos",
  },
  description:
    "Blog financiero mexicano. Le ayudamos a la banda joven a perderle el miedo a la lana. Sin choros, sin tecnicismos.",
  keywords: [
    "finanzas personales", "México", "ahorro", "AFORE",
    "PPR", "Buró de Crédito", "tarjeta de crédito", "inversión",
    "educación financiera", "finanzas para jóvenes",
  ],
  authors: [{ name: "Centavos", url: SITE.url }],
  creator: "Centavos",
  publisher: "Centavos",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITE.url,
    siteName: SITE.name,
    title: "Centavos · Finanzas sin sustos para la banda",
    description: "Blog financiero mexicano para jóvenes que apenas empiezan con la lana.",
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

        {/* JSON-LD raíz: organización + sitio */}
        <Script id="ld-organization" type="application/ld+json" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <Script id="ld-website" type="application/ld+json" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
      </body>
    </html>
  );
}
