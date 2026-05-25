"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: integra con tu proveedor (Mailchimp / Buttondown / Resend / etc.)
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-ink/10 rounded-xl px-4 py-3 text-[13px] font-semibold">
        ¡Va! Te llegará pronto la primera edición.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
        aria-label="Tu correo"
        className="flex-1 bg-bg px-4 py-3 rounded-xl text-[13px] text-ink placeholder:text-ink-soft outline-none focus:ring-2 focus:ring-ink"
      />
      <button type="submit" className="bg-ink text-bg px-5 py-3 rounded-xl text-[13px] font-bold">
        Le va
      </button>
    </form>
  );
}
