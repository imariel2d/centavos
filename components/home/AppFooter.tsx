import Link from "next/link";
import { Logo } from "@/components/Logo";

/**
 * Footer de la landing de la app (/). Reúne los enlaces legales y de soporte
 * de las páginas /app/* (Términos, Privacidad, Eliminar cuenta, Soporte) pero
 * con el estilo oscuro del footer del blog (Logo + lema + columnas).
 */
export function AppFooter() {
  const cols = [
    { h: "Soporte", items: [
      { name: "Soporte",        href: "/app/soporte" },
      { name: "Eliminar cuenta", href: "/app/eliminar-cuenta" },
      { name: "Contacto",        href: "/app/soporte" },
    ]},
    { h: "Legal", items: [
      { name: "Términos y Condiciones", href: "/app/terminos" },
      { name: "Aviso de Privacidad",    href: "/app/privacidad" },
    ]},
  ];

  return (
    <footer className="bg-ink text-bg">
      <div className="mx-auto max-w-screen-lg px-5 py-10 md:py-14">
        <Logo size={30} color="var(--color-bg)" dotColor="var(--color-mandarina)" />
        <p className="font-hand text-mandarina text-2xl mt-4 mb-2">
          Le ayudamos a la gente a perderle el miedo a las finanzas.
        </p>

        <div className="grid grid-cols-2 gap-6 mt-8">
          {cols.map((col) => (
            <div key={col.h}>
              <div className="text-[10px] font-extrabold tracking-[0.06em] text-mandarina uppercase mb-3">
                {col.h}
              </div>
              <ul className="space-y-1.5">
                {col.items.map((it) => (
                  <li key={it.name}>
                    <Link href={it.href} className="text-[13px] text-bg/75 hover:text-bg">
                      {it.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-5 border-t border-bg/10 text-[10px] text-bg/50 tracking-wide flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>© {new Date().getFullYear()} Centavos</span>
        </div>
      </div>
    </footer>
  );
}
