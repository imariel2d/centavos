import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryStrip } from "@/components/CategoryStrip";
import { HeroKicker } from "@/components/home/HeroKicker";
import { FeaturedHero } from "@/components/home/FeaturedHero";
import { EmpiezaPorAqui } from "@/components/home/EmpiezaPorAqui";
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
        <HeroKicker edition={24} />
        {hero && <FeaturedHero article={hero} />}
        <div className="mx-auto max-w-screen-md">
          <CategoryStrip />
        </div>
        <EmpiezaPorAqui steps={homePage.starterSteps} />
        <Manifesto />
        <LoNuevo articles={rest} />
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
