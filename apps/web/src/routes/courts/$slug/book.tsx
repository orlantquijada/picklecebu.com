import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import BookingForm from "#/components/booking/BookingForm";
import type { Court } from "#/components/courts/CourtCard";
import { apiFetch } from "#/lib/api";

const searchSchema = z.object({
  date: z.string(),
  numHours: z.number().int(),
  startHour: z.number().int(),
});

const BookPage = () => {
  const { slug } = Route.useParams();
  const { date, startHour, numHours } = Route.useSearch();

  const { data: court, isLoading } = useQuery({
    queryFn: () => apiFetch<Court>(`/api/courts/${slug}`),
    queryKey: ["court", slug],
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-card border border-border" />
          <div className="h-96 rounded-xl bg-card border border-border" />
        </div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <p className="text-destructive">Court not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          to="/courts/$slug"
          params={{ slug }}
          className="text-sm text-primary hover:underline"
        >
          ← Back to {court.name}
        </Link>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="mt-2 text-3xl font-black uppercase tracking-tight"
        >
          Complete Your Booking
        </h1>
      </div>
      <BookingForm
        courtSlug={slug}
        courtName={court.name}
        bookingDate={date}
        startHour={startHour}
        numHours={numHours}
        hourlyRate={court.hourlyRate}
      />
    </div>
  );
};

export const Route = createFileRoute("/courts/$slug/book")({
  component: BookPage,
  validateSearch: searchSchema,
});
