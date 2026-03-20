import {
  CalendarDays,
  ChevronDown,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "#/components/ui/button";
import { COURT_TYPES, DURATIONS } from "#/lib/constants";

function UtilityPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
    >
      <span className="text-foreground/50">{label}:</span>
      <span>{value}</span>
      <ChevronDown className="size-3" />
    </button>
  );
}

export function BookingBar() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Utility row */}
      <div className="mb-3 flex flex-wrap items-center gap-2 px-1">
        <UtilityPill label="Court" value={COURT_TYPES[0]!} />
        <UtilityPill label="Duration" value={DURATIONS[0]!} />
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <SlidersHorizontal className="size-3" />
          <span>Filters</span>
        </button>
      </div>

      {/* Main booking bar */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
        {/* Mobile layout */}
        <div className="md:hidden">
          {/* Where */}
          <div className="group flex cursor-pointer items-center gap-3 border-b border-border px-5 py-4 transition-colors hover:bg-muted/50">
            <MapPin className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground">
                Where
              </div>
              <div className="truncate text-sm font-medium">Cebu City</div>
            </div>
          </div>

          {/* Date + Time side-by-side */}
          <div className="grid grid-cols-2">
            <div className="group flex cursor-pointer items-center gap-3 border-b border-r border-border px-5 py-4 transition-colors hover:bg-muted/50">
              <CalendarDays className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-muted-foreground">
                  Date
                </div>
                <div className="truncate text-sm font-medium">Today</div>
              </div>
            </div>
            <div className="group flex cursor-pointer items-center gap-3 border-b border-border px-5 py-4 transition-colors hover:bg-muted/50">
              <Clock className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-muted-foreground">
                  Time
                </div>
                <div className="truncate text-sm font-medium">Any time</div>
              </div>
            </div>
          </div>

          {/* Search button — flush bottom */}
          <Button className="h-14 w-full gap-2 rounded-none bg-lime text-base font-semibold text-lime-foreground hover:bg-lime/90">
            <Search className="size-5" />
            <span>Search Courts</span>
          </Button>
        </div>

        {/* Desktop layout — single horizontal row */}
        <div className="hidden md:flex md:items-stretch">
          <div className="group flex flex-1 cursor-pointer items-center gap-3 border-r border-border px-5 py-4 transition-colors hover:bg-muted/50">
            <MapPin className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground">
                Where
              </div>
              <div className="truncate text-sm font-medium">Cebu City</div>
            </div>
          </div>
          <div className="group flex flex-1 cursor-pointer items-center gap-3 border-r border-border px-5 py-4 transition-colors hover:bg-muted/50">
            <CalendarDays className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground">
                Date
              </div>
              <div className="truncate text-sm font-medium">Today</div>
            </div>
          </div>
          <div className="group flex flex-1 cursor-pointer items-center gap-3 border-r border-border px-5 py-4 transition-colors hover:bg-muted/50">
            <Clock className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground">
                Time
              </div>
              <div className="truncate text-sm font-medium">Any time</div>
            </div>
          </div>
          <Button className="h-auto gap-2 rounded-none bg-lime px-8 text-base font-semibold text-lime-foreground hover:bg-lime/90">
            <Search className="size-5" />
            <span>Search Courts</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
