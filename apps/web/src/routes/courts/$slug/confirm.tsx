import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { apiFetch } from "#/lib/api";
import { formatCentavos, formatHourRange } from "#/lib/format";

const searchSchema = z.object({ booking_id: z.string() });

interface BookingStatus {
  id: string;
  status: "pending" | "confirmed" | "failed" | "cancelled";
  bookingDate: string;
  startHour: number;
  endHour: number;
  playerName: string;
  totalAmount: number;
}

const ConfirmPage = () => {
  const { slug } = Route.useParams();
  const { booking_id } = Route.useSearch();

  const { data: booking } = useQuery({
    queryFn: () =>
      apiFetch<BookingStatus>(`/api/bookings/${booking_id}/status`),
    queryKey: ["booking-status", booking_id],
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (
        status === "confirmed" ||
        status === "failed" ||
        status === "cancelled"
      ) {
        return false;
      }
      return 2000;
    },
  });

  if (!booking || booking.status === "pending") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mb-6 flex justify-center">
          <div
            className="h-16 w-16 rounded-full border-4 border-border border-t-primary"
            style={{ animation: "spin-slow 1s linear infinite" }}
          />
        </div>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="mb-2 text-2xl font-black uppercase tracking-tight"
        >
          Processing Payment...
        </h1>
        <p className="text-muted-foreground">
          Please wait while we confirm your payment.
        </p>
        <div className="mt-6 flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              style={{
                animation: "bounce-dot 0.9s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (booking.status === "confirmed") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="rounded-xl border border-primary/30 bg-card p-8 text-center">
          {/* SVG checkmark in yellow circle */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke="oklch(0.08 0.02 260)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="mb-2 text-3xl font-black uppercase tracking-tight text-primary"
          >
            Booking Confirmed!
          </h1>
          <p className="mb-6 text-muted-foreground">
            A confirmation email has been sent to you. See you on the court!
          </p>
          {/* Receipt card */}
          <div className="mb-6 rounded-lg border border-border bg-muted/20 p-4 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono font-medium text-foreground">
                {booking.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="text-foreground">{booking.bookingDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="text-foreground">
                {formatHourRange(booking.startHour, booking.endHour)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-semibold text-foreground">Total Paid</span>
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-bold text-primary"
              >
                {formatCentavos(booking.totalAmount)}
              </span>
            </div>
          </div>
          <Link
            to="/"
            className="inline-block text-sm text-primary hover:underline"
          >
            ← Find more courts
          </Link>
        </div>
      </div>
    );
  }

  // failed or cancelled
  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-destructive">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-destructive"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </div>
      <h1
        style={{ fontFamily: "var(--font-display)" }}
        className="mb-2 text-2xl font-black uppercase tracking-tight text-destructive"
      >
        Payment Failed
      </h1>
      <p className="mb-6 text-muted-foreground">
        Your payment could not be processed. No charges were made.
      </p>
      <Link
        to="/courts/$slug"
        params={{ slug }}
        className="text-sm text-primary hover:underline"
      >
        ← Try again
      </Link>
    </div>
  );
};

export const Route = createFileRoute("/courts/$slug/confirm")({
  component: ConfirmPage,
  validateSearch: searchSchema,
});
