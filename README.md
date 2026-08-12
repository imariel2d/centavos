# Centavos

Landing page de la app **Centavos** (control de gastos para México), hecha con
**Next.js 16 + React 19 + TypeScript + Tailwind v4**. App Router, Server
Components por default, 100% estática. Mobile-first.

## Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Lenguaje:** TypeScript (strict)
- **Estilos:** Tailwind v4 (config en CSS via `@theme`)
- **Fuentes:** `next/font` (Bricolage Grotesque, Manrope, Caveat)
- **SEO:** Metadata API + JSON-LD + sitemap + robots

## Estructura

```
app/
  layout.tsx                 → fuentes, metadata raíz, JSON-LD Organización + WebSite
  page.tsx                   → home (landing de la app)
  sitemap.ts                 → sitemap
  robots.ts                  → robots.txt
  manifest.ts                → PWA manifest
  not-found.tsx              → 404
  app/
    soporte/page.tsx         → formulario de soporte (+ mailto de respaldo)
    privacidad/page.tsx      → aviso de privacidad
    terminos/page.tsx        → términos
    eliminar-cuenta/page.tsx → cómo eliminar la cuenta
  api/
    soporte/route.ts         → endpoint del formulario (stub 503 hasta reconectar backend)

components/
  Header.tsx, Logo.tsx, MobileMenu.tsx
  home/*                     → AppHeader, AppFooter, AppStoreBadges, PhoneMock
  legal/*                    → LegalShell, BackToTop
  soporte/SoporteForm.tsx

lib/
  store-links.ts             → URLs de App Store / Google Play
  seo.ts                     → helpers de JSON-LD
```

## Empezar

```bash
cp .env.example .env.local            # ajusta NEXT_PUBLIC_SITE_URL
bun install
bun run dev                           # http://localhost:3000
```

## Variables de entorno

| Variable | Default | Para qué sirve |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://centavos.mx` | URL canónica usada en metadata/sitemap/JSON-LD |

## Comandos

```bash
bun run dev          # desarrollo (http://localhost:3000)
bun run build        # producción
bun start            # servidor de producción
bun run typecheck    # tsc --noEmit
bun run lint         # eslint
```

## Notas

- El formulario de soporte (`/app/soporte`) apunta a `POST /api/soporte`, que hoy
  responde `503`. El backend anterior fue retirado; mientras se conecta uno nuevo,
  el formulario ofrece el enlace `mailto:hola@centavos.mx` como respaldo.
- Los links de descarga viven en `lib/store-links.ts`.
