import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur-sm relative">
      <div className="mx-auto max-w-screen-lg flex items-center justify-between px-4 py-3">
        <Logo size={26} />
      </div>
    </header>
  );
}
