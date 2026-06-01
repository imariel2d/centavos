/**
 * Nota editorial mostrada al pie de cada artículo: algunas historias o
 * personajes pueden estar exagerados o redactados con ayuda de IA, pero
 * los números y cálculos son precisos.
 *
 * Server component — lee RESEND_REPLY_TO en tiempo de render para mostrar
 * el contacto de dudas. Si no está configurado, oculta la línea.
 */
export function EditorialDisclaimer() {
  const contactEmail = process.env.RESEND_REPLY_TO;

  return (
    <section className="px-4 pt-8" aria-label="Nota editorial">
      <aside className="bg-surface border border-rule rounded-2xl px-5 py-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span aria-hidden className="text-base">ℹ️</span>
          <div className="font-display text-[12px] font-extrabold uppercase tracking-[0.06em] text-ink-soft">
            Nota editorial
          </div>
        </div>
        <p className="text-[12px] leading-relaxed text-ink/75">
          Algunas historias y personajes pueden estar <strong>exagerados</strong> o
          haber sido redactados con ayuda de <strong>inteligencia artificial</strong> para
          ilustrar mejor el tema. Los <strong>números, datos y cálculos</strong> son
          precisos — nunca buscamos desinformar.
          {contactEmail && (
            <>
              {" "}¿Dudas? Escríbenos a{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-bold text-ink underline underline-offset-2 hover:text-mandarina-deep"
              >
                {contactEmail}
              </a>
              .
            </>
          )}
        </p>
      </aside>
    </section>
  );
}
