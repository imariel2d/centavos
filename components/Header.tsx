import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto max-w-screen-lg flex items-center justify-between px-4 py-3">
        <Logo size={26} />
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          <Link href="/categorias/ahorro"   className="hover:text-mandarina-deep">Ahorro</Link>
          <Link href="/categorias/creditos" className="hover:text-mandarina-deep">Créditos</Link>
          <Link href="/categorias/afore"    className="hover:text-mandarina-deep">AFORE</Link>
          <Link href="/categorias/ppr"      className="hover:text-mandarina-deep">PPR</Link>
          <Link href="/glosario"            className="hover:text-mandarina-deep">Glosario</Link>
          <Link href="/nosotros"            className="hover:text-mandarina-deep">Nosotros</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/buscar"
            aria-label="Buscar"
            className="w-10 h-10 rounded-full bg-surface border border-rule grid place-items-center"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="9" cy="9" r="6.5" /><path d="M14 14l4 4" strokeLinecap="round" />
            </svg>
          </Link>
          <button
            aria-label="Abrir menú"
            className="md:hidden w-10 h-10 rounded-full bg-ink grid place-items-center"
          >
            <span className="flex flex-col gap-[5px]">
              <span className="block w-4 h-[2px] bg-bg rounded-full" />
              <span className="block w-4 h-[2px] bg-bg rounded-full" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
