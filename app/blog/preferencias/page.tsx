import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PreferencesCard } from "@/components/PreferencesCard";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Preferencias del newsletter",
  description: "Administra tu suscripción a Centavo.",
  alternates: { canonical: `${SITE.url}/blog/preferencias` },
  robots: { index: false, follow: false },
};

// User-specific data — never cache.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Status = "pending" | "confirmed" | "unsubscribed";

type Subscriber = {
  id: number;
  email: string;
  status: Status;
  unsubscribe_token: string;
};

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

async function getByToken(token: string): Promise<Subscriber | null> {
  if (!token || !DIRECTUS_TOKEN) return null;
  const url =
    `${DIRECTUS_URL}/items/newsletter_subscribers` +
    `?filter[unsubscribe_token][_eq]=${encodeURIComponent(token)}` +
    `&limit=1&fields=id,email,status,unsubscribe_token`;
  const r = await fetch(url, {
    headers: { authorization: `Bearer ${DIRECTUS_TOKEN}` },
    cache: "no-store",
  });
  if (!r.ok) return null;
  const { data } = (await r.json()) as { data: Subscriber[] };
  return data[0] ?? null;
}

export default async function PreferenciasPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const token = (t ?? "").trim();
  const subscriber = token ? await getByToken(token) : null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-screen-md px-5 py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.03em] leading-tight mb-2">
          Preferencias del newsletter
        </h1>
        <p className="text-[13px] text-ink-soft mb-8">
          Administra cómo y cuándo recibes Centavo en tu correo.
        </p>

        {subscriber ? (
          <PreferencesCard
            email={subscriber.email}
            status={subscriber.status}
            token={subscriber.unsubscribe_token}
          />
        ) : (
          <div className="bg-surface rounded-3xl px-6 py-7 border border-rule">
            <p className="text-[15px] text-ink font-semibold mb-2">
              Liga inválida o ya expirada.
            </p>
            <p className="text-[13px] text-ink-soft leading-relaxed">
              Si llegaste aquí desde un correo viejo, busca el más reciente que te enviamos.
              También puedes <a href="/#newsletter" className="text-mandarina-deep underline underline-offset-2 font-semibold">suscribirte de nuevo</a> desde la página principal.
            </p>
          </div>
        )}

        <p className="text-[12px] text-ink-soft mt-6 leading-relaxed">
          ¿Dudas? Escríbenos a{" "}
          <a
            href={`mailto:${process.env.RESEND_REPLY_TO ?? "hola@centavos.mx"}`}
            className="underline underline-offset-2"
          >
            {process.env.RESEND_REPLY_TO ?? "hola@centavos.mx"}
          </a>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
