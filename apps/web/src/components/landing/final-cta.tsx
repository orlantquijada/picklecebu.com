import { Zap } from "lucide-react";

import { Button } from "#/components/ui/button";

export function FinalCta() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Zap className="mx-auto mb-4 size-8 fill-lime text-lime" />
        <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to play?
        </h2>
        <p className="mx-auto mb-8 max-w-md text-base text-muted-foreground">
          Find a court near you, pick a time, and book in under a minute. Larga
          na.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 bg-lime px-8 text-base font-semibold text-lime-foreground hover:bg-lime/90"
          >
            <a href="#hero">Book a Court</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base"
          >
            <a href="#browse">Browse Courts</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
