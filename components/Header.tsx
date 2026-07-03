import Link from "next/link";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header({ variant = "full" }: { variant?: "full" | "minimal" }) {
  if (variant === "minimal") {
    // Landing de la app: solo logo y enlace al blog.
    return (
      <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur-sm relative">
        <div className="mx-auto max-w-screen-lg flex items-center justify-between px-4 py-3">
          <Logo size={26} />
          <Link href="/blog" className="text-sm font-semibold hover:text-mandarina-deep">
            Blog
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur-sm relative">
      <div className="mx-auto max-w-screen-lg flex items-center justify-between px-4 py-3">
        <Logo size={26} />
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          <Link href="/blog/categorias/ahorro" className="hover:text-mandarina-deep">Ahorro</Link>
          <Link href="/blog/categorias/creditos" className="hover:text-mandarina-deep">Créditos</Link>
          <Link href="/blog/categorias/afore" className="hover:text-mandarina-deep">AFORE</Link>
          <Link href="/blog/categorias/ppr" className="hover:text-mandarina-deep">PPR</Link>
          <Link href="/blog/glosario"            className="hover:text-mandarina-deep">Glosario</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/blog/buscar"
            aria-label="Buscar"
            className="w-10 h-10 rounded-full bg-surface border border-rule grid place-items-center"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="9" cy="9" r="6.5" /><path d="M14 14l4 4" strokeLinecap="round" />
            </svg>
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
