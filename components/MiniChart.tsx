export function MiniChart({
  height = 120,
  primary = "var(--color-mandarina)",
}: {
  height?: number;
  primary?: string;
}) {
  const bars = [22, 30, 28, 42, 48, 60, 65, 78, 84, 92];
  return (
    <div className="w-full">
      <div className="flex items-end gap-1" style={{ height }}>
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[2px]"
            style={{
              height: `${h}%`,
              background: primary,
              opacity: 0.35 + (i / bars.length) * 0.65,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] opacity-50">
        <span>2024</span>
        <span>2034</span>
      </div>
    </div>
  );
}
