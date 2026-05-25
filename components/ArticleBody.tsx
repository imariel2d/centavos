import Image from "next/image";
import type { ArticleBlock } from "@/types";
import { MiniChart } from "./MiniChart";

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="prose-centavo">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="px-5" dangerouslySetInnerHTML={{ __html: block.html }} />
            );

          case "heading":
            return block.level === 2 ? (
              <h2
                key={i}
                id={block.id}
                className="px-5 font-display text-2xl font-extrabold tracking-[-0.022em] mt-4 mb-3.5"
              >
                {block.text}
              </h2>
            ) : (
              <h3
                key={i}
                id={block.id}
                className="px-5 font-display text-xl font-bold tracking-[-0.018em] mt-3 mb-2.5"
              >
                {block.text}
              </h3>
            );

          case "image":
            return (
              <figure key={i} className="my-5 px-4">
                {block.image.url ? (
                  <Image
                    src={block.image.url}
                    alt={block.image.alt}
                    width={block.image.width ?? 768}
                    height={block.image.height ?? 432}
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-full h-56 rounded-2xl bg-sand grid place-items-center text-mandarina-deep text-xs uppercase tracking-wide">
                    imagen · {block.image.alt}
                  </div>
                )}
                {block.image.caption && (
                  <figcaption className="mt-2 px-1 text-[11px] text-ink-soft italic leading-snug">
                    {block.image.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "pullquote":
            return (
              <blockquote key={i} className="my-5 px-5">
                <span className="font-hand text-2xl text-mandarina-deep leading-none block mb-1" aria-hidden>"</span>
                <p className="font-display text-[22px] font-bold tracking-[-0.022em] leading-tight m-0">
                  {block.text}
                </p>
              </blockquote>
            );

          case "tip":
            return (
              <aside key={i} className="my-4 mx-4 bg-peach rounded-2xl px-5 py-4">
                {block.title && (
                  <div className="font-display font-extrabold text-sm uppercase tracking-wide mb-1.5">
                    💡 {block.title}
                  </div>
                )}
                <div className="text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.html }} />
              </aside>
            );

          case "chart":
            return (
              <div key={i} className="my-5 mx-4 bg-surface border border-rule rounded-3xl px-5 py-5">
                <div className="font-display text-base font-extrabold tracking-[-0.013em]">{block.title}</div>
                <div className="text-xs text-ink-soft mb-3.5">{block.subtitle}</div>
                <MiniChart height={120} />
                <div className="grid grid-cols-2 gap-2.5 mt-4">
                  <div className="bg-bg rounded-xl px-3.5 py-3">
                    <div className="text-[10px] text-ink-soft font-bold tracking-wider uppercase">{block.secondary.label}</div>
                    <div className="font-display text-[22px] font-extrabold tracking-[-0.022em]">{block.secondary.value}</div>
                  </div>
                  <div className="bg-mandarina text-bg rounded-xl px-3.5 py-3">
                    <div className="text-[10px] font-bold tracking-wider uppercase opacity-90">{block.primary.label}</div>
                    <div className="font-display text-[22px] font-extrabold tracking-[-0.022em]">{block.primary.value}</div>
                  </div>
                </div>
              </div>
            );

          case "recap":
            return (
              <div key={i} className="my-5 mx-4 border-2 border-ink rounded-3xl px-5 py-5">
                <div className="font-display text-lg font-extrabold tracking-[-0.018em] mb-3">
                  ✅ {block.title ?? "Lo que aprendiste"}
                </div>
                <ul className="space-y-1.5">
                  {block.items.map((it, j) => (
                    <li key={j} className="flex gap-2.5 text-[13px] leading-relaxed">
                      <span className="text-mandarina font-extrabold flex-shrink-0">✓</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case "story":
            return (
              <div key={i} className="my-5 mx-4 bg-ink text-bg rounded-3xl px-5 py-5">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-10 h-10 rounded-full bg-mandarina flex-shrink-0" aria-hidden />
                  <div>
                    <div className="font-bold text-sm">{block.name}</div>
                    <div className="text-xs text-mandarina">{block.role}</div>
                  </div>
                </div>
                <div className="font-display text-lg font-semibold tracking-[-0.014em] leading-snug">
                  "{block.quote}"
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
