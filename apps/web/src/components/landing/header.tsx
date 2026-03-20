import { Zap } from "lucide-react";

import { Button } from "#/components/ui/button";
import { NAV_LINKS } from "#/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-1.5">
          <Zap className="size-5 fill-lime text-lime" />
          <span className="text-lg font-semibold tracking-tight">
            PickleCebu
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:block">
            Cebu, PH
          </span>
          <Button
            asChild
            className="bg-lime text-lime-foreground hover:bg-lime/90"
          >
            <a href="#hero">Book a Court</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
