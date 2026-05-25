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
  getLatestArticles,
  getStories,
  getTrendingArticles,
} from "@/lib/articles";

export const revalidate = 3600; // ISR: revalida cada hora

export default async function HomePage() {
  const articles = await getLatestArticles(6);
  const trending = await getTrendingArticles(5);
  const stories = await getStories();
  const categories = await getAllCategories();
  const [hero, ...rest] = articles;

  return (
    <>
      <Header />

      <main>
        <HeroKicker edition={24} />
        {hero && <FeaturedHero article={hero} />}
        <div className="mx-auto max-w-screen-md">
          <CategoryStrip />
        </div>
        <EmpiezaPorAqui />
        <Manifesto />
        <LoNuevo articles={rest} />
        <Eli5Spotlight />
        <CalculatorPreview />
        <TrendingList articles={trending} />
        <StoriesCarousel stories={stories} />
        <CategoriesGrid categories={categories} />
        <AboutTeaser />
        <GlossaryTeaser />
        <NewsletterCTA />
        <MoreArticlesGrid articles={rest} />
      </main>

      <Footer />
    </>
  );
}
