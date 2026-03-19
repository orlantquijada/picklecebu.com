import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-0 select-none">
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-black tracking-tight leading-none text-primary"
          >
            PICKLE
          </span>
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-black tracking-tight leading-none text-foreground"
          >
            CEBU
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Courts
          </Link>
          <Link
            to="/dashboard/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Owner Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
