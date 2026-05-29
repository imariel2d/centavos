import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleShell } from "@/components/ArticleShell";
import { getArticleDraftBySlug } from "@/lib/articles";
import { categoryName, formatDate } from "@/lib/format";

// Never cache — always fetch fresh from Directus.
export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function PreviewArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = await getArticleDraftBySlug(slug);
  if (!article) notFound();

  const catName = categoryName(article.category);
  const publishedLabel = `${formatDate(article.publishedAt)} · ⏱ ${article.readMinutes} min`;

  return (
    <>
      <Header />

      {/* Draft banner */}
      <div className="bg-mandarina text-ink text-center text-[13px] font-bold py-2 px-4">
        🚧 Vista previa — este artículo aún no está publicado
      </div>

      <main className="mx-auto max-w-screen-md pb-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="px-4 pt-4 text-[11px] text-ink-soft flex items-center gap-1.5">
          <Link href="/" className="hover:text-ink">Inicio</Link>
          <span aria-hidden>›</span>
          <Link href={`/categorias/${article.category}`} className="hover:text-ink">{catName}</Link>
          <span aria-hidden>›</span>
          <span className="text-ink truncate max-w-[60%]">{article.short}</span>
        </nav>

        <Suspense>
          <ArticleShell
            body={article.body}
            bodyEli5={article.bodyEli5 ?? null}
            heroImageUrl={article.heroImage.url}
            heroImageAlt={article.heroImage.alt}
            heroCaption={article.heroImage.caption}
            categoryName={catName}
            title={article.title}
            authorName={article.author.name}
            publishedLabel={publishedLabel}
            slug={article.slug}
          />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
