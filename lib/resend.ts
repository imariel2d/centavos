import "server-only";

const RESEND_URL = "https://api.resend.com/emails";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  /** Override the default RESEND_FROM. Must be a verified domain. */
  from?: string;
  replyTo?: string;
};

/**
 * Minimal Resend client — direct REST call, no SDK dependency.
 * Throws on non-2xx so callers can decide whether to surface or swallow.
 */
export async function sendEmail(input: SendEmailInput): Promise<{ id: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY missing");

  const from = input.from ?? process.env.RESEND_FROM;
  if (!from) throw new Error("RESEND_FROM missing");

  const replyTo = input.replyTo ?? process.env.RESEND_REPLY_TO;

  const r = await fetch(RESEND_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(`Resend → ${r.status} ${body}`);
  }
  return (await r.json()) as { id: string };
}
