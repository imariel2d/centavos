"use client";

import { useSearchParams } from "next/navigation";
import { Chip } from "./Chip";
import { Eli5Toggle } from "./Eli5Toggle";
import { ArticleBody } from "./ArticleBody";
import { ImgPlaceholder } from "./ImgPlaceholder";
import Image from "next/image";
import type { ArticleBlock } from "@/types";

interface Props {
  body: ArticleBlock[];
  bodyEli5: ArticleBlock[] | null;
  heroImageUrl?: string;
  heroImageAlt: string;
  heroCaption?: string;
  categoryName: string;
  title: string;
  authorName: string;
  publishedLabel: string;
  slug: string;
}

export function ArticleShell({
  body,
  bodyEli5,
  heroImageUrl,
  heroImageAlt,
  heroCaption,
  categoryName: catName,
  title,
  authorName,
  publishedLabel,
  slug,
}: Props) {
  const search = useSearchParams();
  const hasEli5 = bodyEli5 != null;
  const eli5 = hasEli5 && search.get("eli5") === "1";
  const blocks = eli5 && bodyEli5 ? bodyEli5 : body;

  return (
    <>
      {/* Title block — colored card */}
      <header className="px-4 pt-3">
        <div className={`rounded-3xl px-5 py-6 ${eli5 ? "bg-mandarina text-bg" : "bg-peach text-ink"}`}>
          <Chip
            bg="var(--color-ink)"
            fg={eli5 ? "var(--color-mandarina)" : "var(--color-bg)"}
            size="md"
          >
            {catName}
          </Chip>
          <h1 className="font-display text-[30px] md:text-[42px] font-extrabold tracking-[-0.034em] leading-[1.02] mt-4 mb-4 text-balance">
            {title}
          </h1>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex-shrink-0"
              style={{ background: eli5 ? "var(--color-bg)" : "var(--color-surface)" }}
              aria-hidden
            />
            <div>
              <div className="font-bold text-[13px]">{authorName}</div>
              <div className="text-[11px] opacity-70">{publishedLabel}</div>
            </div>
          </div>
        </div>
      </header>

      {/* ELI5 toggle */}
      {hasEli5 && <Eli5Toggle on={eli5} />}

      {/* Hero image */}
      <div className="px-4 pt-5 pb-1">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={heroImageAlt}
            width={768}
            height={440}
            className="w-full h-auto rounded-2xl object-cover"
            priority
          />
        ) : (
          <ImgPlaceholder
            label={eli5 ? "ilustración amigable" : "foto editorial"}
            height={220}
            bg={eli5 ? "var(--color-peach)" : "var(--color-sand)"}
            fg="var(--color-mandarina-deep)"
            rounded
          />
        )}
        {heroCaption && (
          <p className="text-[11px] text-ink-soft italic mt-1.5 px-1.5 leading-snug">
            {heroCaption} <span className="not-italic opacity-60">· Foto: Cortesía</span>
          </p>
        )}
      </div>

      {/* Body */}
      <article className="pt-6">
        <ArticleBody blocks={blocks} />
      </article>
    </>
  );
}
