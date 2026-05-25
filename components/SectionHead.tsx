export function SectionHead({
  kicker,
  title,
  className = "",
}: {
  kicker?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {kicker && (
        <div className="text-[11px] font-extrabold tracking-[0.06em] uppercase text-mandarina-deep mb-1.5">
          {kicker}
        </div>
      )}
      <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-[-0.025em] leading-none text-ink">
        {title}
      </h2>
    </div>
  );
}
