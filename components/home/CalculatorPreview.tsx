export function CalculatorPreview() {
  return (
    <section className="mx-auto max-w-screen-md px-4 pt-6">
      <div className="bg-ink text-bg rounded-3xl px-6 py-7">
        <h3 className="font-display text-2xl font-extrabold tracking-[-0.022em] mb-1.5 leading-none">
          ¿Cuánto crece tu lana?
        </h3>
        <p className="text-[13px] opacity-70 mb-5">Mueve la barra y te decimos.</p>
        <div className="text-[11px] opacity-60 font-bold tracking-wider mb-1.5 uppercase">Ahorras al mes</div>
        <div className="font-display text-[40px] font-extrabold text-mandarina tracking-[-0.04em] leading-none">$1,500</div>
        <div className="relative h-1 bg-white/15 rounded-full mt-4">
          <div className="h-full w-[30%] bg-mandarina rounded-full" />
          <div className="absolute -top-1.5 w-4.5 h-4.5 rounded-full bg-mandarina border-[3px] border-bg" style={{ left: "calc(30% - 9px)", width: 18, height: 18 }} />
        </div>
        <div className="flex justify-between text-[10px] opacity-50 mt-1.5 font-semibold">
          <span>$500</span><span>$5,000</span>
        </div>
        <div className="bg-white/5 rounded-2xl px-4 py-4 mt-5">
          <div className="text-[11px] text-yolk font-bold tracking-wider mb-1 uppercase">En 30 años tendrías</div>
          <div className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.035em] leading-none">$1,847,200</div>
          <div className="text-[11px] opacity-65 mt-1">Con rendimiento real de 5% anual</div>
        </div>
      </div>
    </section>
  );
}
