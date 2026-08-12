import type { Article, Author, Category, GlossaryTerm, HomePageData, Story } from "@/types";

// ──────────────────────────────────────────────────────────────
// Datos de ejemplo. Cuando conectes el CMS, esto desaparece —
// los selectores de lib/articles.ts apuntarán al CMS en su lugar.
// ──────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  { slug: "ahorro",    name: "Ahorro",   blurb: "Guardar varo sin sufrir",     count: 24 },
  { slug: "creditos",  name: "Créditos", blurb: "Tarjetas, préstamos y Buró",  count: 18 },
  { slug: "afore",     name: "AFORE",    blurb: "Tu retiro, sin choros",       count: 12 },
  { slug: "ppr",       name: "PPR",      blurb: "Planes personales de retiro", count:  9 },
];

export const AUTHORS: Record<string, Author> = {
  sofia: { slug: "sofia-mendoza",   name: "Sofía Mendoza",    role: "Editora · Ahorro",        avatarColor: "#ed7e3c" },
  diego: { slug: "diego-ramirez",   name: "Diego Ramírez",    role: "Créditos · ex-hipotecario", avatarColor: "#f5b833" },
  ana:   { slug: "ana-vargas",      name: "Ana Lucía Vargas", role: "AFORE & PPR",             avatarColor: "#cfe1e8" },
};

export const STORIES: Story[] = [
  { name: "Mariana, 26", role: "Diseñadora · CDMX",       quote: "Pensaba que ahorrar era para gente que ganaba millones. Empecé con $200 al mes. Hoy llevo $48,000." },
  { name: "Carlos, 29",  role: "Repartidor · Guadalajara", quote: "Le tenía pánico al Buró. Resultó que ni siquiera estaba ahí. Ahora ya saqué mi primera tarjeta." },
  { name: "Renata, 24",  role: "Estudiante · Monterrey",  quote: "Me cambié de AFORE en una tarde. Lo que voy a ganar de más vale unos cuantos viajes a la playa." },
];

export const GLOSSARY: GlossaryTerm[] = [
  { slug: "afore",   term: "AFORE",    category: "afore",    definition: "Administradora de Fondos para el Retiro. La empresa que cuida tu lana para cuando estés ruco.", eli5: "Como una alcancía que alguien más cuida y hace crecer." },
  { slug: "buro",    term: "Buró",     category: "creditos", definition: "Sociedad que guarda tu historial de pagos. NO es lista negra.",                                  eli5: "Tu boleta de calificaciones financieras." },
  { slug: "cat",     term: "CAT",      category: "creditos", definition: "Costo Anual Total. Lo que de verdad pagas por un crédito, ya con todas las comisiones.",         eli5: "El precio real de un crédito, sin trampas." },
  { slug: "cetes",   term: "CETES",    category: "ahorro",   definition: "Certificados de la Tesorería. Le prestas lana al gobierno y te pagan intereses fijos.",          eli5: "El gobierno te pide prestado y te paga por la espera." },
  { slug: "gat",     term: "GAT Real", category: "ahorro",   definition: "Ganancia Anual Total Real. Lo que de verdad ganas en una cuenta, ya con inflación e impuestos.", eli5: "Lo que sí te queda al final, no lo que promete el banco." },
  { slug: "ppr",     term: "PPR",      category: "ppr",      definition: "Plan Personal de Retiro. Una cuenta donde ahorras para el retiro y pagas menos impuestos.",      eli5: "Una alcancía que el SAT premia con menos impuestos." },
  { slug: "siefore", term: "SIEFORE",  category: "afore",    definition: "Sociedad de Inversión donde tu AFORE invierte tu lana según tu edad.",                            eli5: "El cajón específico donde está guardada tu lana." },
];

