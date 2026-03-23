import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { BookingBar } from "#/components/landing/booking-bar";
import { ResultCard } from "#/components/search/result-card";
import { QUICK_PICKS } from "#/lib/constants";
import { formatHour } from "#/lib/format";
import type { SearchResponse } from "#/lib/search";
import { searchVenues } from "#/lib/search";
import type { SearchParams } from "#/lib/search-params";
import {
  applyQuickPick,
  resolveDate,
  searchParamsSchema,
} from "#/lib/search-params";

const SORT_OPTIONS = [
  { value: "best", label: "Best match" },
  { value: "price", label: "Lowest price" },
  { value: "earliest", label: "Earliest available" },
] as const;

function SearchPage() {
  const params = Route.useSearch();
  const navigate = Route.useNavigate();
  const date = resolveDate(params);

  const response: SearchResponse = useMemo(
    () => searchVenues({ ...params, date }),
    [params, date],
  );

  const [sortOpen, setSortOpen] = useState(false);
  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === params.sort)?.label ?? "Best match";

  function updateParams(updates: Partial<SearchParams>) {
    navigate({ search: { ...params, ...updates }, replace: true });
  }

  function handleQuickPick(label: string) {
    const updated = applyQuickPick({ ...params, date }, label);
    navigate({ search: updated, replace: true });
  }

  return (
    <>
      {/* Sticky search bar */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <BookingBar
            defaultValues={{ ...params, date }}
            inline
            onSearch={(p) => navigate({ search: p, replace: true })}
          />

          {/* Quick picks */}
          <div className="mx-auto mt-3 flex max-w-3xl flex-wrap items-center gap-2 px-1">
            {QUICK_PICKS.map((pick) => (
              <button
                key={pick.label}
                type="button"
                onClick={() => handleQuickPick(pick.label)}
                className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-lime hover:bg-lime/10 hover:text-foreground"
              >
                {pick.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Summary + sort */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {response.summary}
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {sortLabel}
              <ChevronDown className="size-3.5" />
            </button>
            {sortOpen && (
              <div className="absolute top-full right-0 z-50 mt-1 w-40 rounded-lg border border-border bg-white py-1 shadow-lg">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      updateParams({ sort: opt.value as SearchParams["sort"] });
                      setSortOpen(false);
                    }}
                    className="block w-full px-4 py-1.5 text-left text-xs font-medium text-foreground hover:bg-muted/50"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {response.results.length > 0 && (
          <div className="space-y-4">
            {response.results.map((result) => (
              <ResultCard
                key={result.venue.slug}
                result={result}
                date={date}
                duration={params.duration}
              />
            ))}
          </div>
        )}

        {/* Fallback / empty state */}
        {response.results.length === 0 && (
          <div className="py-12 text-center">
            <SearchX className="mx-auto size-10 text-muted-foreground/40" />
            <p className="mt-4 text-lg font-semibold text-foreground">
              {response.summary}
            </p>

            {response.fallback && response.fallback.length > 0 && (
              <div className="mx-auto mt-8 max-w-2xl">
                <p className="mb-4 text-sm font-medium text-muted-foreground">
                  Closest available options:
                </p>
                <div className="space-y-3">
                  {response.fallback.map((result) => (
                    <div
                      key={result.venue.slug}
                      className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3"
                    >
                      <div>
                        <Link
                          to="/venues/$slug"
                          params={{ slug: result.venue.slug }}
                          className="text-sm font-semibold hover:underline"
                        >
                          {result.venue.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {result.venue.area}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {result.matchingSlots.slice(0, 3).map((slot) => (
                          <Link
                            key={slot.hour}
                            to="/venues/$slug"
                            params={{ slug: result.venue.slug }}
                            search={{
                              date,
                              start: String(slot.hour),
                              duration: String(params.duration),
                            }}
                            className="rounded-lg border border-lime/40 bg-lime/10 px-2.5 py-1 text-xs font-semibold hover:bg-lime/20"
                          >
                            {formatHour(slot.hour)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

    </>
  );
}

export const Route = createFileRoute("/_layout/search")({
  component: SearchPage,
  validateSearch: (search) => searchParamsSchema.parse(search),
});
