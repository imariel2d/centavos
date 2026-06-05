import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const hasContact = Boolean(process.env.CONTACT_EMAIL);

  // "Newsletter" and "Contacto" depend on CONTACT_EMAIL being configured.
  const centavoItems = [
    { name: "Acerca de", href: "/nosotros" },
    { name: "Equipo",    href: "/nosotros#equipo" },
    ...(hasContact
      ? [
          { name: "Newsletter", href: "#newsletter" },
          { name: "Contacto",   href: "/nosotros#contacto" },
        ]
      : []),
  ];

  const cols = [
    { h: "Temas", items: [
      { name: "Ahorro",   href: "/categorias/ahorro"   },
      { name: "Créditos", href: "/categorias/creditos" },
      { name: "AFORE",    href: "/categorias/afore"    },
      { name: "PPR",      href: "/categorias/ppr"      },
    ]},
    { h: "Centavo", items: centavoItems },
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
          <Link href="/privacidad" className="hover:text-bg">Privacidad</Link>
          <Link href="/terminos" className="hover:text-bg">Términos</Link>
        </div>
      </div>
    </footer>
  );
}
