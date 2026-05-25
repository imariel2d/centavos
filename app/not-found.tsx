import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] grid place-items-center px-6 py-16">
      <div className="text-center max-w-md">
        <div className="font-hand text-mandarina-deep text-3xl mb-2">¡Aguas!</div>
        <h1 className="font-display text-5xl font-extrabold tracking-[-0.04em] leading-[0.95] mb-4">
          Esta página<br />
          <span className="italic text-mandarina">no existe</span>.
        </h1>
        <p className="text-ink-soft mb-8 leading-relaxed">
          Pero tranquilo, hay un montón de lana que aprender por aquí.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-ink text-bg rounded-full px-6 py-3 font-bold text-sm"
        >
          Volver al inicio
          <span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  );
}
