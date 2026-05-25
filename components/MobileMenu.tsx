"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/categorias/ahorro", label: "Ahorro" },
  { href: "/categorias/creditos", label: "Créditos" },
  { href: "/categorias/afore", label: "AFORE" },
  { href: "/categorias/ppr", label: "PPR" },
  { href: "/glosario", label: "Glosario" },
  { href: "/nosotros", label: "Nosotros" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="md:hidden w-10 h-10 rounded-full bg-ink grid place-items-center"
      >
        <span className="flex flex-col gap-[5px]">
          <span
            className={`block w-4 h-[2px] bg-bg rounded-full transition-transform duration-200 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-4 h-[2px] bg-bg rounded-full transition-transform duration-200 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg border-b border-rule shadow-lg z-40">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-[15px] font-semibold border-b border-rule last:border-0 hover:text-mandarina-deep"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
