import {
  createFileRoute,
  Link,
  stripSearchParams,
} from "@tanstack/react-router";
import { ChevronDown, SearchX, Share2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { BookingBar } from "#/components/landing/booking-bar";
import {
  ResultCard,
  ResultCardSkeleton,
} from "#/components/search/result-card";
import {
  SimpleSelect,
  SimpleSelectContent,
  SimpleSelectIcon,
  SimpleSelectTrigger,
  SimpleSelectValue,
} from "#/components/ui/simple-select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { apiCourtToVenue } from "#/lib/api";
import { QUICK_PICKS } from "#/lib/constants";
import { formatHour } from "#/lib/format";
import { useCourtsQuery, useAvailabilityQueries } from "#/lib/queries";
import type { SearchResponse } from "#/lib/search";
import { searchVenues } from "#/lib/search";
import {
  applyQuickPick,
  getDefaults,
  isQuickPickActive,
  removeQuickPick,
  resolveDate,
  searchParamsSchema,
} from "#/lib/search-params";
import type { SearchParams } from "#/lib/search-params";
import { copyCurrentUrl } from "#/lib/share";

const quickPickDescriptions: Record<string, string> = {
  Tonight: "Showing courts available from 6 PM today",
  Tomorrow: "Showing courts available all day",
  Weekend: "Showing courts for this weekend",
  Indoor: "Showing indoor courts only",
  "Under ₱400": "Showing courts under ₱400",
};

const SORT_OPTIONS = [
  { label: "Best match", value: "best" },
  { label: "Lowest price", value: "price" },
  { label: "Earliest available", value: "earliest" },
] as const;

function SearchPage() {
  const params = Route.useSearch();
  const navigate = Route.useNavigate();
  const date = resolveDate(params);

  const {
    data: courts,
    isPending: courtsPending,
    isFetching: courtsFetching,
  } = useCourtsQuery();
  const venues = useMemo(() => (courts ?? []).map(apiCourtToVenue), [courts]);
  const slotsMap = useAvailabilityQueries(courts ?? [], date);

  const isLoading = courtsPending;
  const isFetching = courtsFetching && !courtsPending;

  const response: SearchResponse = useMemo(
    () => searchVenues(venues, slotsMap, { ...params, date }),
    [venues, slotsMap, params, date]
  );

  const displayResponse = response;
  const hasStaleResults = isFetching && response.results.length > 0;

  function updateParams(updates: Partial<SearchParams>) {
    navigate({ replace: true, search: { ...params, ...updates } });
  }

  function handleQuickPick(label: string) {
    const paramsWithDate = { ...params, date };
    if (isQuickPickActive(paramsWithDate, label)) {
      navigate({
        replace: true,
        search: removeQuickPick(paramsWithDate, label),
      });
    } else {
      const updated = applyQuickPick(paramsWithDate, label);
      navigate({ replace: true, search: updated });
      toast(label, {
        description: quickPickDescriptions[label],
        action: {
          label: "Undo",
          onClick: () =>
            navigate({
              replace: true,
              search: removeQuickPick(updated, label),
            }),
        },
      });
    }
  }

  return (
    <>
      {/* Sticky search bar */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <BookingBar
            defaultValues={{ ...params, date }}
            inline
            onSearch={(p) => navigate({ replace: true, search: p })}
          />

          {/* Quick picks */}
          <div className="mx-auto mt-3 flex max-w-3xl flex-wrap items-center gap-2 px-1">
            {QUICK_PICKS.map((pick) => {
              const active = isQuickPickActive({ ...params, date }, pick.label);
              return (
                <button
                  key={pick.label}
                  type="button"
                  onClick={() => handleQuickPick(pick.label)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-white text-muted-foreground hover:border-lime hover:bg-lime/10 hover:text-foreground"
                  }`}
                >
                  {pick.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Summary + sort */}
        <div className="mb-6 flex items-center justify-between">
          {isLoading && !hasStaleResults ? (
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          ) : (
            <p className="text-sm font-medium text-muted-foreground">
              {displayResponse.summary}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() =>
                    copyCurrentUrl(
                      "Share this URL to help others find these courts."
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Share2 className="size-3.5" />
                  Share
                </button>
              </TooltipTrigger>
              <TooltipContent>Copy link</TooltipContent>
            </Tooltip>
            <SimpleSelect
              value={params.sort ?? "best"}
              onValueChange={(value) =>
                updateParams({
                  sort: searchParamsSchema.shape.sort
                    .catch("best")
                    .parse(value),
                })
              }
            >
              <SimpleSelectTrigger className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground outline-none">
                <SimpleSelectValue />
                <SimpleSelectIcon>
                  <ChevronDown className="size-3.5" />
                </SimpleSelectIcon>
              </SimpleSelectTrigger>
              <SimpleSelectContent options={SORT_OPTIONS} align="end" />
            </SimpleSelect>
          </div>
        </div>

        {/* Results */}
        {isLoading && !hasStaleResults ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ResultCardSkeleton key={i} />
            ))}
          </div>
        ) : displayResponse.results.length > 0 ? (
          <div
            className={`space-y-4 transition-opacity duration-150 ${isLoading ? "pointer-events-none opacity-50" : ""}`}
          >
            {displayResponse.results.map((result) => (
              <ResultCard
                key={result.venue.slug}
                result={result}
                date={date}
                duration={params.duration}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <SearchX className="mx-auto size-10 text-muted-foreground/40" />
            <p className="mt-4 text-lg font-semibold text-foreground">
              {displayResponse.summary}
            </p>

            {displayResponse.fallback &&
              displayResponse.fallback.length > 0 && (
                <div className="mx-auto mt-8 max-w-2xl">
                  <p className="mb-4 text-sm font-medium text-muted-foreground">
                    Closest available options:
                  </p>
                  <div className="space-y-3">
                    {displayResponse.fallback.map((result) => (
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
                                duration: String(params.duration),
                                start: String(slot.hour),
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
  validateSearch: searchParamsSchema,
  search: {
    middlewares: [stripSearchParams(getDefaults())],
  },
});
