import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Search, ChevronDown } from "lucide-react";
import { useState } from "react";

import { FiltersButton } from "#/components/search/filters-panel";
import { Button } from "#/components/ui/button";
import {
  SimpleSelect,
  SimpleSelectContent,
  SimpleSelectIcon,
  SimpleSelectTrigger,
  SimpleSelectValue,
} from "#/components/ui/simple-select";
import { AREAS, COURT_TYPES, DURATIONS } from "#/lib/constants";
import type { AmenitySlug, SearchParams } from "#/lib/search-params";
import {
  areaSlugToName,
  formatDateLabel,
  formatTimeLabel,
  getDefaults,
  searchParamsSchema,
} from "#/lib/search-params";

const TIME_OPTIONS = [
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

const AREAS_WITH_ALL = [{ name: "All Cebu", slug: "cebu-city" }, ...AREAS];

function parseTimeOption(opt: string): string {
  if (opt === "Any time") return "any";
  const match = opt.match(/^(\d+):00\s*(AM|PM)$/);
  if (!match) return "any";
  let h = Number(match[1]);
  if (match[2] === "PM" && h !== 12) h += 12;
  if (match[2] === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:00`;
}

function formatDuration(mins: number): string {
  return mins === 60 ? "1 hour" : mins === 90 ? "1.5 hours" : "2 hours";
}

function formatCourtType(type: string): string {
  return type === "any"
    ? "Any court"
    : type.charAt(0).toUpperCase() + type.slice(1);
}

function parseDurationOption(v: string): number {
  return v.startsWith("1.5") ? 90 : v.startsWith("2") ? 120 : 60;
}

function parseCourtTypeOption(v: string): SearchParams["courtType"] {
  const lower = v === "Any court" ? "any" : v.toLowerCase();
  return searchParamsSchema.shape.courtType.catch("any").parse(lower);
}

function useBookingBarState({
  defaultValues,
  inline,
  onSearch,
}: BookingBarProps) {
  const navigate = useNavigate();
  const defaults = { ...getDefaults(), ...defaultValues };

  const [localWhere, setLocalWhere] = useState(defaults.where);
  const [localDate] = useState(defaults.date);
  const [localTime, setLocalTime] = useState(defaults.time);
  const [localCourtType, setLocalCourtType] = useState(defaults.courtType);
  const [localDuration, setLocalDuration] = useState(defaults.duration);
  const [localPriceMax, setLocalPriceMax] = useState(defaults.priceMax);
  const [localAmenities, setLocalAmenities] = useState<AmenitySlug[]>(
    defaults.amenities ?? []
  );

  const where = inline ? defaults.where : localWhere;
  const date = inline ? defaults.date : localDate;
  const time = inline ? defaults.time : localTime;
  const courtType = inline ? defaults.courtType : localCourtType;
  const duration = inline ? defaults.duration : localDuration;
  const priceMax = inline ? defaults.priceMax : localPriceMax;
  const amenities = inline ? (defaults.amenities ?? []) : localAmenities;

  function buildParams(overrides?: Partial<SearchParams>): SearchParams {
    return {
      courtType,
      date,
      duration,
      sort: defaults.sort,
      time,
      where,
      weekend: defaults.weekend ?? false,
      priceMax,
      amenities,
      ...overrides,
    };
  }

  function update(overrides: Partial<SearchParams>) {
    if (inline) {
      navigate({
        replace: true,
        search: buildParams(overrides),
        to: "/search",
      });
    } else {
      if (overrides.where !== undefined) setLocalWhere(overrides.where);
      if (overrides.time !== undefined) setLocalTime(overrides.time);
      if (overrides.courtType !== undefined) setLocalCourtType(overrides.courtType);
      if (overrides.duration !== undefined) setLocalDuration(overrides.duration);
      if ("priceMax" in overrides) setLocalPriceMax(overrides.priceMax);
      if (overrides.amenities !== undefined)
        setLocalAmenities(overrides.amenities);
    }
  }

  function handleSearch() {
    const params = buildParams();

    if (onSearch) {
      onSearch(params);
      return;
    }

    navigate({
      search: params,
      to: "/search",
      replace: inline,
    });
  }

  return {
    where,
    date,
    time,
    duration,
    priceMax,
    amenities,
    durationLabel: formatDuration(duration),
    courtTypeLabel: formatCourtType(courtType),
    update,
    handleSearch,
  };
}

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
    <SimpleSelect value={value} onValueChange={onValueChange}>
      <SimpleSelectTrigger className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-xs font-medium text-muted-foreground outline-none transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring">
        <span className="text-foreground/50">{label}:</span>
        <SimpleSelectValue />
        <SimpleSelectIcon>
          <ChevronDown className="size-3" />
        </SimpleSelectIcon>
      </SimpleSelectTrigger>
      <SimpleSelectContent options={options} />
    </SimpleSelect>
  );
}

type BookingBarProps = {
  defaultValues?: Partial<SearchParams>;
  /** When true, updates URL in place instead of navigating to /search */
  inline?: boolean;
  onSearch?: (params: SearchParams) => void;
};

export function BookingBar(props: BookingBarProps) {
  const {
    where,
    date,
    time,
    priceMax,
    amenities,
    durationLabel,
    courtTypeLabel,
    update,
    handleSearch,
  } = useBookingBarState(props);

  const [whereOpen, setWhereOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Utility row */}
      <div className="mb-3 flex flex-wrap items-center gap-2 px-1">
        <UtilityPill
          label="Court"
          value={courtTypeLabel}
          options={COURT_TYPES}
          onValueChange={(v) => update({ courtType: parseCourtTypeOption(v) })}
        />
        <UtilityPill
          label="Duration"
          value={durationLabel}
          options={DURATIONS}
          onValueChange={(v) => update({ duration: parseDurationOption(v) })}
        />
        <FiltersButton
          searchParams={{ priceMax, amenities }}
          onChange={(values) => update(values)}
        />
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
                {AREAS_WITH_ALL.map((a) => (
                  <button
                    key={a.slug}
                    type="button"
                    onClick={() => {
                      update({ where: a.slug });
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
                  {TIME_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        update({ time: parseTimeOption(opt) });
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
                {AREAS_WITH_ALL.map((a) => (
                  <button
                    key={a.slug}
                    type="button"
                    onClick={() => {
                      update({ where: a.slug });
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
                {TIME_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      update({ time: parseTimeOption(opt) });
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
