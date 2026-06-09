import type { Metadata } from "next";
import { SITE, ogImageUrl } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryStrip } from "@/components/CategoryStrip";
import { HeroKicker } from "@/components/home/HeroKicker";
import { AppHero } from "@/components/home/AppHero";
import { AppFeatures } from "@/components/home/AppFeatures";
import { FeaturedHero } from "@/components/home/FeaturedHero";
import { EmpiezaPorAqui } from "@/components/home/EmpiezaPorAqui";
import { HomeAd } from "@/components/home/HomeAd";
import { EditorialDisclaimer } from "@/components/EditorialDisclaimer";
import { Manifesto } from "@/components/home/Manifesto";
import { LoNuevo } from "@/components/home/LoNuevo";
import { Eli5Spotlight } from "@/components/home/Eli5Spotlight";
import { CalculatorPreview } from "@/components/home/CalculatorPreview";
import { TrendingList } from "@/components/home/TrendingList";
import { StoriesCarousel } from "@/components/home/StoriesCarousel";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { GlossaryTeaser } from "@/components/home/GlossaryTeaser";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { MoreArticlesGrid } from "@/components/home/MoreArticlesGrid";
import {
  getAllCategories,
  getHomePage,
  getLatestArticles,
  getStories,
} from "@/lib/articles";

export const revalidate = 60; // ISR: revalida cada minuto

export async function generateMetadata(): Promise<Metadata> {
  // Same call as the page render — Next.js dedupes the fetch in one request.
  const [hero] = await getLatestArticles(6);
  const ogImage = ogImageUrl(hero?.heroImage.url);
  if (!hero || !ogImage) return {}; // falls back to root layout's og-default.png

  const alt = hero.heroImage.alt || hero.title;
  return {
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: SITE.url,
      siteName: SITE.name,
      title: "Centavos · Finanzas sin sustos",
      description: "Blog financiero mexicano para jóvenes que apenas empiezan con la lana.",
      images: [{ url: ogImage, width: 1200, height: 630, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Centavos · Finanzas sin sustos",
      description: "Blog financiero mexicano sin choros.",
      images: [ogImage],
    },
  };
}

export default async function HomePage() {
  const [articles, homePage, stories, categories] = await Promise.all([
    getLatestArticles(6),
    getHomePage(),
    getStories(),
    getAllCategories(),
  ]);

  const [hero, ...rest] = articles;
  const newsletterEnabled = Boolean(process.env.RESEND_REPLY_TO);

  return (
    <>
      <Header />

      <main className="pb-10 md:pb-14">
        {/* App primero; el blog pasa a segundo plano. HeroKicker queda como
            fallback para que la página nunca pierda su H1. */}
        {homePage.app ? (
          <>
            <AppHero app={homePage.app} />
            <AppFeatures features={homePage.app.features} />
            <div className="mx-auto max-w-screen-md px-5 pt-12 md:pt-16 pb-5">
              <div className="text-[11px] font-extrabold tracking-[0.06em] text-mandarina-deep uppercase">
                El blog · Lo más reciente
              </div>
            </div>
          </>
        ) : (
          <HeroKicker edition={24} />
        )}
        {hero && <FeaturedHero article={hero} />}
        <div className="mx-auto max-w-screen-md">
          <CategoryStrip />
        </div>
        <EmpiezaPorAqui steps={homePage.starterSteps} />
        {homePage.ad && <HomeAd ad={homePage.ad} />}
        <Manifesto />
        <LoNuevo articles={rest} />
        <div className="mx-auto max-w-screen-md">
          <EditorialDisclaimer />
        </div>
        <Eli5Spotlight />
        <CalculatorPreview />
        {homePage.trending.length > 0 && <TrendingList articles={homePage.trending} />}
        {stories.length > 0 && <StoriesCarousel stories={stories} />}
        {categories.length > 0 && <CategoriesGrid categories={categories} />}
        <AboutTeaser />
        <GlossaryTeaser />
        {newsletterEnabled && <NewsletterCTA />}
        {/*{homePage.moreArticles.length > 0 && <MoreArticlesGrid articles={homePage.moreArticles} />}*/}
      </main>

      <Footer />
    </>
  );
}
