// Badges de descarga (App Store / Google Play).
// Las URLs vienen del singleton home_page en Directus (getAppLinks);
// un badge sin URL no se muestra — nada de links rotos.

type Props = {
  variant?: "dark" | "light";
  className?: string;
  storeUrl?: string;
  playUrl?: string;
};

export function AppStoreBadges({ variant = "dark", className = "", storeUrl, playUrl }: Props) {
  if (!storeUrl && !playUrl) return null;

  const base =
    variant === "dark"
      ? "bg-ink text-bg"
      : "bg-bg text-ink border border-rule";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {storeUrl && (
        <a href={storeUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 ${base} rounded-2xl pl-4 pr-5 py-3 card-hover`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16.4 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.9zM14.2 5.5c.6-.8 1-1.9.9-3-1 0-2.1.7-2.8 1.5-.6.7-1.1 1.8-.9 2.9 1.1 0 2.2-.6 2.8-1.4z" />
          </svg>
          <span className="text-left leading-none">
            <span className="block text-[9px] opacity-70 font-semibold">Descárgala en</span>
            <span className="block font-bold text-[15px] mt-0.5">App Store</span>
          </span>
        </a>
      )}
      {playUrl && (
        <a href={playUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 ${base} rounded-2xl pl-4 pr-5 py-3 card-hover`}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path fill="#34d399" d="M3.6 2.3 14 12 3.6 21.7c-.3-.2-.5-.6-.5-1.1V3.4c0-.5.2-.9.5-1.1z" />
            <path fill="#fbbf24" d="M17.5 8.5 14 12l3.5 3.5 3-1.7c.9-.5.9-1.6 0-2.1l-3-1.2z" />
            <path fill="#60a5fa" d="M14 12 3.6 2.3c.4-.3.9-.3 1.4 0l11 6.2L14 12z" />
            <path fill="#f87171" d="M14 12 5 21.7c-.5.3-1 .3-1.4 0L14 12z" />
          </svg>
          <span className="text-left leading-none">
            <span className="block text-[9px] opacity-70 font-semibold">Disponible en</span>
            <span className="block font-bold text-[15px] mt-0.5">Google Play</span>
          </span>
        </a>
      )}
    </div>
  );
}
