// Maquetas de las pantallas de la app Centavo, recreadas en HTML/CSS para
// la página de marketing. Mismas pantallas que la app Expo (Pulso, Anotar,
// Alcancías), con los tokens del sistema de diseño.

import type { ReactNode } from "react";

// ──────────────────────────────────────────────────────────────
// Marco del teléfono
// ──────────────────────────────────────────────────────────────
export function PhoneFrame({
                             children,
                             tilt = 0,
                             className = "",
                           }: {
  children: ReactNode;
  tilt?: number;
  className?: string;
}) {
  return (
    <div className={`phone ${className}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="phone-screen">
        <div className="phone-notch" aria-hidden />
        <div className="h-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function StatusRow() {
  return (
    <div className="flex justify-between items-center px-6 pt-3 text-[11px] font-bold text-ink">
      <span>9:41</span>
      <span aria-hidden>●●● ▮</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Pulso (home)
// ──────────────────────────────────────────────────────────────
export function PulsoMock() {
  return (
    <>
      <StatusRow />
      <div className="px-5 pt-3 flex items-start gap-3">
        <div className="flex-1">
          <div className="text-[10px] font-extrabold tracking-wider text-mandarina-deep uppercase">9 jun · martes</div>
          <div className="font-display text-[22px] font-extrabold tracking-[-0.03em] leading-[1.05] mt-1">
            ¿Qué onda con tu lana hoy?
          </div>
        </div>
        <span className="w-10 h-10 rounded-full bg-mandarina text-bg grid place-items-center font-display font-extrabold border-2 border-yolk">
          ML
        </span>
      </div>

      <div className="mx-4 mt-4 rounded-3xl bg-ink text-bg p-5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yolk" />
          <span className="text-[11px] font-bold opacity-70 uppercase tracking-wide">Vas bien, aguas</span>
        </div>
        <div className="text-[11px] opacity-60 font-bold uppercase tracking-wide mt-3">Disponible este mes</div>
        <div className="font-display text-[40px] font-extrabold tracking-[-0.04em] leading-none text-yolk mt-1">$3,541</div>
        <div className="relative h-1.5 bg-white/15 rounded-full mt-4">
          <div className="absolute inset-y-0 left-0 w-[72%] bg-mandarina rounded-full" />
        </div>
        <div className="text-[11px] opacity-60 mt-1.5">Llevas $8,159 de $11,700</div>
      </div>

      <div className="mx-4 mt-3 flex items-center gap-3 bg-surface border border-rule rounded-2xl px-4 py-3">
        <span className="w-9 h-9 rounded-full bg-mandarina text-bg grid place-items-center text-xl font-light">+</span>
        <div className="flex-1">
          <div className="text-[13px] font-bold">Anotar un gasto</div>
          <div className="text-[11px] text-ink-soft">Toma 5 segundos</div>
        </div>
        <span className="text-ink" aria-hidden>›</span>
      </div>

      <div className="px-5 mt-5 text-[11px] font-extrabold tracking-wider text-mandarina-deep uppercase">Tus presupuestos</div>
      <div className="px-4 mt-2 space-y-2">
        <div className="bg-surface border border-rule rounded-2xl px-4 py-3">
          <div className="flex justify-between text-[13px] font-bold mb-2">
            <span>🌮 Comida</span>
            <span className="text-ink-soft">$2,400 / $3,000</span>
          </div>
          <div className="h-1.5 bg-sand rounded-full"><div className="h-full w-[80%] bg-mandarina rounded-full" /></div>
        </div>
        <div className="bg-surface border border-rule rounded-2xl px-4 py-3">
          <div className="flex justify-between text-[13px] font-bold mb-2">
            <span>🎬 Salidas</span>
            <span className="text-ink-soft">$640 / $1,200</span>
          </div>
          <div className="h-1.5 bg-sand rounded-full"><div className="h-full w-[53%] bg-yolk rounded-full" /></div>
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// Anotar gasto
// ──────────────────────────────────────────────────────────────
export function AnotarMock() {
  return (
    <>
      <StatusRow />
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="w-9 h-9 rounded-full bg-surface border border-rule grid place-items-center text-lg">×</span>
        <span className="font-display text-[15px] font-extrabold">Anotar gasto</span>
        <span className="w-9 h-9" />
      </div>
      <div className="text-center mt-7">
        <div className="text-[11px] font-extrabold tracking-wider text-mandarina-deep uppercase">¿Cuánto fue?</div>
        <div className="font-display text-[64px] font-extrabold tracking-[-0.05em] leading-none mt-2">$85</div>
      </div>
      <div className="px-5 mt-7 text-[11px] font-extrabold tracking-wider text-mandarina-deep uppercase">¿En qué?</div>
      <div className="px-4 mt-2 grid grid-cols-4 gap-2">
        <div className="bg-mandarina text-bg rounded-2xl py-3 grid place-items-center text-xl">🌮</div>
        <div className="bg-surface border border-rule rounded-2xl py-3 grid place-items-center text-xl">🚇</div>
        <div className="bg-surface border border-rule rounded-2xl py-3 grid place-items-center text-xl">🎬</div>
        <div className="bg-surface border border-rule rounded-2xl py-3 grid place-items-center text-xl">💊</div>
      </div>
      <div className="px-4 mt-3">
        <div className="bg-surface border border-rule rounded-2xl px-4 py-3 text-[13px] text-ink-soft">📝 Tacos del Güero</div>
      </div>
      <div className="px-4 mt-3 grid grid-cols-3 gap-2 text-center font-display text-2xl font-bold">
        <div className="py-2">1</div><div className="py-2">2</div><div className="py-2">3</div>
        <div className="py-2">4</div><div className="py-2">5</div><div className="py-2">6</div>
        <div className="py-2">7</div><div className="py-2">8</div><div className="py-2">9</div>
      </div>
      <div className="px-4 mt-1">
        <div className="bg-ink text-bg rounded-2xl py-3 text-center text-[14px] font-bold">Anotar $85</div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// Suscripciones
// ──────────────────────────────────────────────────────────────
export function SuscripcionesMock() {
  const subs = [
    { emoji: "📺", name: "Netflix", days: "en 3 días", amount: "$219", bg: "bg-peach" },
    { emoji: "🎧", name: "Spotify", days: "en 8 días", amount: "$115", bg: "bg-sky" },
    { emoji: "💪", name: "Smart Fit", days: "en 14 días", amount: "$499", bg: "bg-sand" },
    { emoji: "☁️", name: "iCloud", days: "en 21 días", amount: "$49", bg: "bg-peach" },
  ];
  return (
    <>
      <StatusRow />
      <div className="px-5 pt-3">
        <div className="text-[10px] font-extrabold tracking-wider text-mandarina-deep uppercase">Cada mes</div>
        <div className="font-display text-[26px] font-extrabold tracking-[-0.03em] leading-none mt-1">Suscripciones</div>
      </div>

      <div className="mx-4 mt-4 rounded-3xl bg-ink text-bg p-5">
        <div className="text-[11px] opacity-60 font-bold uppercase tracking-wide">Se te van al mes</div>
        <div className="font-display text-[40px] font-extrabold tracking-[-0.04em] leading-none text-yolk mt-1">$882</div>
        <div className="text-[11px] opacity-60 mt-1.5">En un año son $10,584</div>
      </div>

      <div className="px-5 mt-5 text-[11px] font-extrabold tracking-wider text-mandarina-deep uppercase">Próximos cobros</div>
      <div className="px-4 mt-2 space-y-2">
        {subs.map((s) => (
          <div key={s.name} className="flex items-center gap-3 bg-surface border border-rule rounded-2xl px-3.5 py-2.5">
            <span className={`w-9 h-9 rounded-xl ${s.bg} grid place-items-center text-lg`}>{s.emoji}</span>
            <div className="flex-1">
              <div className="text-[13px] font-bold leading-tight">{s.name}</div>
              <div className="text-[11px] text-ink-soft">Mensual · {s.days}</div>
            </div>
            <div className="font-display text-[15px] font-extrabold tracking-[-0.02em]">{s.amount}</div>
          </div>
        ))}
      </div>
    </>
  );
}
