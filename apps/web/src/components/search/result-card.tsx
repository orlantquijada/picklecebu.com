import { Link } from "@tanstack/react-router";
import { ChevronRight, MapPin, Zap } from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { formatCentavos } from "#/lib/format";
import type { SearchResult } from "#/lib/search";
import { formatHour } from "#/lib/format";

type ResultCardProps = {
  result: SearchResult;
  date: string;
  duration: number;
};

export function ResultCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="h-5 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="shrink-0 space-y-1 text-right">
          <div className="ml-auto h-5 w-16 animate-pulse rounded bg-muted" />
          <div className="ml-auto h-3 w-10 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-3 flex gap-1.5">
        <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-10 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-3 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-16 animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
      <div className="mt-3 flex justify-end">
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function ResultCard({ result, date, duration }: ResultCardProps) {
  const { venue, matchingSlots, courtTypes } = result;
  const priceLabel =
    duration > 60
      ? `${formatCentavos((venue.pricePerHourCentavos * duration) / 60)}`
      : formatCentavos(venue.pricePerHourCentavos);
  const perLabel = duration > 60 ? `for ${duration / 60}hrs` : "/hr";

  return (
    <div className="group rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link
              to="/venues/$slug"
              params={{ slug: venue.slug }}
              search={{ date, start: undefined, duration: undefined }}
              className="text-lg font-semibold text-foreground hover:underline"
            >
              {venue.name}
            </Link>
            {venue.badge && (
              <Badge
                variant="secondary"
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              >
                {venue.badge}
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            <span>{venue.area}</span>
            <span className="text-border">·</span>
            <span className="capitalize">{courtTypes.join(", ")}</span>
            <span className="text-border">·</span>
            <span>
              {venue.courtCount} court{venue.courtCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-semibold text-foreground">
            {priceLabel}
          </div>
          <div className="text-xs text-muted-foreground">{perLabel}</div>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge
          variant="outline"
          className="gap-1 rounded-full px-2 py-0.5 text-[10px]"
        >
          <Zap className="size-2.5" />
          Instant
        </Badge>
        <Badge
          variant="outline"
          className="rounded-full px-2 py-0.5 text-[10px]"
        >
          GCash
        </Badge>
        <Badge
          variant="outline"
          className="rounded-full px-2 py-0.5 text-[10px]"
        >
          Maya
        </Badge>
      </div>

      {/* Available slot chips */}
      {matchingSlots.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {matchingSlots.map((slot) => (
            <Link
              key={slot.hour}
              to="/venues/$slug"
              params={{ slug: venue.slug }}
              search={{
                date,
                start: String(slot.hour),
                duration: String(duration),
              }}
              className="rounded-lg border border-lime/40 bg-lime/10 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-lime hover:bg-lime/20"
            >
              {formatHour(slot.hour)}
            </Link>
          ))}
          {matchingSlots.length >= 5 && (
            <Link
              to="/venues/$slug"
              params={{ slug: venue.slug }}
              search={{ date, start: undefined, duration: String(duration) }}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              View all times
            </Link>
          )}
        </div>
      )}

      {/* View details */}
      <div className="mt-3 flex justify-end">
        <Link
          to="/venues/$slug"
          params={{ slug: venue.slug }}
          search={{ date, start: undefined, duration: String(duration) }}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View details
          <ChevronRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
