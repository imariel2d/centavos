export function ImgPlaceholder({
  label,
  height = 200,
  bg = "var(--color-sand)",
  fg = "var(--color-mandarina-deep)",
  rounded = false,
}: {
  label: string;
  height?: number;
  bg?: string;
  fg?: string;
  rounded?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`w-full grid place-items-center ${rounded ? "rounded-2xl" : ""}`}
      style={{
        height,
        background: bg,
        color: fg,
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 14px, rgba(0,0,0,0.04) 14px 15px)",
        fontFamily: "ui-monospace, Menlo, monospace",
        fontSize: 11,
        letterSpacing: 0.5,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );
}
