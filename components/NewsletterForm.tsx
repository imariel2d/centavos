"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const r = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "homepage_cta" }),
      });
      const data = (await r.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (r.ok && data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Algo salió mal. Intenta de nuevo.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Sin conexión. Intenta de nuevo.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="bg-ink/10 rounded-xl px-4 py-3 text-[13px] font-semibold"
        role="status"
      >
        ¡Recibido! Te avisamos en cuanto haya algo bueno.
      </div>
    );
  }

  const loading = status === "loading";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2" noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          aria-label="Tu correo"
          autoComplete="email"
          disabled={loading}
          className="flex-1 bg-bg px-4 py-3 rounded-xl text-[13px] text-ink placeholder:text-ink-soft outline-none focus:ring-2 focus:ring-ink disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-bg px-5 py-3 rounded-xl text-[13px] font-bold disabled:opacity-60"
        >
          {loading ? "..." : "Le va"}
        </button>
      </div>
      {status === "error" && errorMsg && (
        <div
          className="text-[12px] font-semibold text-ink/80"
          role="alert"
        >
          {errorMsg}
        </div>
      )}
    </form>
  );
}
