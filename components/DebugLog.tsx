"use client";

import { useEffect } from "react";

// Dev-only console.log helper. Server components serialize `data` into the
// payload; this client component picks it up and logs once on mount.
// Renders nothing.
export function DebugLog({ label, data }: { label: string; data: unknown }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    // eslint-disable-next-line no-console
    console.log(`%c[${label}]`, "color:#ed7e3c;font-weight:bold", data);
  }, [label, data]);
  return null;
}
