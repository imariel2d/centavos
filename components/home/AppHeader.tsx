import Link from "next/link";
import { Logo } from "@/components/Logo";

/**
 * Navbar oscuro de las páginas /app/* (legales + soporte). Comparte el esquema
 * de color, tipografías y logo del footer (AppFooter): fondo `ink`, acentos
 * `mandarina` y el wordmark de Centavos.
 */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 bg-ink text-bg border-b border-bg/10">
      <div className="mx-auto max-w-screen-lg flex items-center justify-between px-5 py-3">
        <Logo size={26} color="var(--color-bg)" dotColor="var(--color-mandarina)" />
        <nav className="flex items-center gap-5 text-[13px] font-semibold">
          <Link href="/" className="bg-mandarina text-ink rounded-full px-4 py-1.5 hover:opacity-85">
            La app
          </Link>
        </nav>
      </div>
    </header>
  );
}
