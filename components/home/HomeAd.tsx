"use client";
import { track } from "@vercel/analytics";
import type { HomeAd as HomeAdData } from "@/types";

export function HomeAd({ ad }: { ad: HomeAdData }) {
  const { label, brand, headline, body, cta, href, imageUrl, imageAlt } = ad;
  return (
    <section className="mx-auto max-w-screen-md px-5 pt-6 md:pt-8">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] text-ink-soft tracking-wider font-bold uppercase">
          {label}
        </span>
        <span className="text-[10px] text-ink-soft/70 tracking-wider uppercase">
          Enlace de afiliado
        </span>
      </div>
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() => track("home_ad_click", { brand, href, placement: "home_below_starter" })}
        className="card-hover block overflow-hidden rounded-2xl border border-rule bg-surface"
      >
        <div className="flex items-stretch gap-4">
          <div className="relative w-28 sm:w-36 flex-shrink-0 bg-sand">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : null}
          </div>
          <div className="flex-1 py-4 pr-4">
            <div className="text-[10px] text-mandarina-deep font-extrabold tracking-wider uppercase mb-1">
              {brand}
            </div>
            <div className="font-display text-[17px] font-bold tracking-[-0.018em] leading-tight mb-1">
              {headline}
            </div>
            <div className="text-[12px] text-ink/65 leading-snug mb-2.5">
              {body}
            </div>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[-0.01em] text-ink underline-offset-2 hover:underline">
              {cta}
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <path d="M5 3l4 4-4 4" />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </section>
  );
}
