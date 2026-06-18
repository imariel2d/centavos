"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

// Keep in sync with the limits in app/api/soporte/route.ts
const TITLE_MAX = 120;
const EMAIL_MAX = 254;
const DESC_MIN = 5;
const DESC_MAX = 2000;

const fieldClass =
  "w-full bg-bg px-4 py-3 rounded-xl text-[14px] text-ink placeholder:text-ink-soft outline-none focus:ring-2 focus:ring-ink disabled:opacity-60";
const labelClass = "text-[12px] font-bold text-ink mb-1.5 block";

export function SoporteForm() {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const r = await fetch("/api/soporte", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          user_email: email,
          description,
          company,
        }),
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
        className="bg-surface border border-rule rounded-2xl p-6 text-center"
        role="status"
      >
        <div className="font-display text-2xl font-extrabold tracking-[-0.02em] mb-2">
          ¡Recibido!
        </div>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          Gracias por escribirnos. Te respondemos a <b className="text-ink">{email}</b> lo
          antes posible —normalmente dentro de uno o dos días hábiles.
        </p>
      </div>
    );
  }

  const loading = status === "loading";
  const counterColor = (len: number, max: number) =>
    len >= max ? "text-mandarina-deep" : "text-ink-soft";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-surface border border-rule rounded-2xl p-6 flex flex-col gap-4"
      noValidate
    >
      {/* Honeypot — visually hidden, ignored by humans, catches bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          No llenes esto
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label htmlFor="soporte-asunto" className="text-[12px] font-bold text-ink">
            Asunto
          </label>
          <span
            className={`text-[12px] tabular-nums ${counterColor(title.length, TITLE_MAX)}`}
            aria-live="polite"
          >
            {title.length}/{TITLE_MAX}
          </span>
        </div>
        <input
          id="soporte-asunto"
          type="text"
          required
          maxLength={TITLE_MAX}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿En qué te ayudamos?"
          disabled={loading}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="soporte-correo" className={labelClass}>
          Tu correo
        </label>
        <input
          id="soporte-correo"
          type="email"
          required
          maxLength={EMAIL_MAX}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          autoComplete="email"
          disabled={loading}
          className={fieldClass}
        />
        <p className="text-[12px] text-ink-soft mt-1.5">
          Te responderemos aquí.
        </p>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label htmlFor="soporte-mensaje" className="text-[12px] font-bold text-ink">
            Tu mensaje
          </label>
          <span
            className={`text-[12px] tabular-nums ${counterColor(description.length, DESC_MAX)}`}
            aria-live="polite"
          >
            {description.length}/{DESC_MAX}
          </span>
        </div>
        <textarea
          id="soporte-mensaje"
          required
          minLength={DESC_MIN}
          maxLength={DESC_MAX}
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Cuéntanos qué pasó o en qué te ayudamos…"
          disabled={loading}
          className={`${fieldClass} resize-y`}
        />
      </div>

      {status === "error" && errorMsg && (
        <div className="text-[13px] font-semibold text-mandarina-deep" role="alert">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-ink text-bg px-5 py-3 rounded-xl text-[14px] font-bold disabled:opacity-60 cursor-pointer hover:opacity-80 transition-opacity duration-150"
      >
        {loading ? "Enviando…" : "Enviar mensaje"}
      </button>

      <p className="text-[12px] text-ink-soft text-center">
        O escríbenos directo a{" "}
        <a
          href="mailto:hola@centavos.mx"
          className="text-mandarina-deep underline underline-offset-2"
        >
          hola@centavos.mx
        </a>
      </p>
    </form>
  );
}
