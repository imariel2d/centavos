export function Eli5Spotlight() {
  return (
    <section className="mx-auto max-w-screen-md px-4 pt-10">
      <div className="bg-surface rounded-3xl px-5 py-6 border border-rule">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-9 h-9 rounded-full bg-mandarina text-bg grid place-items-center font-display font-extrabold" aria-hidden>5</span>
          <div>
            <div className="font-display text-[17px] font-extrabold tracking-[-0.018em]">
              Modo &quot;como si tuviera 5&quot;
            </div>
            <div className="text-[11px] text-ink-soft">Mira cómo cambia un artículo</div>
          </div>
        </div>
        <div className="bg-bg rounded-xl px-3.5 py-3.5 mb-2">
          <div className="text-[9px] text-ink-soft font-bold tracking-wider mb-1.5 uppercase">▢ Modo normal</div>
          <p className="text-[12px] italic leading-snug m-0">
            &quot;El interés compuesto es el rendimiento generado sobre el capital y los intereses previamente acumulados...&quot;
          </p>
        </div>
        <div className="bg-peach rounded-xl px-3.5 py-3.5">
          <div className="text-[9px] text-mandarina-deep font-extrabold tracking-wider mb-1.5 uppercase">▣ Como si tuviera 5</div>
          <p className="text-[13px] leading-snug m-0">
            &quot;Imagínate una bola de nieve. Le pones $100 y empieza a rodar. Al año pesa $108. Al siguiente, esos $108 ruedan, y así sucesivamente. <b>Tu lana hace lanitas.</b>&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
