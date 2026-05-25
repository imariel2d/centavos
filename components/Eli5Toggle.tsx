"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function Eli5Toggle({ on }: { on: boolean }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const params = new URLSearchParams(search.toString());
  if (on) params.delete("eli5");
  else    params.set("eli5", "1");
  const href = `${pathname}${params.size ? `?${params.toString()}` : ""}`;

  return (
    <div className="px-4 pt-5 pb-5">
      <Link
        href={href}
        scroll={false}
        replace
        className={`flex items-center gap-3.5 rounded-2xl p-4 border-2 transition-colors ${
          on ? "border-mandarina bg-surface" : "border-ink bg-surface"
        }`}
        aria-pressed={on}
      >
        <span
          className={`w-11 h-11 rounded-full grid place-items-center font-display font-extrabold text-lg flex-shrink-0 ${
            on ? "bg-mandarina text-bg" : "bg-bg text-ink border-2 border-ink"
          }`}
          aria-hidden
        >
          5
        </span>
        <span className="flex-1">
          <span className="block font-display text-[15px] font-extrabold tracking-[-0.013em]">
            {on ? "Modo simple activado" : 'Modo "como si tuviera 5"'}
          </span>
          <span className="block text-[11px] text-ink-soft mt-0.5">
            {on ? "Sin tecnicismos, sin choros" : "Te lo explico bien chiquito"}
          </span>
        </span>
        <span
          className={`relative w-12 h-7 rounded-full flex-shrink-0 transition-colors ${
            on ? "bg-mandarina" : "bg-rule"
          }`}
          aria-hidden
        >
          <span
            className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-[left,right] ${
              on ? "right-1" : "left-1"
            }`}
          />
        </span>
      </Link>
      {on && (
        <div className="mt-2 px-3.5 py-2.5 bg-peach rounded-[10px] text-[12px] text-ink leading-snug">
          <b>✓ Activado.</b> El texto ahora usa palabras sencillas y ejemplos cotidianos.
        </div>
      )}
    </div>
  );
}
