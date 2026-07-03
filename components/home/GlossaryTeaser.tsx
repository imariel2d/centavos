import Link from "next/link";
import { SectionHead } from "@/components/SectionHead";
import { getAllGlossaryTerms } from "@/lib/articles";

export async function GlossaryTeaser() {
  const terms = (await getAllGlossaryTerms()).slice(0, 3);
  return (
    <section className="mx-auto max-w-screen-md px-5 pt-10 md:pt-14">
      <SectionHead kicker="Glosario" title="Términos sin choro" />
      <div className="mt-4">
        {terms.map((g, i) => (
          <div key={g.slug} className={`py-4 ${i < 2 ? "border-b border-rule" : ""}`}>
            <div className="flex items-baseline gap-2.5 mb-1.5">
              <div className="font-display text-[22px] font-extrabold tracking-[-0.025em] text-mandarina">
                {g.term}
              </div>
              <div className="text-[10px] text-ink-soft font-bold tracking-wider uppercase">en cristiano</div>
            </div>
            <p className="text-[14px] leading-relaxed m-0">{g.definition}</p>
          </div>
        ))}
      </div>
      <Link href="/blog/glosario" className="inline-block mt-4 text-[13px] text-mandarina-deep font-bold">
        Ver glosario completo →
      </Link>
    </section>
  );
}
