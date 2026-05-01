import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";

import { CheckoutForm } from "#/components/booking/CheckoutForm";
import { formatCentavos, formatHourRange } from "#/lib/format";
import { useCourtQuery } from "#/lib/queries";
import { formatDateLabel } from "#/lib/search-params";

const bookSearchSchema = z.object({
  date: z.string().optional(),
  start: z.coerce.number().optional(),
  duration: z.coerce.number().optional(),
});

function BookSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
      <div className="h-5 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

function BookPage() {
  const { slug } = Route.useParams();
  const { date, start, duration } = Route.useSearch();

  const startHour = start ?? 9;
  const numHours = Math.round((duration ?? 60) / 60);
  const endHour = startHour + numHours;

  const { data: court, isPending, isError } = useCourtQuery(slug);

  if (isPending) return <BookSkeleton />;

  if (isError || !court) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">Court not found.</p>
        <a href="/" className="mt-4 inline-block text-sm underline">
          Back to home
        </a>
      </div>
    );
  }

  const subtotal = court.hourlyRate * numHours;
  const convenienceFee = 5000;
  const total = subtotal + convenienceFee;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
      <Link
        to="/venues/$slug"
        params={{ slug }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        {court.name}
      </Link>

      <h1 className="mt-4 text-2xl font-bold">Complete your booking</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <CheckoutForm
          slug={slug}
          date={date!}
          startHour={startHour}
          numHours={numHours}
          court={court}
        />

        {/* Summary */}
        <div>
          <div className="sticky top-20 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="font-semibold">{court.name}</h2>

            <div className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {date ? formatDateLabel(date) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">
                  {formatHourRange(startHour, endHour)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">
                  {numHours} {numHours === 1 ? "hour" : "hours"}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCentavos(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Convenience fee</span>
                <span>{formatCentavos(convenienceFee)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>{formatCentavos(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_layout/venues/$slug_/book")({
  component: BookPage,
  validateSearch: (search) => bookSearchSchema.parse(search),
  beforeLoad: ({ search, params }) => {
    if (!search.date || !search.start || !search.duration) {
      throw redirect({
        to: "/venues/$slug",
        params: { slug: params.slug },
      });
    }
  },
});
