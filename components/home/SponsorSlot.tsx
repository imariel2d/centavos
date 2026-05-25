export function SponsorSlot() {
  return (
    <section className="mx-auto max-w-screen-md px-4 pt-10">
      <div className="text-[10px] text-ink-soft tracking-wider font-bold uppercase mb-2 px-1">Patrocinado</div>
      <a href="#" className="block bg-surface border border-rule rounded-2xl px-4 py-4 card-hover">
        <div className="flex gap-3.5 items-center">
          <div className="w-12 h-12 rounded-xl bg-sand flex-shrink-0" aria-hidden />
          <div className="flex-1">
            <div className="font-display font-bold text-[15px] tracking-[-0.013em]">Banco patrocinador</div>
            <div className="text-xs text-ink-soft mt-0.5 leading-snug">Espacio para anuncio nativo · CTA del partner</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M5 3l4 4-4 4" />
          </svg>
        </div>
      </a>
    </section>
  );
}
