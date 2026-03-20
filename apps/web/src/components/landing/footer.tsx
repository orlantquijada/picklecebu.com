import { Zap } from "lucide-react";

const FOOTER_LINKS = [
  { label: "About", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface-dark text-surface-dark-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-1.5">
              <Zap className="size-4 fill-lime text-lime" />
              <span className="text-base font-semibold">PickleCebu</span>
            </div>
            <p className="max-w-xs text-sm text-surface-dark-foreground/50">
              Made for Cebuanos who just want to play.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-surface-dark-foreground/50 transition-colors hover:text-surface-dark-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-surface-dark-foreground/10 pt-6">
          <p className="text-xs text-surface-dark-foreground/30">
            &copy; {new Date().getFullYear()} PickleCebu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
