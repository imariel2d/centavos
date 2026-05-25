import Link from "next/link";
import { Logo } from "./Logo";

const FOOTER_COLS = [
  { h: "Temas", items: [
    { name: "Ahorro",   href: "/categorias/ahorro"   },
    { name: "Créditos", href: "/categorias/creditos" },
    { name: "AFORE",    href: "/categorias/afore"    },
    { name: "PPR",      href: "/categorias/ppr"      },
  ]},
  { h: "Centavo", items: [
    { name: "Acerca de",   href: "/nosotros" },
    { name: "Equipo",      href: "/nosotros#equipo" },
    { name: "Newsletter",  href: "#newsletter" },
    { name: "Contacto",    href: "/nosotros#contacto" },
  ]},
  { h: "Recursos", items: [
    { name: "Glosario",      href: "/glosario" },
    { name: "Calculadoras",  href: "#" },
    { name: "Guías",         href: "#" },
  ]},
  { h: "Legales", items: [
    { name: "Privacidad", href: "#" },
    { name: "Términos",   href: "#" },
    { name: "Cookies",    href: "#" },
  ]},
];

export function Footer() {
  return (
    <footer className="bg-ink text-bg">
      <div className="mx-auto max-w-screen-lg px-5 py-10 md:py-14">
        <Logo size={30} color="var(--color-bg)" dotColor="var(--color-mandarina)" />
        <p className="font-hand text-mandarina text-2xl mt-4 mb-2">
          Le ayudamos a la banda a perderle el miedo a las finanzas.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {FOOTER_COLS.map((col) => (
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

        <div className="mt-8 pt-5 border-t border-bg/10 text-[10px] text-bg/50 tracking-wide">
          © {new Date().getFullYear()} Centavo · Hecho en CDMX con harto cafecito
        </div>
      </div>
    </footer>
  );
}
