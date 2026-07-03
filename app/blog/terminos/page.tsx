import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de Centavos.",
  alternates: { canonical: `${SITE.url}/blog/terminos` },
};

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-screen-md px-5 py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.03em] leading-tight mb-2">
          Términos y Condiciones
        </h1>
        <p className="text-[13px] text-ink-soft mb-8">Última actualización: mayo 2025</p>

        <article className="prose-centavo space-y-6 text-[15px] leading-relaxed text-ink">
          <section>
            <h2 className="font-display text-xl font-bold mb-3">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar Centavos (en adelante, &quot;el sitio&quot;), aceptas estos
              términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte,
              te pedimos que no utilices el sitio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">2. Naturaleza del contenido</h2>
            <p>
              Todo el contenido publicado en Centavos es <strong>únicamente informativo y
              educativo</strong>. No constituye asesoría financiera, legal, fiscal ni de
              inversión. Las decisiones financieras son responsabilidad exclusiva de cada usuario.
            </p>
            <p>
              Te recomendamos consultar a un profesional certificado antes de tomar cualquier
              decisión financiera basada en lo que leas aquí.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">3. Historias y testimonios</h2>
            <p>
              Las historias, testimonios y casos presentados en el sitio pueden estar
              <strong> modificados, resumidos, censurados o exagerados</strong> con fines
              editoriales, narrativos o de protección de identidad. Los nombres, edades,
              ubicaciones y detalles personales pueden haber sido alterados.
            </p>
            <p>
              Estas historias se incluyen para ilustrar conceptos financieros y no deben
              interpretarse como garantía de resultados. Cada situación financiera es única.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">4. Precisión de la información</h2>
            <p>
              Hacemos nuestro mejor esfuerzo por mantener la información actualizada y precisa.
              Sin embargo, las leyes, regulaciones, tasas de interés, comisiones y productos
              financieros cambian constantemente. No garantizamos que toda la información esté
              vigente en el momento en que la leas.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">5. Propiedad intelectual</h2>
            <p>
              Todo el contenido del sitio — textos, ilustraciones, diseño, código y marca — es
              propiedad de Centavos o de sus respectivos autores. No está permitida su
              reproducción total o parcial sin autorización previa por escrito.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">6. Enlaces a terceros</h2>
            <p>
              El sitio puede contener enlaces a páginas de terceros (instituciones financieras,
              reguladores, herramientas). No nos hacemos responsables del contenido, políticas
              de privacidad ni prácticas de esos sitios externos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">7. Limitación de responsabilidad</h2>
            <p>
              Centavos, sus autores y colaboradores no serán responsables por daños directos,
              indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad
              de uso del sitio o de la información contenida en él.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">8. Uso aceptable</h2>
            <p>Te comprometes a no:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Usar el sitio para actividades ilegales o no autorizadas.</li>
              <li>Intentar acceder a áreas restringidas del sitio o sus sistemas.</li>
              <li>Reproducir o distribuir el contenido sin autorización.</li>
              <li>Suplantar la identidad de Centavos o sus autores.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">9. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Los cambios entran en vigor al ser publicados en esta página. El uso continuado
              del sitio después de cualquier modificación constituye la aceptación de los
              nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">10. Legislación aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de los Estados Unidos Mexicanos.
              Cualquier controversia será resuelta ante los tribunales competentes en
              la Ciudad de México.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