// ──────────────────────────────────────────────────────────────
// Artículos
// ──────────────────────────────────────────────────────────────
export const ARTICLES: Article[] = [
  {
    slug: "como-cambiar-afore-5-minutos",
    title: "Cómo cambiar tu AFORE en 5 minutos (y por qué te conviene)",
    short: "Cambiar de AFORE en 5 minutos",
    category: "afore",
    author: AUTHORS.ana,
    publishedAt: "2026-05-12",
    readMinutes: 6,
    excerpt: "Sí, te puedes cambiar. No, no es complicado. Sí, te puede dar miles de pesos más al retirarte.",
    heroImage: { alt: "Foto editorial sobre AFORE", caption: "Cambiarte de AFORE toma menos tiempo del que crees." },
    body: [
      { type: "paragraph", html: "Seguramente nunca has pensado en tu AFORE. La mayoría de los mexicanos tampoco. Y eso es justo lo que el sistema espera: que no le pongas atención." },
      { type: "paragraph", html: "Una <b>AFORE</b> (Administradora de Fondos para el Retiro) es una empresa que administra tu dinero para el retiro. Si trabajas formalmente, ya tienes una asignada — la cosa es que probablemente no es la mejor." },
      { type: "tip", title: "Tip rápido", html: "Si trabajas formalmente, ya tienes una AFORE asignada. Revísala en consar.gob.mx con tu CURP." },
      { type: "heading", level: 2, text: "Cuánto puedes ganar al cambiarte", id: "ganar" },
      { type: "paragraph", html: "La diferencia entre la AFORE más cara y la más barata, a 30 años, puede ser brutal:" },
      { type: "chart", title: "Tu lana a 30 años", subtitle: "Aportación mensual de $1,500 mxn",
        primary:   { label: "AFORE barata", value: "$1.8M" },
        secondary: { label: "AFORE cara",   value: "$1.2M" } },
      { type: "pullquote", text: "Cambiarte puede valerte cientos de miles de pesos al retirarte." },
      { type: "story", name: "Renata, 24", role: "Estudiante · Monterrey", quote: "Me cambié de AFORE en una tarde. Lo que voy a ganar de más vale unos cuantos viajes a la playa." },
      { type: "recap", title: "Lo que aprendiste", items: [
        "Una AFORE es donde se guarda tu lana para el retiro",
        "Sí te puedes cambiar — toma 5 minutos",
        "Elige por rendimiento neto, no por marca",
        "Revísala mínimo 1 vez al año",
      ]},
    ],
    bodyEli5: [
      { type: "paragraph", html: "Imagínate que tienes una alcancía gigante. La metes, le pones lana cada mes, y alguien la cuida y la hace crecer. Esa alcancía es tu <b>AFORE</b>." },
      { type: "paragraph", html: "Cuando trabajas formalmente, una parte de tu sueldo se va automáticamente a esa alcancía. Tú y tu chamba la van llenando." },
      { type: "paragraph", html: "Lo importante: <b>no todas las alcancías son iguales</b>. Unas cobran más por cuidártela. Otras hacen que la lana crezca más rápido." },
      { type: "tip", title: "Tip rápido", html: "Pregúntale a tu jefe en cuál AFORE estás. Si no sabe, marca al 01-800-AFORE-01. Gratis." },
      { type: "heading", level: 2, text: "Cuánto puedes ganar", id: "ganar" },
      { type: "chart", title: "Tu lana a 30 años", subtitle: "Si guardas $1,500 al mes",
        primary:   { label: "Buena alcancía", value: "$1.8M" },
        secondary: { label: "Alcancía cara",  value: "$1.2M" } },
      { type: "pullquote", text: "Cambiarte de AFORE es como cambiarte de plan de celular: nada del otro mundo." },
      { type: "story", name: "Renata, 24", role: "Estudiante · Monterrey", quote: "Me cambié de AFORE en una tarde. Lo que voy a ganar de más vale unos cuantos viajes a la playa." },
      { type: "recap", title: "Lo que aprendiste", items: [
        "Una AFORE es una alcancía gigante",
        "Sí te puedes cambiar — toma 5 minutitos",
        "Elige la que cobre menos y rinda más",
        "Revísala una vez al año",
      ]},
    ],
  },
  {
    slug: "primera-tarjeta-de-credito",
    title: "Tu primera tarjeta de crédito sin morir en el intento",
    short: "Tu primera tarjeta",
    category: "creditos",
    author: AUTHORS.diego,
    publishedAt: "2026-05-09",
    readMinutes: 8,
    excerpt: "Para que no acabes pagando intereses por un café que tomaste hace 8 meses.",
    heroImage: { alt: "Foto sobre tarjetas de crédito" },
    body: [
      { type: "paragraph", html: "Sacar tu primera tarjeta de crédito es un parteaguas. Bien usada, te abre puertas. Mal usada, te puede arruinar 5 años." },
      { type: "heading", level: 2, text: "Qué buscar en tu primera tarjeta", id: "buscar" },
      { type: "paragraph", html: "Lo más importante: <b>el CAT</b> (Costo Anual Total). Es lo que de verdad cuesta el crédito, no la tasa bonita del anuncio." },
    ],
  },
  {
    slug: "ppr-vs-afore",
    title: "PPR vs AFORE: qué es qué y cuál te late más",
    short: "PPR vs AFORE",
    category: "ppr",
    author: AUTHORS.ana,
    publishedAt: "2026-05-05",
    readMinutes: 9,
    excerpt: "Spoiler: no son enemigos. Funcionan mejor juntos. Te explicamos sin choro.",
    heroImage: { alt: "Foto sobre planes de retiro" },
    body: [
      { type: "paragraph", html: "Mucha gente piensa que tiene que elegir entre AFORE y PPR. La verdad: lo ideal es tener los dos, pero por razones distintas." },
    ],
  },
  {
    slug: "ahorrar-ganando-15000",
    title: "Cómo guardar lana cuando ganas $15,000 al mes",
    short: "Ahorrar ganando $15,000",
    category: "ahorro",
    author: AUTHORS.sofia,
    publishedAt: "2026-05-01",
    readMinutes: 5,
    excerpt: "Sin renunciar al café, sin volverte ermitaño. Tres reglas que sí funcionan en la vida real.",
    heroImage: { alt: "Foto sobre ahorrar con sueldo limitado" },
    body: [
      { type: "paragraph", html: "Si ganas $15,000 al mes en CDMX o Monterrey, ya sabes que ahorrar parece chiste. Pero sí se puede. Tres reglas, sin choro." },
    ],
  },
  {
    slug: "interes-compuesto-tacos",
    title: "El interés compuesto explicado con tacos",
    short: "Interés compuesto con tacos",
    category: "ahorro",
    author: AUTHORS.diego,
    publishedAt: "2026-04-28",
    readMinutes: 4,
    excerpt: "La octava maravilla del mundo, pero con salsa verde. Te lo prometemos.",
    heroImage: { alt: "Ilustración con tacos representando interés compuesto" },
    body: [
      { type: "paragraph", html: "Einstein lo llamó la octava maravilla del mundo. Nosotros vamos a llamarle: tus tacos, multiplicándose solos." },
    ],
  },
  {
    slug: "buro-de-credito-sin-miedo",
    title: "Buró de Crédito: deja de tenerle miedo al coco",
    short: "Buró de Crédito sin miedo",
    category: "creditos",
    author: AUTHORS.ana,
    publishedAt: "2026-04-24",
    readMinutes: 7,
    excerpt: "El Buró no es una lista negra. Es tu historial. Y sí, lo puedes mejorar.",
    heroImage: { alt: "Foto sobre el Buró de Crédito" },
    body: [
      { type: "paragraph", html: "El miedo al Buró viene de un malentendido enorme: la gente cree que es una lista negra de morosos. No lo es." },
    ],
  },
];

