import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format, addDays } from "date-fns";
import { MapPin } from "lucide-react";
import { useState } from "react";

import CourtAvailabilityGrid from "#/components/courts/CourtAvailabilityGrid";
import type { Court } from "#/components/courts/CourtCard";
import SlotPicker from "#/components/courts/SlotPicker";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { apiFetch } from "#/lib/api";
import { formatCentavos } from "#/lib/format";

interface Slot {
  hour: number;
  available: boolean;
}

const CourtDetailPage = () => {
  const { slug } = Route.useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedStart, setSelectedStart] = useState<number | null>(null);
  const [selectedHours, setSelectedHours] = useState(1);

  const { data: court, isLoading: courtLoading } = useQuery({
    queryFn: () => apiFetch<Court>(`/api/courts/${slug}`),
    queryKey: ["court", slug],
  });

  const { data: slots = [], isLoading: slotsLoading } = useQuery({
    enabled: !!selectedDate,
    queryFn: () =>
      apiFetch<Slot[]>(`/api/courts/${slug}/availability?date=${selectedDate}`),
    queryKey: ["availability", slug, selectedDate],
  });

  if (courtLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-card border border-border" />
          <div className="aspect-video rounded-xl bg-card border border-border" />
        </div>
      </div>
    );
  }

  if (!court) {
    return null;
  }

  const maxHours = (() => {
    if (selectedStart === null) {
      return 6;
    }
    let max = 0;
    for (let h = selectedStart; h < 20; h += 1) {
      const slot = slots.find((s) => s.hour === h);
      if (!slot?.available) {
        break;
      }
      max += 1;
    }
    return Math.min(max, 6);
  })();

  const handleSelectHour = (hour: number) => {
    if (selectedStart === hour) {
      setSelectedStart(null);
      setSelectedHours(1);
    } else {
      setSelectedStart(hour);
      setSelectedHours(1);
    }
  };

  const handleBook = () => {
    if (selectedStart === null) {
      return;
    }
    navigate({
      params: { slug },
      search: {
        date: selectedDate,
        numHours: selectedHours,
        startHour: selectedStart,
      },
      to: "/courts/$slug/book",
    });
  };

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i);
    return { label: format(d, "EEE, MMM d"), value: format(d, "yyyy-MM-dd") };
  });

  const slotSkeletonHours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Cover with overlay */}
      <div className="mb-6 relative aspect-video overflow-hidden rounded-xl bg-muted">
        {court.coverImageUrl ? (
          <img
            src={court.coverImageUrl}
            alt={court.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center court-pattern">
            <svg
              className="h-16 w-16 text-primary/30"
              viewBox="0 0 48 48"
              fill="none"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M24 4 Q32 16 24 24 Q16 32 24 44"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M4 24 Q16 16 24 24 Q32 32 44 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        )}
        {/* Gradient overlay with court name */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-3xl font-black uppercase tracking-tight text-foreground leading-none"
          >
            {court.name}
          </h1>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{court.address}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Info */}
        <div className="lg:col-span-2 space-y-6">
          {court.description && (
            <p className="text-muted-foreground">{court.description}</p>
          )}

          {court.amenities.length > 0 && (
            <div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground"
              >
                Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {court.amenities.map((a) => (
                  <Badge
                    key={a}
                    variant="secondary"
                    className="bg-muted text-muted-foreground border-0"
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="mb-3 font-bold uppercase tracking-wide text-foreground"
            >
              Select Date
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dates.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => {
                    setSelectedDate(d.value);
                    setSelectedStart(null);
                    setSelectedHours(1);
                  }}
                  className={[
                    "shrink-0 rounded-lg border px-3 py-2 text-center text-sm transition-all duration-150",
                    selectedDate === d.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50",
                  ].join(" ")}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Grid */}
          <div>
            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="mb-3 font-bold uppercase tracking-wide text-foreground"
            >
              Available Slots
            </h3>
            {slotsLoading ? (
              <div className="grid grid-cols-7 gap-1.5">
                {slotSkeletonHours.map((h) => (
                  <div
                    key={h}
                    className="h-10 animate-pulse rounded-md bg-card border border-border"
                  />
                ))}
              </div>
            ) : (
              <CourtAvailabilityGrid
                slots={slots}
                selectedStart={selectedStart}
                selectedHours={selectedHours}
                onSelectHour={handleSelectHour}
              />
            )}
          </div>
        </div>

        {/* Right: Booking Panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl font-bold text-primary"
              >
                {formatCentavos(court.hourlyRate)}
              </span>
              <span className="text-sm text-muted-foreground">/hour</span>
            </div>
            <SlotPicker
              selectedStart={selectedStart}
              selectedHours={selectedHours}
              hourlyRate={court.hourlyRate}
              onChangeHours={setSelectedHours}
              maxHours={maxHours}
            />
            {selectedStart !== null && (
              <Button
                className="mt-4 w-full"
                size="lg"
                onClick={handleBook}
                disabled={maxHours === 0}
              >
                Book Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/courts/$slug/")({
  component: CourtDetailPage,
});
