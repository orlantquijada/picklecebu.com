import { AREAS } from "#/lib/constants";

export function BrowseAreas() {
  return (
    <section id="browse" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground italic">
          Trending areas
        </p>

        <div className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-x-visible md:pb-0">
          {AREAS.map((area) => (
            <button
              key={area.slug}
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-lime hover:bg-lime/10 hover:shadow-sm"
            >
              {area.name}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {area.courtCount}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
