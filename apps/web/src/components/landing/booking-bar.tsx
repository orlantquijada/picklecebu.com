import { useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import { AREAS, COURT_TYPES, DURATIONS } from "#/lib/constants";
import type { SearchParams } from "#/lib/search-params";
import {
  areaSlugToName,
  formatDateLabel,
  formatTimeLabel,
  getDefaults,
} from "#/lib/search-params";

function UtilityPill({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
}) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-xs font-medium text-muted-foreground outline-none transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring">
        <span className="text-foreground/50">{label}:</span>
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon>
          <ChevronDown className="size-3" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <SelectPrimitive.Viewport>
            {options.map((opt) => (
              <SelectPrimitive.Item
                key={opt}
                value={opt}
                className="relative flex cursor-default items-center rounded-sm px-4 py-1.5 text-xs font-medium text-foreground outline-none select-none data-highlighted:bg-muted/50"
              >
                <SelectPrimitive.ItemText>{opt}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

type BookingBarProps = {
  defaultValues?: Partial<SearchParams>;
  /** When true, updates URL in place instead of navigating to /search */
  inline?: boolean;
  onSearch?: (params: SearchParams) => void;
};

export function BookingBar({
  defaultValues,
  inline,
  onSearch,
}: BookingBarProps) {
  const navigate = useNavigate();
  const defaults = { ...getDefaults(), ...defaultValues };

  const [where, setWhere] = useState(defaults.where);
  const [date] = useState(defaults.date);
  const [time, setTime] = useState(defaults.time);
  const [courtType, setCourtType] = useState(defaults.courtType);
  const [duration, setDuration] = useState(defaults.duration);
  const [whereOpen, setWhereOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const durationLabel =
    duration === 60 ? "1 hour" : duration === 90 ? "1.5 hours" : "2 hours";
  const courtTypeLabel =
    courtType === "any"
      ? "Any court"
      : courtType.charAt(0).toUpperCase() + courtType.slice(1);

  function handleSearch() {
    const params: SearchParams = {
      courtType: courtType as SearchParams["courtType"],
      date,
      duration,
      sort: defaults.sort,
      time,
      where,
      ...(defaults.priceMax ? { priceMax: defaults.priceMax } : {}),
    };

    if (onSearch) {
      onSearch(params);
      return;
    }

    if (inline) {
      navigate({
        replace: true,
        search: params,
        to: "/search",
      });
    } else {
      navigate({ search: params, to: "/search" });
    }
  }

  const timeOptions = [
    "Any time",
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
  ];

  function parseTimeOption(opt: string): string {
    if (opt === "Any time") return "any";
    const match = opt.match(/^(\d+):00\s*(AM|PM)$/);
    if (!match) return "any";
    let h = Number(match[1]);
    if (match[2] === "PM" && h !== 12) h += 12;
    if (match[2] === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:00`;
  }

  const areas = [{ name: "All Cebu", slug: "cebu-city" }, ...AREAS];

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Utility row */}
      <div className="mb-3 flex flex-wrap items-center gap-2 px-1">
        <UtilityPill
          label="Court"
          value={courtTypeLabel}
          options={COURT_TYPES}
          onValueChange={(v) =>
            setCourtType(
              v === "Any court"
                ? "any"
                : (v.toLowerCase() as SearchParams["courtType"])
            )
          }
        />
        <UtilityPill
          label="Duration"
          value={durationLabel}
          options={DURATIONS}
          onValueChange={(v) => {
            const mins = v.startsWith("1.5")
              ? 90
              : v.startsWith("2")
                ? 120
                : 60;
            setDuration(mins);
          }}
        />
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
          <div className="relative">
            <button
              type="button"
              onClick={() => setWhereOpen(!whereOpen)}
              className="group flex w-full cursor-pointer items-center gap-3 border-b border-border px-5 py-4 transition-colors hover:bg-muted/50"
            >
              <MapPin className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 text-left">
                <div className="text-xs font-medium text-muted-foreground">
                  Where
                </div>
                <div className="truncate text-sm font-medium">
                  {areaSlugToName(where)}
                </div>
              </div>
            </button>
            {whereOpen && (
              <div className="absolute top-full left-0 z-50 w-full border-b border-border bg-white shadow-lg">
                {areas.map((a) => (
                  <button
                    key={a.slug}
                    type="button"
                    onClick={() => {
                      setWhere(a.slug);
                      setWhereOpen(false);
                    }}
                    className="block w-full px-5 py-2.5 text-left text-sm font-medium hover:bg-muted/50"
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date + Time side-by-side */}
          <div className="grid grid-cols-2">
            <div className="group flex cursor-pointer items-center gap-3 border-b border-r border-border px-5 py-4 transition-colors hover:bg-muted/50">
              <CalendarDays className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-muted-foreground">
                  Date
                </div>
                <div className="truncate text-sm font-medium">
                  {formatDateLabel(date)}
                </div>
              </div>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setTimeOpen(!timeOpen)}
                className="group flex w-full cursor-pointer items-center gap-3 border-b border-border px-5 py-4 transition-colors hover:bg-muted/50"
              >
                <Clock className="size-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 text-left">
                  <div className="text-xs font-medium text-muted-foreground">
                    Time
                  </div>
                  <div className="truncate text-sm font-medium">
                    {formatTimeLabel(time)}
                  </div>
                </div>
              </button>
              {timeOpen && (
                <div className="absolute top-full right-0 z-50 max-h-48 w-40 overflow-y-auto rounded-lg border border-border bg-white py-1 shadow-lg">
                  {timeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setTime(parseTimeOption(opt));
                        setTimeOpen(false);
                      }}
                      className="block w-full px-4 py-1.5 text-left text-xs font-medium hover:bg-muted/50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search button */}
          <Button
            onClick={handleSearch}
            className="h-14 w-full gap-2 rounded-none bg-lime text-base font-semibold text-lime-foreground hover:bg-lime/90"
          >
            <Search className="size-5" />
            <span>Find Courts</span>
          </Button>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex md:items-stretch">
          <div className="relative">
            <button
              type="button"
              onClick={() => setWhereOpen(!whereOpen)}
              className="group flex h-full flex-[2] cursor-pointer items-center gap-3 border-r border-border px-5 py-4 transition-colors hover:bg-muted/50"
            >
              <MapPin className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 text-left">
                <div className="text-xs font-medium text-muted-foreground">
                  Where
                </div>
                <div className="truncate text-sm font-medium">
                  {areaSlugToName(where)}
                </div>
              </div>
            </button>
            {whereOpen && (
              <div className="absolute top-full left-0 z-50 w-48 rounded-lg border border-border bg-white py-1 shadow-lg">
                {areas.map((a) => (
                  <button
                    key={a.slug}
                    type="button"
                    onClick={() => {
                      setWhere(a.slug);
                      setWhereOpen(false);
                    }}
                    className="block w-full px-4 py-1.5 text-left text-sm font-medium hover:bg-muted/50"
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="group flex flex-1 cursor-pointer items-center gap-3 border-r border-border px-5 py-4 transition-colors hover:bg-muted/50">
            <CalendarDays className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground">
                Date
              </div>
              <div className="truncate text-sm font-medium">
                {formatDateLabel(date)}
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setTimeOpen(!timeOpen)}
              className="group flex h-full flex-1 cursor-pointer items-center gap-3 border-r border-border px-5 py-4 transition-colors hover:bg-muted/50"
            >
              <Clock className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 text-left">
                <div className="text-xs font-medium text-muted-foreground">
                  Time
                </div>
                <div className="truncate text-sm font-medium">
                  {formatTimeLabel(time)}
                </div>
              </div>
            </button>
            {timeOpen && (
              <div className="absolute top-full right-0 z-50 max-h-48 w-40 overflow-y-auto rounded-lg border border-border bg-white py-1 shadow-lg">
                {timeOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setTime(parseTimeOption(opt));
                      setTimeOpen(false);
                    }}
                    className="block w-full px-4 py-1.5 text-left text-xs font-medium hover:bg-muted/50"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center px-3">
            <Button
              onClick={handleSearch}
              className="h-11 gap-2 rounded-xl bg-lime px-6 text-base font-semibold text-lime-foreground hover:bg-lime/90"
            >
              <Search className="size-5" />
              <span>Find Courts</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
