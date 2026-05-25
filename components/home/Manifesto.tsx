export function Manifesto() {
  return (
    <section className="bg-ink text-bg px-5 py-10 md:py-14 mt-10 md:mt-14">
      <div className="mx-auto max-w-screen-md">
        <div className="font-hand text-mandarina text-3xl leading-none mb-2">Lo que creemos</div>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-5">
          Nadie nace sabiendo de finanzas.<br />
          <span className="text-yolk italic">Ni tú, ni nosotros</span> tampoco.
        </h2>
        <p className="text-[14px] md:text-base leading-relaxed opacity-80 max-w-prose">
          En Centavos te contamos lo que ojalá te hubieran enseñado en la escuela. Sin choros, sin recetas mágicas, sin venderte productos que no necesitas.
        </p>
      </div>
    </section>
  );
}
