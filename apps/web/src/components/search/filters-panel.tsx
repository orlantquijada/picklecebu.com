import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";

import { Checkbox } from "#/components/ui/checkbox";
import { Label } from "#/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import type { AmenitySlug, SearchParams } from "#/lib/search-params";
import { getFilterCount } from "#/lib/search-params";

const PRICE_OPTIONS = [
  { label: "Any", value: undefined },
  { label: "Under ₱250", value: 250 },
  { label: "Under ₱400", value: 400 },
  { label: "Under ₱600", value: 600 },
  { label: "Under ₱800", value: 800 },
] as const;

const AMENITY_OPTIONS: { label: string; value: AmenitySlug }[] = [
  { label: "Floodlights", value: "floodlights" },
  { label: "Parking", value: "parking" },
  { label: "Showers", value: "showers" },
  { label: "Pro Shop", value: "pro-shop" },
];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

type FilterValues = {
  priceMax: number | undefined;
  amenities: AmenitySlug[];
};

function FiltersContent({
  values,
  onChange,
}: {
  values: FilterValues;
  onChange: (values: Partial<SearchParams>) => void;
}) {
  function toggleAmenity(value: AmenitySlug) {
    const next = values.amenities.includes(value)
      ? values.amenities.filter((a) => a !== value)
      : [...values.amenities, value];
    onChange({ amenities: next });
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 h-10">
        <h3 className="text-sm font-semibold">Filters</h3>
        <button
          type="button"
          onClick={() => onChange({ priceMax: undefined, amenities: [] })}
          className="text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Clear all
        </button>
      </div>

      {/* Max price */}
      <div className="px-4 py-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Max price
        </h4>
        <p className="mt-0.5 text-[11px] text-muted-foreground/70">
          For the selected duration
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((opt) => {
            const isActive = values.priceMax === opt.value;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onChange({ priceMax: opt.value })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-white text-foreground hover:border-foreground/30"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amenities */}
      <div className="border-t border-border px-4 py-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Amenities
        </h4>
        <div className="space-y-3">
          {AMENITY_OPTIONS.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2.5">
              <Checkbox
                id={`amenity-${opt.value}`}
                checked={values.amenities.includes(opt.value)}
                onCheckedChange={() => toggleAmenity(opt.value)}
              />
              <Label
                htmlFor={`amenity-${opt.value}`}
                className="text-sm font-medium"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type FiltersButtonProps = {
  searchParams: Pick<SearchParams, "priceMax" | "amenities">;
  onChange: (values: Partial<SearchParams>) => void;
};

export function FiltersButton({ searchParams, onChange }: FiltersButtonProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const count = getFilterCount(searchParams);
  const label = count > 0 ? `Filters (${count})` : "Filters";

  const values: FilterValues = {
    priceMax: searchParams.priceMax,
    amenities: searchParams.amenities ?? [],
  };

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors ${
        count > 0
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-white text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      }`}
    >
      <SlidersHorizontal className="size-3" />
      <span>{label}</span>
    </button>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent className="w-[360px] p-0" align="start" sideOffset={8}>
          <FiltersContent values={values} onChange={onChange} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-background">
          <div className="mx-auto mt-3 mb-2 h-1 w-10 rounded-full bg-muted-foreground/20" />
          <FiltersContent values={values} onChange={onChange} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
