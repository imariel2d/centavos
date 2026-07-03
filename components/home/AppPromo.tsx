// Banda promocional de la app para la home. Enlaza a /app.

import Link from "next/link";
import { PhoneFrame, PulsoMock } from "./PhoneMock";
import { AppStoreBadges } from "./AppStoreBadges";

export function AppPromo({ storeUrl, playUrl }: { storeUrl?: string; playUrl?: string }) {
  return (
    <section className="mx-auto max-w-screen-md px-4 pt-10 md:pt-14">
      <div className="bg-ink text-bg rounded-3xl px-6 md:px-10 py-8 md:py-10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-mandarina/30 blur-xl" aria-hidden />

        <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="font-hand text-mandarina text-3xl leading-none mb-2">y además...</div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.03em] leading-[1.0] mb-3">
              Llévate Centavo<br />en el bolsillo.
            </h2>
            <p className="text-[14px] md:text-[15px] leading-relaxed opacity-80 max-w-sm mb-6">
              No solo leemos de lana, también te ayudamos a cuidarla. Anota tus gastos, arma tus presupuestos y llena tus alcancías — sin conectar tu banco.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <AppStoreBadges variant="light" storeUrl={storeUrl} playUrl={playUrl} />
              <Link href="/app" className="text-[13px] font-bold text-yolk inline-flex items-center gap-1.5">
                Conoce la app
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="M3 7h8M8 4l3 3-3 3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            {/* Teléfono recortado: mostramos la parte de arriba del Pulso */}
            <div className="h-[300px] overflow-hidden">
              <PhoneFrame tilt={3} className="scale-90 origin-top">
                <PulsoMock />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
