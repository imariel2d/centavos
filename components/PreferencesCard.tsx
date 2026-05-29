"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Status = "pending" | "confirmed" | "unsubscribed";

type Props = {
  email: string;
  status: Status;
  token: string;
};

export function PreferencesCard({ email, status, token }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const subscribed = status !== "unsubscribed";
  const action = subscribed ? "unsubscribe" : "resubscribe";

  function onClick() {
    setError("");
    startTransition(async () => {
      try {
        const r = await fetch("/api/newsletter/preferences", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token, action }),
        });
        const data = (await r.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
        };
        if (!r.ok || !data.ok) {
          setError(data.error ?? "No pudimos guardar tu preferencia.");
          return;
        }
        router.refresh();
      } catch {
        setError("Sin conexión. Intenta de nuevo.");
      }
    });
  }

  return (
    <div className="bg-surface rounded-3xl px-6 py-7 border border-rule">
      <p className="text-[11px] uppercase tracking-wider text-ink-soft font-bold mb-1.5">
        Tu correo
      </p>
      <p className="font-display text-[18px] font-bold mb-6 break-all">{email}</p>

      <div className="flex items-center gap-2 mb-6">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            subscribed ? "bg-mandarina" : "bg-ink-soft/40"
          }`}
          aria-hidden
        />
        <span className="text-[14px] font-semibold text-ink">
          {subscribed
            ? "Suscrite — recibes Centavo cada martes"
            : "No suscrite — ya no te llegan correos"}
        </span>
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className={`px-5 py-3 rounded-xl text-[13px] font-bold disabled:opacity-60 ${
          subscribed
            ? "bg-ink text-bg"
            : "bg-mandarina text-ink"
        }`}
      >
        {isPending
          ? "..."
          : subscribed
            ? "Darme de baja"
            : "Volver a suscribirme"}
      </button>

      {error && (
        <p
          className="mt-3 text-[12px] font-semibold text-ink/80"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
