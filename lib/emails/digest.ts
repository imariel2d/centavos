/**
 * Weekly digest email — last 5 published articles.
 * Sent every Tuesday at 8 AM PT via /api/newsletter/digest.
 */

export type DigestArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
};

export type DigestEmailParams = {
  articles: DigestArticle[];
  /** Absolute URL to /preferencias?t=<token> */
  preferencesUrl: string;
  /** Edition label shown in the header, e.g. "Mayo 2026" */
  edition?: string;
};

// ── Brand tokens (sync with app/globals.css) ──────────────────
const BG         = "#faf3e3";
const SURFACE    = "#ffffff";
const MANDARINA  = "#ed7e3c";
const INK        = "#2a1a10";
const INK_SOFT   = "#6e5849";
const RULE       = "#ead9c2";
const SAND       = "#f5ead0";

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

const CATEGORY_LABELS: Record<string, string> = {
  ahorro:      "Ahorro",
  deuda:       "Deuda",
  inversion:   "Inversión",
  "credito":   "Crédito",
  impuestos:   "Impuestos",
  basicos:     "Básicos",
};

function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug;
}

function articleRow(a: DigestArticle, siteUrl: string): string {
  const url = `${siteUrl}/blog/articulos/${a.slug}`;
  const cat = categoryLabel(a.category);
  return `
  <tr>
    <td style="padding:0 0 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
             style="background:${SAND};border-radius:16px;overflow:hidden;">
        <tr>
          <td style="padding:20px 24px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${MANDARINA};margin-bottom:6px;">
              ${cat} · ${a.readMinutes} min
            </div>
            <h2 style="font-size:17px;font-weight:800;line-height:1.2;margin:0 0 8px;color:${INK};">
              <a href="${url}" style="color:${INK};text-decoration:none;">${a.title}</a>
            </h2>
            <p style="font-size:14px;line-height:1.6;color:${INK_SOFT};margin:0 0 14px;">
              ${a.excerpt}
            </p>
            <a href="${url}"
               style="font-size:13px;font-weight:700;color:${MANDARINA};text-decoration:none;">
              Leer artículo →
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

export function digestEmailSubject(edition?: string): string {
  return edition
    ? `Centavos · Lo de esta semana (${edition})`
    : "Centavos · Lo de esta semana";
}

export function digestEmailHtml({
  articles,
  preferencesUrl,
  edition,
}: DigestEmailParams): string {
  const siteUrl = preferencesUrl.split("/blog/preferencias")[0];
  const rows = articles.map((a) => articleRow(a, siteUrl)).join("");

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${digestEmailSubject(edition)}</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:${FONT_STACK};color:${INK};-webkit-font-smoothing:antialiased;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${BG};opacity:0;">
    Los 5 artículos de esta semana, sin jerga ni paja. ☕
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:${BG};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:560px;background:${SURFACE};border-radius:24px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:${MANDARINA};padding:32px 32px 28px;">
              ${edition ? `<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${INK};opacity:.7;margin-bottom:8px;">${edition}</div>` : ""}
              <h1 style="font-size:28px;line-height:1.05;font-weight:800;letter-spacing:-0.02em;margin:0;color:${INK};">
                Lo de esta semana<br />en Centavos 📬
              </h1>
              <p style="font-size:14px;line-height:1.5;color:${INK};opacity:.8;margin:10px 0 0;">
                Cinco artículos de dinero, sin jerga ni paja.
              </p>
            </td>
          </tr>

          <!-- Articles -->
          <tr>
            <td style="padding:28px 24px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${rows}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:4px 32px 28px;">
              <a href="${siteUrl}"
                 style="display:inline-block;background:${INK};color:${BG};text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:14px;">
                Ver todos los artículos
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <div style="height:1px;background:${RULE};line-height:1px;font-size:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 28px;">
              <p style="font-size:12px;line-height:1.55;color:${INK_SOFT};margin:0 0 8px;">
                Recibes este correo porque te suscribiste en centavos.mx.
                Este boletín llega cada martes a las 8 AM (hora del Pacífico).
              </p>
              <p style="font-size:12px;line-height:1.55;color:${INK_SOFT};margin:0;">
                <a href="${preferencesUrl}" style="color:${INK_SOFT};text-decoration:underline;">Preferencias</a>
                &nbsp;·&nbsp;
                <a href="${preferencesUrl}" style="color:${INK_SOFT};text-decoration:underline;">Darme de baja</a>
                &nbsp;·&nbsp;
                <a href="${preferencesUrl}" style="color:${INK_SOFT};text-decoration:underline;">Manejar preferencias</a>
              </p>
            </td>
          </tr>

        </table>

        <div style="font-size:11px;color:${INK_SOFT};margin-top:16px;opacity:.6;">© Centavos · MX</div>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
