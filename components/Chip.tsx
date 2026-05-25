import type { ReactNode } from "react";

type ChipSize = "sm" | "md" | "lg";

export function Chip({
  children,
  bg = "var(--color-ink)",
  fg = "var(--color-bg)",
  size = "md",
}: {
  children: ReactNode;
  bg?: string;
  fg?: string;
  size?: ChipSize;
}) {
  const sizes: Record<ChipSize, string> = {
    sm: "text-[10px] px-2 py-[3px]",
    md: "text-[11px] px-3 py-1",
    lg: "text-xs px-3.5 py-1.5",
  };
  return (
    <span
      className={`inline-block rounded-full font-bold tracking-wide uppercase ${sizes[size]}`}
      style={{ background: bg, color: fg }}
    >
      {children}
    </span>
  );
}
