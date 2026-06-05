"use client";

import { useState } from "react";

const MIN = 500;
const MAX = 5000;
const STEP = 100;
const YEARS = 30;
const ANNUAL_RATE = 0.05;

// Monthly compounding: FV = PMT * ((1 + r)^n - 1) / r
function futureValue(monthly: number, annualRate = ANNUAL_RATE, years = YEARS) {
  const r = annualRate / 12;
  const n = years * 12;
  return (monthly * (Math.pow(1 + r, n) - 1)) / r;
}

const fmtCurrency = (n: number) =>
  `$${Math.round(n).toLocaleString("en-US")}`;

export function CalculatorPreview() {
  const [monthly, setMonthly] = useState(1500);
  const pct = ((monthly - MIN) / (MAX - MIN)) * 100;
  const total = futureValue(monthly);

  return (
    <section className="mx-auto max-w-screen-md px-4 pt-6">
      <div className="bg-ink text-bg rounded-3xl px-6 py-7">
        <h3 className="font-display text-2xl font-extrabold tracking-[-0.022em] mb-1.5 leading-none">
          ¿Cuánto crece tu dinero?
        </h3>
        <p className="text-[13px] opacity-70 mb-5">Mueve la barra y te decimos.</p>

        <label htmlFor="monthly-savings" className="block text-[11px] opacity-60 font-bold tracking-wider mb-1.5 uppercase">
          Ahorras al mes
        </label>
        <div className="font-display text-[40px] font-extrabold text-mandarina tracking-[-0.04em] leading-none">
          {fmtCurrency(monthly)}
        </div>

        <div className="relative mt-4 py-2 -my-2">
          {/* track */}
          <div className="relative h-1 bg-white/15 rounded-full pointer-events-none">
            <div className="absolute inset-y-0 left-0 bg-mandarina rounded-full" style={{ width: `${pct}%` }} />
          </div>
          {/* native slider on top (transparent track, styled thumb) */}
          <input
            id="monthly-savings"
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            aria-label="Cuánto ahorras al mes"
            className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer
              [&::-webkit-slider-runnable-track]:bg-transparent
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-[18px]
              [&::-webkit-slider-thumb]:h-[18px]
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-mandarina
              [&::-webkit-slider-thumb]:border-[3px]
              [&::-webkit-slider-thumb]:border-bg
              [&::-webkit-slider-thumb]:cursor-grab
              [&::-webkit-slider-thumb]:shadow
              [&::-moz-range-track]:bg-transparent
              [&::-moz-range-thumb]:w-[18px]
              [&::-moz-range-thumb]:h-[18px]
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-mandarina
              [&::-moz-range-thumb]:border-[3px]
              [&::-moz-range-thumb]:border-bg
              [&::-moz-range-thumb]:cursor-grab
              focus-visible:outline-none
              focus-visible:[&::-webkit-slider-thumb]:ring-2
              focus-visible:[&::-webkit-slider-thumb]:ring-mandarina/60"
          />
        </div>

        <div className="flex justify-between text-[10px] opacity-50 mt-1.5 font-semibold">
          <span>{fmtCurrency(MIN)}</span><span>{fmtCurrency(MAX)}</span>
        </div>

        <div className="bg-white/5 rounded-2xl px-4 py-4 mt-5">
          <div className="text-[11px] text-yolk font-bold tracking-wider mb-1 uppercase">
            En {YEARS} años tendrías
          </div>
          <div className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.035em] leading-none tabular-nums">
            {fmtCurrency(total)}
          </div>
          <div className="text-[11px] opacity-65 mt-1">
            Con rendimiento real de {(ANNUAL_RATE * 100).toFixed(0)}% anual
          </div>
        </div>
      </div>
    </section>
  );
}
