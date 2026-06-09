import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppStoreBadges } from "@/components/home/AppStoreBadges";
import { PhoneFrame, PulsoMock, AnotarMock, SuscripcionesMock } from "@/components/home/PhoneMock";
import { getAppLinks } from "@/lib/articles";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "La app · Tu cuaderno de lana en el bolsillo",
  description:
    "Centavos es un cuaderno, no un banco. Anota tus gastos, bolsas y alcancías y por fin ve a dónde se va tu dinero. Sin conectar tu banco, sin sermones. Descárgala gratis.",
  alternates: { canonical: "/app" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/app`,
    title: "Centavos · Finans sin sustos",
    description: "Anota gastos, bolsas y alcancías. Sin conectar tu banco. Descárgala gratis.",
  },
};

const FEATURES = [
  { emoji: "📊", bg: "bg-peach", t: "Pulso diario", d: "Un semáforo te dice si vas bien, aguas o ya te pasaste. De un vistazo." },
  { emoji: "👛", bg: "bg-sand", t: "Bolsas", d: "Presupuesto por categoría. Te avisamos al 80% y cuando te pasas." },
  { emoji: "📺", bg: "bg-sky", t: "Suscripciones", d: "Netflix, Spotify, el gym. Sabes cuánto se va y cuándo te cobran." },
];

const STEPS = [
  { n: "01", t: "Descarga y crea tu cuenta", d: "30 segundos. Solo tu correo, sin tarjetas ni datos del banco." },
  { n: "02", t: "Anota lo que gastas", d: "Cada cafecito, cada Uber. El botón + lo hace en segundos." },
  { n: "03", t: "Mira a dónde se va tu lana", d: "El Pulso y las bolsas te muestran el panorama, sin sustos." },
];

const TRUST = ["No se conecta a tu banco", "Nunca toca tu dinero", "Tus datos son tuyos", "Hecho en México 🇲🇽"];

export const revalidate = 60; // ISR: recoge cambios de links desde Directus

export default async function AppPage() {
  const { storeUrl, playUrl } = await getAppLinks();

  return (
    <>
      <Header variant="minimal" />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-yolk/25 blur-2xl" aria-hidden />
          <div className="absolute top-40 -left-20 w-64 h-64 rounded-full bg-peach/40 blur-2xl" aria-hidden />

          <div className="relative mx-auto max-w-screen-lg px-5 pt-10 md:pt-16 pb-12 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2.5 bg-surface border border-rule rounded-full pl-4 pr-4 py-1.5 mb-5 whitespace-nowrap">
                <span className="font-hand text-mandarina-deep text-xl leading-none pr-0.5">¡nuevo!</span>
                <span className="w-px h-3.5 bg-rule" aria-hidden />
                <span className="text-[12px] font-bold text-ink-soft">El cuaderno de tu lana, ahora en app</span>
              </div>
              <h1 className="font-display text-[46px] md:text-[68px] font-extrabold tracking-[-0.045em] leading-[0.9] mb-5">
                Tu lana,<br />
                <span className="text-mandarina italic">en tu bolsillo</span>.
              </h1>
              <p className="text-[16px] md:text-lg leading-relaxed text-ink-soft max-w-md mb-7">
                Centavos es un cuaderno, no un banco. Anotas lo que gastas, lo que ahorras y lo que pagas — y por fin ves a dónde se va tu dinero. <b className="text-ink">Sin conectar tu banco. Sin sermones.</b>
              </p>
              <AppStoreBadges storeUrl={storeUrl} playUrl={playUrl} />
              {/*<div className="flex items-center gap-3 mt-6">*/}
              {/*  <div className="flex -space-x-2">*/}
              {/*    {["bg-mandarina", "bg-yolk", "bg-sky", "bg-peach"].map((c) => (*/}
              {/*      <span key={c} className={`${c} w-7 h-7 rounded-full border-2 border-bg`} aria-hidden />*/}
              {/*    ))}*/}
              {/*  </div>*/}
              {/*  <div className="text-[12px] text-ink-soft">*/}
              {/*    <b className="text-ink">★ 4.9</b> · +12 mil personas anotando su lana*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>

            <div className="flex justify-center md:justify-end">
              <PhoneFrame tilt={2}>
                <PulsoMock />
              </PhoneFrame>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="bg-ink text-bg">
          <div className="mx-auto max-w-screen-lg px-5 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
            {TRUST.map((t) => (
              <div key={t} className="flex items-center gap-2 text-[13px] font-semibold">
                <span className="text-yolk" aria-hidden>●</span> {t}
              </div>
            ))}
          </div>
        </section>

        {/* FEATURE 1 — Anota */}
        <section className="mx-auto max-w-screen-lg px-5 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center order-2 md:order-1">
            <PhoneFrame tilt={-2}>
              <AnotarMock />
            </PhoneFrame>
          </div>
          <div className="order-1 md:order-2">
            <div className="font-hand text-mandarina-deep text-3xl leading-none mb-2">rapidísimo</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.0] mb-4">
              Anota un gasto<br />en 5 segundos.
            </h2>
            <p className="text-[15px] md:text-base leading-relaxed text-ink-soft max-w-md mb-6">
              Sin formularios eternos. Escribes el monto, eliges la categoría y listo. El chiste es que sí lo hagas — por eso lo hicimos tan fácil que no da flojera.
            </p>
            <ul className="space-y-3">
              {[
                <><b>8 categorías</b> con emoji para que sea visual</>,
                <><b>Botón + flotante</b> en todas las pantallas</>,
                <>Una nota opcional para acordarte del <i>porqué</i></>,
              ].map((li, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-mandarina text-bg grid place-items-center text-[13px] font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-[14px]">{li}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FEATURE 2 — Suscripciones */}
        <section className="bg-peach">
          <div className="mx-auto max-w-screen-lg px-5 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="font-hand text-mandarina-deep text-3xl leading-none mb-2">sin cargos fantasma</div>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.0] mb-4">
                Tus suscripciones,<br />bajo control.
              </h2>
              <p className="text-[15px] md:text-base leading-relaxed text-ink/75 max-w-md mb-6">
                Netflix, Spotify, el gym, el iCloud que ya ni usas. Centavos suma todo lo que se te va en pagos recurrentes y te avisa antes de cada cobro. Por fin sabes cuánto cuesta tu &ldquo;solo son $99&rdquo;.
              </p>
              <div className="flex flex-wrap gap-2">
                {["📺 Netflix", "🎧 Spotify", "💪 Gym", "☁️ iCloud"].map((t) => (
                  <span key={t} className="bg-bg/60 rounded-full px-3 py-1.5 text-[12px] font-bold">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <PhoneFrame tilt={2}>
                <SuscripcionesMock />
              </PhoneFrame>
            </div>
          </div>
        </section>

        {/* FEATURE GRID */}
        <section className="mx-auto max-w-screen-lg px-5 py-14 md:py-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="text-[11px] font-extrabold tracking-wider text-mandarina-deep uppercase mb-2">Todo en un cuaderno</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.0]">
              Lo que Centavos lleva por ti
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {FEATURES.map((f) => (
              <div key={f.t} className="bg-surface border border-rule rounded-3xl p-6 card-hover">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} grid place-items-center text-2xl mb-4`}>{f.emoji}</div>
                <div className="font-display text-lg font-extrabold tracking-[-0.02em] mb-1">{f.t}</div>
                <p className="text-[13px] text-ink-soft leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-surface border-y border-rule">
          <div className="mx-auto max-w-screen-lg px-5 py-14 md:py-20">
            <div className="text-center mb-10">
              <div className="text-[11px] font-extrabold tracking-wider text-mandarina-deep uppercase mb-2">Así de fácil</div>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.0]">Empieza en 3 pasos</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {STEPS.map((s) => (
                <div key={s.n} className="text-center">
                  <div className="font-display text-6xl font-extrabold tracking-[-0.04em] text-ink/15">{s.n}</div>
                  <div className="font-display text-xl font-extrabold tracking-[-0.02em] mt-2 mb-1">{s.t}</div>
                  <p className="text-[14px] text-ink-soft leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS  - not yet*/}
        {/*<section className="mx-auto max-w-screen-lg px-5 py-14 md:py-20">*/}
        {/*  <div className="mb-8">*/}
        {/*    <div className="text-[11px] font-extrabold tracking-wider text-mandarina-deep uppercase mb-1.5">Historias reales</div>*/}
        {/*    <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-[-0.025em]">La banda ya anota su lana</h2>*/}
        {/*  </div>*/}
        {/*  <div className="grid md:grid-cols-3 gap-3">*/}
        {/*    {TESTIMONIALS.map((t) => (*/}
        {/*      <article key={t.name} className={`${t.bg} rounded-3xl p-6`}>*/}
        {/*        <div className="font-hand text-mandarina-deep text-3xl leading-none mb-2" aria-hidden>&ldquo;</div>*/}
        {/*        <p className="font-display text-[15px] font-semibold leading-snug tracking-[-0.01em] mb-5">{t.q}</p>*/}
        {/*        <div className="flex items-center gap-2.5">*/}
        {/*          <div className="w-8 h-8 rounded-full bg-ink/15" aria-hidden />*/}
        {/*          <div>*/}
        {/*            <div className="text-xs font-bold">{t.name}</div>*/}
        {/*            <div className="text-[10px] opacity-60">{t.city}</div>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </article>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</section>*/}

        {/* FINAL CTA */}
        <section className="mx-auto max-w-screen-lg py-14 px-5 pb-16">
          <div className="bg-mandarina text-ink rounded-[32px] px-6 md:px-12 py-12 md:py-16 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-yolk/50" aria-hidden />
            <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-mandarina-deep/30" aria-hidden />
            <div className="relative max-w-lg">
              <div className="font-hand text-2xl leading-none mb-2">¿le entras?</div>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-[-0.035em] leading-[0.92] mb-4">
                Tu lana te<br />está esperando.
              </h2>
              <p className="text-[15px] md:text-lg leading-relaxed mb-7 opacity-90">
                Descarga Centavos gratis y empieza a anotar hoy. Tu yo del futuro te lo va a agradecer.
              </p>
              <AppStoreBadges storeUrl={storeUrl} playUrl={playUrl} />
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="mx-auto max-w-screen-lg px-5 pb-10">
          <p className="text-center text-[11px] text-ink-soft/80 leading-relaxed max-w-xl mx-auto">
            * Las pantallas mostradas son ilustrativas y pueden variar de la app real.
            Cifras y datos en las imágenes son de ejemplo.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
