import type { Metadata } from "next";
import Link from "next/link";
import { SoporteForm } from "@/components/soporte/SoporteForm";

export const metadata: Metadata = {
  title: "Soporte · App Centavos",
  description:
    "¿Necesitas ayuda con la app Centavos? Escríbenos desde aquí o a hola@centavos.mx y te respondemos lo antes posible.",
  alternates: { canonical: "/app/soporte" },
};

export default function SoportePage() {
  return (
    <>
      <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur-sm border-b border-rule">
        <div className="mx-auto max-w-screen-lg flex items-center justify-between px-5 py-3">
          <Link
            href="/"
            aria-label="Centavos · Inicio"
            className="font-display text-xl font-extrabold tracking-[-0.03em] text-mandarina-deep select-none"
          >
            centavos
          </Link>
          <nav className="flex items-center gap-5 text-[13px] font-semibold">
            <Link href="/app/privacidad" className="hover:text-mandarina-deep">
              Aviso de Privacidad
            </Link>
            <Link href="/" className="bg-ink text-bg rounded-full px-4 py-1.5 hover:opacity-85">
              La app
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[640px] px-5 pb-16 pt-10 md:pt-14">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-[-0.035em] leading-[1.0] mb-4">
          ¿Te echamos la mano?
        </h1>
        <p className="text-[15px] leading-relaxed text-ink-soft mb-8">
          Cuéntanos qué necesitas —un error en la app, una duda sobre tu cuenta o una idea
          para mejorar Centavos— y te respondemos al correo que nos dejes. Sin bots, sin
          vueltas.
        </p>

        <SoporteForm />
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto max-w-screen-lg px-5 py-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-ink-soft">
          <span className="font-display font-extrabold text-mandarina-deep text-sm">centavos</span>
          <Link href="/app/terminos" className="hover:text-mandarina-deep">Términos y Condiciones</Link>
          <Link href="/app/privacidad" className="hover:text-mandarina-deep">Aviso de Privacidad</Link>
          <Link href="/app/eliminar-cuenta" className="hover:text-mandarina-deep">Eliminar cuenta</Link>
          <a href="mailto:hola@centavos.mx" className="hover:text-mandarina-deep">hola@centavos.mx</a>
          <span className="ml-auto">© {new Date().getFullYear()} Centavos</span>
        </div>
      </footer>
    </>
  );
}
