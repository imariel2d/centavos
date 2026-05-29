import "server-only";

/**
 * Centavos welcome email — hand-rolled HTML for email-client compatibility.
 * Brand colors mirror app/globals.css @theme tokens. Uses system fonts because
 * @next/font's Bricolage / Manrope / Caveat don't render in most email clients.
 */

type WelcomeEmailParams = {
  /** Absolute URL to /preferencias?t=<token> */
  preferencesUrl: string;
};

// Centavos brand tokens (sync with app/globals.css if it changes)
const BG = "#faf3e3";
const SURFACE = "#ffffff";
const MANDARINA = "#ed7e3c";
const INK = "#2a1a10";
const INK_SOFT = "#6e5849";
const RULE = "#ead9c2";

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

export const welcomeEmailSubject = "Le va. Ya estás dentro.";

export function welcomeEmailHtml({ preferencesUrl }: WelcomeEmailParams): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${welcomeEmailSubject}</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:${FONT_STACK};color:${INK};-webkit-font-smoothing:antialiased;">

  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${BG};opacity:0;">
    Cada martes a las 8 AM en tu correo. Lo mejor de Centavos, sin jerga.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${SURFACE};border-radius:24px;overflow:hidden;">

          <!-- Hero band -->
          <tr>
            <td style="background:${MANDARINA};padding:36px 32px 30px;color:${INK};">
              <div style="font-style:italic;font-size:18px;line-height:1;margin-bottom:6px;opacity:.85;">psst...</div>
              <h1 style="font-size:30px;line-height:1.05;font-weight:800;letter-spacing:-0.025em;margin:0;color:${INK};">
                Le va.<br />Ya estás dentro.
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px 4px;">
              <p style="font-size:15px;line-height:1.65;margin:0 0 16px;color:${INK};">
                Cada <strong>martes a las 8 AM</strong> te llega lo mejor de Centavos en tu correo: historias de dinero contadas como las cuentas tú, sin jerga financiera ni paja.
              </p>
              <p style="font-size:15px;line-height:1.65;margin:0 0 24px;color:${INK};">
                Una sola edición por semana. Cero spam, garantizado por nuestro abogado (y por nosotros, que no tenemos abogado).
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="left" style="padding:4px 32px 28px;">
              <a href="${preferencesUrl}" style="display:inline-block;background:${INK};color:${BG};text-decoration:none;font-weight:700;font-size:14px;padding:14px 22px;border-radius:14px;">
                Manejar preferencias
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
              </p>
              <p style="font-size:12px;line-height:1.55;color:${INK_SOFT};margin:0;">
                <a href="${preferencesUrl}" style="color:${INK_SOFT};text-decoration:underline;">Preferencias</a>
                &nbsp;·&nbsp;
                <a href="${preferencesUrl}" style="color:${INK_SOFT};text-decoration:underline;">Darme de baja</a>
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
