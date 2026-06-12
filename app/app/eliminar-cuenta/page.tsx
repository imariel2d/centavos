import type { Metadata } from "next";
import { LegalShell, LegalSectionBlock, type LegalSection } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Eliminar tu cuenta · App Centavos",
  description:
    "Cómo eliminar tu cuenta de Centavos: desde la app en Configuraciones > Perfil > Eliminar Cuenta, o enviando un correo a hola@centavos.mx con el asunto «Eliminar cuenta».",
  alternates: { canonical: "/app/eliminar-cuenta" },
};

const SECTIONS: LegalSection[] = [
  { id: "seccion-1", title: "Eliminar tu cuenta desde la app" },
  { id: "seccion-2", title: "Solicitar la eliminación por correo" },
  { id: "seccion-3", title: "Qué pasa con tus datos" },
];

export default function EliminarCuentaPage() {
  return (
    <LegalShell
      title="Eliminar tu cuenta"
      updated="12 de junio de 2026"
      intro={
        <p>
          En <b className="text-ink">Centavos</b> puedes irte cuando quieras, sin trámites raros
          ni preguntas incómodas. Aquí te explicamos las dos formas de eliminar tu cuenta y qué
          pasa con tus datos cuando lo haces.
        </p>
      }
      sections={SECTIONS}
      crossLink={{ href: "/app/privacidad", label: "Aviso de Privacidad" }}
    >
      <LegalSectionBlock n={1} title="Eliminar tu cuenta desde la app">
        <p>La forma más rápida es hacerlo directamente desde la app:</p>
        <ul>
          <li>Abre la app y entra a <b>Configuraciones</b>.</li>
          <li>Selecciona <b>Perfil</b>.</li>
          <li>Toca <b>Eliminar Cuenta</b> y confirma.</li>
        </ul>
        <p>
          Es decir: <b>Configuraciones &gt; Perfil &gt; Eliminar Cuenta</b>. La eliminación es
          inmediata y no necesitas contactarnos para nada más.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock n={2} title="Solicitar la eliminación por correo">
        <p>
          Si prefieres (o ya no tienes acceso a la app), también puedes pedirnos que eliminemos tu
          cuenta por correo. Escríbenos a{" "}
          <a href="mailto:hola@centavos.mx?subject=Eliminar%20cuenta">hola@centavos.mx</a> con el
          asunto <b>&ldquo;Eliminar cuenta&rdquo;</b>, desde el correo electrónico con el que te
          registraste, y nosotros nos encargamos del resto.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock n={3} title="Qué pasa con tus datos">
        <p>
          Al eliminar tu cuenta, eliminamos tus datos personales —tu perfil, tus gastos, tus
          presupuestos, tus alcancías y tus suscripciones— en un plazo razonable, salvo aquellos
          que debamos conservar por obligación legal. Puedes leer más en nuestro{" "}
          <a href="/app/privacidad">Aviso de Privacidad</a>.
        </p>
        <p>
          <b>La eliminación es definitiva:</b> una vez eliminada tu cuenta, no podemos recuperar
          tu información. Si más adelante quieres volver, tendrás que crear una cuenta nueva.
        </p>
      </LegalSectionBlock>
    </LegalShell>
  );
}