// ──────────────────────────────────────────────────────────────
// Home Page — curated sections (singleton in Directus)
// ──────────────────────────────────────────────────────────────
export const HOME_PAGE: HomePageData = {
  starterSteps: [
    { article: ARTICLES[3], color: "peach" }, // ahorrar-ganando-15000
    { article: ARTICLES[5], color: "sand" },  // buro-de-credito-sin-miedo
    { article: ARTICLES[0], color: "sky" },   // como-cambiar-afore-5-minutos
  ],
  trending: [ARTICLES[0], ARTICLES[1], ARTICLES[2], ARTICLES[3], ARTICLES[4]],
  moreArticles: [ARTICLES[1], ARTICLES[2], ARTICLES[3], ARTICLES[4], ARTICLES[5]],
  ad: {
    label: "Anuncio",
    brand: "El Culto al Perro Café",
    headline: "Café de especialidad tostado en lotes pequeños",
    body: "Bolsas de 250g, grano entero o molido. Envío a todo México.",
    cta: "Comprar ahora",
    href: "https://elcultoalperrocafe.com/?ref=centavos",
    imageUrl: "https://images.unsplash.com/photo-1559525839-d9acfd5b35a4?w=600&q=70",
    imageAlt: "Bolsa de café El Culto al Perro Café",
  },
};

// Store links de la app (home_page.app_store_url / app_play_url en Directus).
export const APP_LINKS = {
  storeUrl: "https://apps.apple.com/mx/app/centavos/id6781459932",
  playUrl: "https://play.google.com/store/apps/details?id=mx.centavos.cuaderno",
};
