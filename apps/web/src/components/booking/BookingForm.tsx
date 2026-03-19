import { useForm } from "@tanstack/react-form";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { apiFetch } from "#/lib/api";
import { formatHour } from "#/lib/format";

import BookingTotal from "./BookingTotal";
import NoRefundNotice from "./NoRefundNotice";
import PaymentMethodSelector from "./PaymentMethodSelector";

interface Props {
  courtSlug: string;
  courtName: string;
  bookingDate: string;
  startHour: number;
  numHours: number;
  hourlyRate: number;
}

interface BookingResponse {
  bookingId: string;
  checkoutUrl: string;
}

const BookingForm = ({
  courtSlug,
  courtName,
  bookingDate,
  startHour,
  numHours,
  hourlyRate,
}: Props) => {
  const [error, setError] = useState<string | null>(null);

  const subtotal = hourlyRate * numHours;
  const convenienceFee = 5000;
  const total = subtotal + convenienceFee;

  const form = useForm({
    defaultValues: {
      paymentMethod: "gcash" as "gcash" | "paymaya" | "card",
      playerEmail: "",
      playerName: "",
      playerPhone: "",
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        const res = await apiFetch<BookingResponse>("/api/bookings", {
          body: JSON.stringify({
            bookingDate,
            courtSlug,
            numHours,
            paymentMethod: value.paymentMethod,
            playerEmail: value.playerEmail,
            playerName: value.playerName,
            playerPhone: value.playerPhone,
            startHour,
          }),
          method: "POST",
        });
        window.location.href = res.checkoutUrl;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Booking failed");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      <div className="rounded-lg border bg-muted/20 p-4 text-sm space-y-1">
        <div className="font-semibold">{courtName}</div>
        <div className="text-muted-foreground">
          {bookingDate} · {formatHour(startHour)} –{" "}
          {formatHour(startHour + numHours)} ({numHours}h)
        </div>
      </div>

      <form.Field name="playerName">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="playerName">Full Name</Label>
            <Input
              id="playerName"
              placeholder="Juan dela Cruz"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              required
            />
          </div>
        )}
      </form.Field>

      <form.Field name="playerEmail">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="playerEmail">Email</Label>
            <Input
              id="playerEmail"
              type="email"
              placeholder="juan@example.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              required
            />
          </div>
        )}
      </form.Field>

      <form.Field name="playerPhone">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="playerPhone">Mobile Number</Label>
            <Input
              id="playerPhone"
              type="tel"
              placeholder="+63 917 123 4567"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              required
            />
          </div>
        )}
      </form.Field>

      <div className="space-y-1.5">
        <Label>Payment Method</Label>
        <form.Field name="paymentMethod">
          {(field) => (
            <PaymentMethodSelector
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </form.Field>
      </div>

      <BookingTotal
        subtotal={subtotal}
        convenienceFee={convenienceFee}
        total={total}
      />

      <NoRefundNotice />

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
          {error}
        </p>
      )}

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Redirecting to payment..." : "Confirm & Pay"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};

export default BookingForm;
