import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import type { ApiCourt } from "#/lib/api";
import { formatCentavos, formatHour } from "#/lib/format";
import { formatDateLabel } from "#/lib/search-params";

type BookingParams = {
  date?: string;
  start?: string;
  duration?: string;
};

export function BookingSidebar({
  court,
  booking,
}: {
  court: ApiCourt;
  booking?: BookingParams;
}) {
  const hasDate = !!booking?.date;
  const hasTime = !!booking?.start;
  const durationHrs = booking?.duration ? Number(booking.duration) / 60 : 1;

  return (
    <div className="sticky top-20 rounded-xl border bg-card p-6 shadow-lg">
      {/* Price — large and prominent */}
      <p className="text-2xl font-bold">
        {formatCentavos(court.hourlyRate)}
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
          <p className="text-sm">
            {booking?.date ? formatDateLabel(booking.date) : "Add date"}
          </p>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide">
            Time
          </p>
          <p className="text-sm">
            {booking?.start ? formatHour(Number(booking.start)) : "Add time"}
          </p>
        </div>
        <div className="col-span-2 border-t px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide">
            Duration
          </p>
          <p className="text-sm">
            {durationHrs} {durationHrs === 1 ? "hour" : "hours"}
          </p>
        </div>
      </div>

      {hasDate && hasTime && booking?.date && booking?.start ? (
        <Button
          asChild
          className="mt-4 w-full bg-lime text-lime-foreground hover:bg-lime/90"
        >
          <Link
            to="/venues/$slug/book"
            params={{ slug: court.slug }}
            search={{
              date: booking.date,
              start: Number(booking.start),
              duration: Number(booking.duration ?? "60"),
            }}
          >
            Book now
          </Link>
        </Button>
      ) : (
        <Button className="mt-4 w-full bg-lime text-lime-foreground hover:bg-lime/90">
          Check availability
        </Button>
      )}

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {court.operatingHours}
      </p>
    </div>
  );
}

export function MobileBookingBar({ court }: { court: ApiCourt }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background px-5 py-4 lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div>
          <p className="font-semibold">
            {formatCentavos(court.hourlyRate)}
            <span className="font-normal text-muted-foreground"> /hr</span>
          </p>
          <p className="text-sm text-muted-foreground">1 court available</p>
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
