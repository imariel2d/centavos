import type { Metadata } from "next";
import { AppHeader } from "@/components/home/AppHeader";
import { AppFooter } from "@/components/home/AppFooter";
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
      <AppHeader />

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

      <AppFooter />
    </>
  );
}
