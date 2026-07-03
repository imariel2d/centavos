import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description: "Aviso de privacidad de Centavos. Cómo recopilamos, usamos y protegemos tu información.",
  alternates: { canonical: `${SITE.url}/blog/privacidad` },
};

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-screen-md px-5 py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.03em] leading-tight mb-2">
          Aviso de Privacidad
        </h1>
        <p className="text-[13px] text-ink-soft mb-8">Última actualización: mayo 2025</p>

        <article className="prose-centavo space-y-6 text-[15px] leading-relaxed text-ink">
          <section>
            <h2 className="font-display text-xl font-bold mb-3">1. Responsable</h2>
            <p>
              Centavos (en adelante, &quot;nosotros&quot;) es una publicación digital independiente
              con domicilio en México. Somos responsables del tratamiento de los datos personales
              que nos proporciones.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">2. Datos que recopilamos</h2>
            <p>Podemos recopilar la siguiente información:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia y dispositivo utilizado.</li>
              <li><strong>Datos de contacto:</strong> correo electrónico, únicamente si decides suscribirte a nuestro newsletter o contactarnos directamente.</li>
              <li><strong>Datos analíticos:</strong> utilizamos herramientas de analítica (como Vercel Analytics) para entender cómo se usa el sitio. Estos datos son agregados y anónimos.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">3. Finalidad del tratamiento</h2>
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Mejorar el contenido y la experiencia de navegación.</li>
              <li>Enviarte el newsletter (solo si te suscribiste).</li>
              <li>Responder tus mensajes o consultas.</li>
              <li>Generar estadísticas de uso del sitio.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">4. Cookies y tecnologías similares</h2>
            <p>
              Usamos cookies estrictamente necesarias para el funcionamiento del sitio y cookies
              analíticas para medir el rendimiento. No usamos cookies de publicidad ni rastreo
              de terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">5. Compartición de datos</h2>
            <p>
              No vendemos, intercambiamos ni transferimos tus datos personales a terceros,
              salvo proveedores de servicios esenciales (hosting, analítica, envío de correo)
              que están obligados a mantener la confidencialidad de tu información.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">6. Derechos ARCO</h2>
            <p>
              Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus
              datos personales (derechos ARCO). Para ejercer cualquiera de estos derechos,
              contáctanos a través de los medios indicados en la sección de contacto de nuestro sitio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">7. Seguridad</h2>
            <p>
              Implementamos medidas de seguridad técnicas y administrativas para proteger tus datos
              contra acceso no autorizado, pérdida o alteración. Sin embargo, ningún sistema es
              100% infalible, por lo que no podemos garantizar seguridad absoluta.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">8. Menores de edad</h2>
            <p>
              Nuestro sitio no está dirigido a menores de 13 años. No recopilamos intencionalmente
              datos de menores. Si eres padre o tutor y crees que un menor nos proporcionó datos,
              contáctanos para eliminarlos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">9. Cambios a este aviso</h2>
            <p>
              Nos reservamos el derecho de modificar este aviso de privacidad en cualquier momento.
              Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
