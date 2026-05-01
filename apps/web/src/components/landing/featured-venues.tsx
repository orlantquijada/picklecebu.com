import { useCourtsQuery } from "#/lib/queries";

import { VenueCard } from "./venue-card";

function VenueCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function FeaturedVenues() {
  const { data: courts, isPending } = useCourtsQuery();

  return (
    <section className="bg-muted/50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground italic">
              Top venues
            </p>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Featured Venues
            </h2>
          </div>
          <a
            href="#browse"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            See all venues →
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isPending
            ? Array.from({ length: 6 }).map((_, i) => (
                <VenueCardSkeleton key={i} />
              ))
            : (courts ?? []).map((court, i) => (
                <VenueCard key={court.slug} court={court} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
