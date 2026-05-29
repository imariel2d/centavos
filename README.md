# Centavo

Blog financiero mexicano hecho con **Next.js 16 + React 19 + TypeScript + Tailwind v4** y un CMS **Directus** local. App Router, Server Components por default. Mobile-first.

## Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Lenguaje:** TypeScript (strict)
- **Estilos:** Tailwind v4 (config en CSS via `@theme`)
- **CMS:** Directus 11 (Postgres 16 + Redis), corriendo en `docker compose`
- **Renderizado:** ISR (`revalidate: 3600`) — cambia a `force-dynamic` por ruta si necesitas tiempo real
- **Fuentes:** `next/font` (Bricolage Grotesque, Manrope, Caveat)
- **SEO:** Metadata API + JSON-LD + sitemap dinámico + robots

## Estructura

```
app/
  layout.tsx                       → fuentes, metadata raíz, JSON-LD Organización
  page.tsx                         → home (composición de components/home/*)
  sitemap.ts                       → sitemap dinámico
  robots.ts                        → robots.txt
  not-found.tsx                    → 404
  articulos/[slug]/page.tsx        → artículo + ELI5 toggle (?eli5=1)
  categorias/[slug]/page.tsx       → listado por categoría
  buscar/page.tsx                  → buscador (?q=)
  glosario/page.tsx                → glosario A–Z
  nosotros/page.tsx                → acerca de
  api/cms/assets/[id]/route.ts     → proxy Next → Directus para imágenes

components/
  home/*                           → secciones 1–16 del home
  Header.tsx, Footer.tsx, ...      → UI compartida (RSC + un par de "use client")
  Eli5Toggle.tsx, NewsletterForm.tsx, CalculatorPreview.tsx → componentes "use client"

lib/
  articles.ts                      → capa de datos (Directus o mock — ver toggle)
  directus.ts                      → fetch helper con bearer token y proxy de assets
  data-source.ts                   → flag USE_MOCK_DATA
  format.ts                        → categoryName(), formatDate()
  seo.ts                           → helpers de JSON-LD

data/mock.ts                       → contenido de ejemplo (solo si USE_MOCK_DATA=true)
types/index.ts                     → contrato del dominio (Article, Author, …)

directus/
  bootstrap.mjs                    → crea collections, relations, role "Web" y token
  seed.mjs                         → carga data/mock.ts a Directus

docker-compose.yml                 → Directus + Postgres + Redis
```

## Empezar (con Directus)

Requiere Docker y Node.

```bash
docker compose up -d                  # levanta Directus + Postgres + Redis
node directus/bootstrap.mjs           # crea schema, relations, perms; escribe DIRECTUS_TOKEN en .env.local
node directus/seed.mjs                # carga data/mock.ts a Directus (opcional)

cp .env.example .env.local            # ajusta NEXT_PUBLIC_SITE_URL, CONTACT_EMAIL, etc.
bun install
bun run dev                           # http://localhost:3000
```

Admin de Directus: <http://localhost:8055> (`admin@centavos.mx` / `admin`).

### Toggle mock ↔ Directus

```bash
# .env.local
USE_MOCK_DATA=true     # sirve desde data/mock.ts, no necesita Directus
USE_MOCK_DATA=false    # (default) sirve desde Directus
```

Útil para desarrollo offline, previews sin Docker, o tests.

## Variables de entorno

| Variable | Default | Para qué sirve |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://centavos.mx` | URL canónica usada en metadata/sitemap |
| `DIRECTUS_URL` | `http://localhost:8055` | Endpoint del CMS (server-side only) |
| `DIRECTUS_TOKEN` | — | Token estático del usuario "Web" (server-side only). Lo escribe `bootstrap.mjs` |
| `USE_MOCK_DATA` | `false` | `true` → ignora Directus y sirve `data/mock.ts` |
| `CONTACT_EMAIL` | — | Si está vacío, se oculta la CTA "¿Tienes una historia?" en `/nosotros` |
| `ADMIN_EMAIL` | `admin@centavos.mx` | Solo para los scripts en `directus/` |
| `ADMIN_PASSWORD` | `admin` | Solo para los scripts en `directus/` |

## Cómo se conecta al CMS

- `lib/directus.ts` hace fetch server-side al endpoint de Directus con el token estático. **El navegador nunca habla con Directus directamente.**
- `app/api/cms/assets/[id]/route.ts` proxiea los archivos (`/assets/<id>`) para que los `<img>` salgan del mismo origen que la app.
- `lib/articles.ts` expone selectores tipados (`getAllArticles`, `getArticleBySlug`, etc.). Componentes y rutas consumen estos selectores — no saben nada de Directus.
- Cuando `USE_MOCK_DATA=true`, los selectores devuelven datos de `data/mock.ts` con la misma forma.

Estructura mínima que debe devolver el CMS por artículo (ver `types/index.ts`):

```ts
{
  slug, title, short, excerpt, category, author,
  publishedAt: ISO8601,
  readMinutes: number,
  heroImage: { url, alt, caption? },
  body: ArticleBlock[],     // paragraph | heading | image | tip | chart | recap | story
  bodyEli5?: ArticleBlock[] // opcional — habilita el toggle "como si tuviera 5"
}
```

### Cache

Dos capas entre la BD y el render:

1. **Directus (Redis)** — `CACHE_AUTO_PURGE=true` en `docker-compose.yml`: cualquier escritura en el admin invalida el cache automáticamente.
2. **Next data cache** — en dev, `lib/directus.ts` usa `cache: "no-store"` (cambios del admin aparecen al instante). En prod, `revalidate: 60`.

Para limpiar manualmente:

```bash
docker exec centavos-cache redis-cli FLUSHALL
```

## SEO

- **Metadata por ruta** vía `generateMetadata()` (titles, descriptions, OG, Twitter Cards).
- **JSON-LD** en cada artículo (`Article`), home (`Organization` + `WebSite`), glosario (`DefinedTerm`), breadcrumbs.
- **Sitemap dinámico** en `/sitemap.xml`.
- **URLs limpias en español:** `/articulos/como-cambiar-afore-5-minutos`.
- Pendiente cuando subas a prod:
  - Pon tu `NEXT_PUBLIC_SITE_URL` real
  - Reemplaza placeholders en `app/layout.tsx` (publisher, twitter handle)
  - Registra el sitio en Google Search Console y Bing Webmaster
  - Conecta Plausible/Umami para analytics

## Comandos

```bash
bun run dev          # desarrollo (http://localhost:3000)
bun run build        # producción
bun start            # servidor de producción
bun run typecheck    # tsc --noEmit
bun run lint         # eslint

# Directus
docker compose up -d                  # levanta el stack
docker compose down                   # apaga el stack (volúmenes persisten)
docker compose down -v                # apaga y borra volúmenes (¡pierdes datos!)
node directus/bootstrap.mjs           # (idempotente) schema + relations + token
node directus/seed.mjs                # vuelca data/mock.ts a Directus
docker exec centavos-cache redis-cli FLUSHALL   # limpia cache de Directus
```
