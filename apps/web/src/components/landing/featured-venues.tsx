import { FEATURED_VENUES } from "#/lib/constants";

import { VenueCard } from "./venue-card";

export function FeaturedVenues() {
  return (
    <section className="bg-muted/50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground italic">
              Elite selection
            </p>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Featured Venues
            </h2>
          </div>
          <a
            href="#browse"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            VIEW ALL DESTINATIONS →
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_VENUES.map((venue, i) => (
            <VenueCard key={venue.slug} venue={venue} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
