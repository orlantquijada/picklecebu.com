import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parse } from "date-fns";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "#/components/ui/button";
import { ApiError } from "#/lib/api";
import { formatCentavos, formatHourRange } from "#/lib/format";
import { useBookingStatusQuery, useCourtQuery } from "#/lib/queries";

const confirmSearchSchema = z.object({
  booking_id: z.string().default(""),
});

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-8 w-8 animate-spin text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function PendingState() {
  return (
    <PageShell>
      <div className="flex flex-col items-center gap-4 text-center">
        <Spinner />
        <div>
          <h1 className="text-xl font-semibold">Confirming your booking…</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Don't close this tab. This usually takes a few seconds.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function TimedOutState() {
  return (
    <PageShell>
      <div className="flex flex-col items-center gap-4 text-center">
        <Clock className="h-10 w-10 text-muted-foreground" />
        <div>
          <h1 className="text-xl font-semibold">Still confirming…</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This is taking longer than expected. Check your email — a
            confirmation will arrive once payment clears.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </PageShell>
  );
}

function FailedState({ slug }: { slug: string }) {
  return (
    <PageShell>
      <div className="flex flex-col items-center gap-4 text-center">
        <XCircle className="h-10 w-10 text-destructive" />
        <div>
          <h1 className="text-xl font-semibold">Payment unsuccessful</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your booking was not completed. You have not been charged.
          </p>
        </div>
        <Button asChild>
          <Link to="/venues/$slug" params={{ slug }}>
            Try again
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}

function NotFoundState() {
  return (
    <PageShell>
      <div className="text-center">
        <h1 className="text-xl font-semibold">Booking not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This booking reference doesn't exist.
        </p>
        <a href="/" className="mt-4 inline-block text-sm underline">
          Back to home
        </a>
      </div>
    </PageShell>
  );
}

function ErrorState() {
  return (
    <PageShell>
      <div className="text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Unable to load your booking status. Please try refreshing.
        </p>
        <a href="/" className="mt-4 inline-block text-sm underline">
          Back to home
        </a>
      </div>
    </PageShell>
  );
}

function formatBookingDate(dateStr: string): string {
  try {
    const d = parse(dateStr, "yyyy-MM-dd", new Date());
    return format(d, "EEEE, MMMM d, yyyy");
  } catch {
    return dateStr;
  }
}

interface ConfirmedStateProps {
  bookingId: string;
  bookingDate: string;
  startHour: number;
  endHour: number;
  totalAmount: number;
  playerName: string;
  courtName: string | undefined;
  slug: string;
}

function ConfirmedState({
  bookingId,
  bookingDate,
  startHour,
  endHour,
  totalAmount,
  playerName,
  courtName,
  slug,
}: ConfirmedStateProps) {
  return (
    <PageShell>
      <div className="flex flex-col items-center gap-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <div>
          <h1 className="text-2xl font-bold">Booking confirmed!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A confirmation email has been sent to {playerName}.
          </p>
        </div>

        <div className="w-full rounded-xl border bg-card p-6 text-left shadow-sm">
          <p className="text-xs font-mono text-muted-foreground">{bookingId}</p>

          {courtName && (
            <p className="mt-3 font-semibold">{courtName}</p>
          )}

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{formatBookingDate(bookingDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{formatHourRange(startHour, endHour)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground">Total paid</span>
              <span className="font-semibold">{formatCentavos(totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/venues/$slug" params={{ slug }}>
              Back to venue
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link to="/">Explore courts</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

function ConfirmPage() {
  const { slug } = Route.useParams();
  const { booking_id: bookingId } = Route.useSearch();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 30_000);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, error } = useBookingStatusQuery(bookingId, !timedOut);
  const { data: court } = useCourtQuery(slug);

  if (error instanceof ApiError && error.status === 404) {
    return <NotFoundState />;
  }
  if (error) {
    return <ErrorState />;
  }
  if (isLoading || !data) {
    return <PendingState />;
  }

  if (data.status === "confirmed") {
    return (
      <ConfirmedState
        bookingId={data.id}
        bookingDate={data.bookingDate}
        startHour={data.startHour}
        endHour={data.endHour}
        totalAmount={data.totalAmount}
        playerName={data.playerName}
        courtName={court?.name}
        slug={slug}
      />
    );
  }

  if (data.status === "failed" || data.status === "cancelled") {
    return <FailedState slug={slug} />;
  }

  // status === "pending"
  if (timedOut) {
    return <TimedOutState />;
  }

  return <PendingState />;
}

export const Route = createFileRoute("/_layout/venues/$slug_/confirm")({
  component: ConfirmPage,
  validateSearch: (search) => confirmSearchSchema.parse(search),
});
