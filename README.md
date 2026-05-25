# Centavo

Blog financiero mexicano hecho con **Next.js 15 + React 19 + TypeScript + Tailwind v4**. App Router, Server Components por default. Mobile-first.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript (strict)
- **Estilos:** Tailwind v4 (config en CSS via `@theme`)
- **Renderizado:** SSG + ISR (`revalidate: 3600`) — cambia a `force-dynamic` por ruta si necesitas tiempo real
- **Fuentes:** `next/font` (Bricolage Grotesque, Manrope, Caveat)
- **SEO:** Metadata API + JSON-LD + sitemap dinámico + robots

## Estructura

```
app/
  layout.tsx                  → fuentes, metadata raíz, JSON-LD organización
  page.tsx                    → home largo
  sitemap.ts                  → sitemap dinámico
  robots.ts                   → robots.txt
  not-found.tsx               → 404
  articulos/[slug]/page.tsx   → artículo individual + ELI5 toggle (?eli5=1)
  categorias/[slug]/page.tsx  → listado por categoría
  buscar/page.tsx             → buscador (?q=)
  glosario/page.tsx           → glosario A–Z
  nosotros/page.tsx           → acerca de

components/                   → UI compartida (RSC + un par de "use client")
lib/
  articles.ts                 → capa de datos. Reemplaza estas funciones por llamadas al CMS.
  seo.ts                      → helpers de JSON-LD
data/mock.ts                  → contenido de ejemplo (sustituible por CMS)
types/index.ts                → tipos compartidos
```

## Empezar

```bash
pnpm install        # o npm install / yarn install
cp .env.example .env.local
pnpm dev            # http://localhost:3000
```

## Cuando conectes el CMS

1. Mete las creds en `.env.local`.
2. Reemplaza el cuerpo de las funciones en `lib/articles.ts` por llamadas al CMS.
3. Los componentes y rutas ya consumen esas funciones — nada más cambia.

Estructura mínima que debe devolver tu CMS por artículo:

```ts
{
  slug, title, excerpt, category, author,
  publishedAt: ISO8601,
  readMinutes: number,
  heroImage: { url, alt, caption? },
  body: ArticleBlock[]         // ver types/index.ts
}
```

Para WYSIWYG complejos (Sanity Portable Text, Contentful Rich Text, etc.) escribe un mapper de tu formato → `ArticleBlock[]` en `lib/articles.ts`.

## SEO

- **Metadata por ruta** vía `generateMetadata()` (titles, descriptions, OG, Twitter Cards).
- **JSON-LD** en cada artículo (`Article`), home (`Organization` + `WebSite`), glosario (`DefinedTerm`), breadcrumbs.
- **Sitemap dinámico** en `/sitemap.xml`.
- **URLs limpias en español:** `/articulos/como-cambiar-afore`.
- **`hreflang`** listo para añadir si haces versión LATAM/ES.
- Pendiente cuando subas a prod:
  - Pon tu `NEXT_PUBLIC_SITE_URL` real
  - Reemplaza placeholders en `app/layout.tsx` (publisher, twitter handle)
  - Registra el sitio en Google Search Console y Bing Webmaster
  - Conecta Plausible/Umami para analytics

## Comandos

```bash
pnpm dev          # desarrollo
pnpm build        # producción
pnpm start        # servidor de producción
pnpm typecheck    # verificar tipos
pnpm lint         # eslint
```
