import { Button } from "#/components/ui/button";
import type { VenueDetail } from "#/lib/constants";
import { formatCentavos } from "#/lib/format";

export function BookingSidebar({ venue }: { venue: VenueDetail }) {
  return (
    <div className="sticky top-20 rounded-xl border bg-card p-6 shadow-lg">
      {/* Price — large and prominent */}
      <p className="text-2xl font-bold">
        {formatCentavos(venue.pricePerHourCentavos)}
        <span className="text-base font-normal text-muted-foreground">
          {" "}
          per hour
        </span>
      </p>

      <div className="mt-5 grid grid-cols-2 gap-0 overflow-hidden rounded-lg border">
        <div className="border-r px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide">
            Date
          </p>
          <p className="text-sm">Add date</p>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide">
            Time
          </p>
          <p className="text-sm">Add time</p>
        </div>
        <div className="col-span-2 border-t px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide">
            Players
          </p>
          <p className="text-sm">
            {venue.maxGuests} {venue.maxGuests === 1 ? "player" : "players"} max
          </p>
        </div>
      </div>

      <Button className="mt-4 w-full bg-lime text-lime-foreground hover:bg-lime/90">
        Check availability
      </Button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {venue.operatingHours}
      </p>
    </div>
  );
}

export function MobileBookingBar({ venue }: { venue: VenueDetail }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background px-5 py-4 lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div>
          <p className="font-semibold">
            {formatCentavos(venue.pricePerHourCentavos)}
            <span className="font-normal text-muted-foreground"> /hr</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {venue.courtCount} {venue.courtCount === 1 ? "court" : "courts"}{" "}
            available
          </p>
        </div>
        <Button
          size="lg"
          className="bg-lime text-lime-foreground hover:bg-lime/90"
        >
          Check availability
        </Button>
      </div>
    </div>
  );
}
