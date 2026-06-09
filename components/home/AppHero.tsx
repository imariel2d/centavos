import type { HomeApp } from "@/types";

/** Hero principal de la home: pitch de la app + botones de tienda + screenshot. */
export function AppHero({ app }: { app: HomeApp }) {
  return (
    <section className="mx-auto max-w-screen-md px-5 pt-6 md:pt-12 pb-7">
      <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-10 items-center">
        <div>
          <div className="text-[11px] font-extrabold tracking-[0.06em] text-mandarina-deep uppercase mb-2.5">
            {app.kicker}
          </div>
          <h1 className="font-display text-[44px] md:text-[64px] font-extrabold tracking-[-0.045em] leading-[0.92] mb-3.5">
            {app.headline}
          </h1>
          {app.body && (
            <p className="text-[15px] md:text-lg leading-relaxed text-ink-soft mb-6">
              {app.body}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {app.storeUrl && (
              <a
                href={app.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3.5 bg-ink text-bg rounded-2xl px-4 py-2 card-hover"
              >
                <svg className="shrink-0" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.05 12.54c-.03-2.89 2.36-4.27 2.47-4.34-1.35-1.97-3.44-2.24-4.18-2.27-1.78-.18-3.47 1.05-4.37 1.05-.9 0-2.29-1.02-3.77-1-1.94.03-3.72 1.13-4.72 2.86-2.01 3.49-.51 8.66 1.45 11.49.96 1.39 2.1 2.94 3.6 2.89 1.45-.06 1.99-.93 3.74-.93s2.24.93 3.77.9c1.56-.03 2.54-1.41 3.49-2.81 1.1-1.61 1.55-3.17 1.58-3.25-.04-.01-3.03-1.16-3.06-4.59z" />
                  <path d="M14.16 4.05c.8-.97 1.34-2.32 1.19-3.66-1.15.05-2.55.77-3.38 1.74-.74.85-1.39 2.23-1.22 3.54 1.29.1 2.6-.65 3.41-1.62z" />
                </svg>
                <span className="text-left leading-snug whitespace-nowrap">
                  <span className="block text-[11px] opacity-70 uppercase tracking-wide">Descárgala en</span>
                  <span className="block font-display text-[18px] font-bold tracking-[-0.01em]">App Store</span>
                </span>
              </a>
            )}
            {app.playUrl && (
              <a
                href={app.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3.5 bg-ink text-bg rounded-2xl px-4 py-2 card-hover"
              >
                <svg className="shrink-0" width="23" height="23" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M3.6 1.8c-.36.38-.57.96-.57 1.71v17c0 .75.21 1.33.57 1.7l.09.09 9.52-9.52v-.22L3.69 1.71l-.09.09z" />
                  <path d="M16.39 15.94l-3.18-3.18v-.22l3.18-3.18.07.04 3.76 2.14c1.08.6 1.08 1.6 0 2.22l-3.76 2.14-.07.04z" />
                  <path d="M16.46 15.9l-3.25-3.26L3.6 22.25c.36.37.94.42 1.61.04l11.25-6.39z" />
                  <path d="M16.46 7.4L5.21 1.01c-.67-.38-1.25-.32-1.61.05l9.61 9.6 3.25-3.26z" />
                </svg>
                <span className="text-left leading-snug whitespace-nowrap">
                  <span className="block text-[11px] opacity-70 uppercase tracking-wide">Disponible en</span>
                  <span className="block font-display text-[18px] font-bold tracking-[-0.01em]">Google Play</span>
                </span>
              </a>
            )}
          </div>
        </div>

        {/* El screenshot ya trae su propio marco de teléfono (mockup);
            el marco CSS solo se usa como placeholder cuando falta. */}
        <div className="justify-self-center md:justify-self-end">
          {app.screenshotUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={app.screenshotUrl}
              alt={app.screenshotAlt}
              className="w-[230px] md:w-[260px] h-auto drop-shadow-xl"
              loading="eager"
            />
          ) : (
            <div className="w-[210px] md:w-[230px] aspect-[9/19] bg-ink rounded-[2.4rem] p-[9px] shadow-xl">
              <div className="relative w-full h-full bg-sand rounded-[1.9rem] overflow-hidden">
                <div className="absolute inset-0 grid place-items-center text-mandarina-deep text-[10px] uppercase tracking-wider font-bold text-center px-6">
                  screenshot de la app
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-[18px] bg-ink rounded-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
