import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { ApiError, createBooking, type ApiCourt } from "#/lib/api";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

type PaymentMethod = "gcash" | "paymaya";

type Props = {
  slug: string;
  date: string;
  startHour: number;
  numHours: number;
  court: ApiCourt;
};

const nameSchema = z.string().min(2, "At least 2 characters").max(100, "Too long");
const emailSchema = z.string().email("Enter a valid email");
const phoneSchema = z.string().min(7, "Enter a valid phone number").max(20, "Too long");

function FieldError({ errors }: { errors: unknown[] }) {
  const first = errors[0];
  if (!first) return null;
  const msg =
    first && typeof first === "object" && "message" in first
      ? String((first as { message: unknown }).message)
      : String(first);
  return <p className="mt-1.5 text-sm text-destructive">{msg}</p>;
}

export function CheckoutForm({ slug, date, startHour, numHours }: Props) {
  const [slotError, setSlotError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "+63",
      paymentMethod: "gcash" as PaymentMethod,
    },
    onSubmit: async ({ value }) => {
      setSlotError(null);
      try {
        const { bookingId, checkoutUrl } = await createBooking({
          bookingDate: date,
          courtSlug: slug,
          numHours,
          paymentMethod: value.paymentMethod,
          playerEmail: value.email,
          playerName: value.name.trim(),
          playerPhone: value.phone,
          startHour,
        });
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          // TODO: remove mock navigation once PayMongo API keys are configured
          navigate({
            to: "/venues/$slug/confirm",
            params: { slug },
            search: { booking_id: bookingId },
          });
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          setSlotError("This slot was just taken. Go back and pick another time.");
        } else {
          toast.error("Payment setup failed. Please try again.");
        }
      }
    },
  });

  const isSubmitting = form.state.isSubmitting;
  const methodLabel =
    form.state.values.paymentMethod === "gcash" ? "GCash" : "Maya";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      <form.Field
        name="name"
        validators={{ onChange: nameSchema, onSubmit: nameSchema }}
      >
        {(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="mb-1.5 block text-sm font-medium"
            >
              Full name
            </label>
            <Input
              id={field.name}
              aria-invalid={
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0
              }
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Juan Dela Cruz"
            />
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{ onChange: emailSchema, onSubmit: emailSchema }}
      >
        {(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="mb-1.5 block text-sm font-medium"
            >
              Email
            </label>
            <Input
              id={field.name}
              type="email"
              aria-invalid={
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0
              }
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="juan@example.com"
            />
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="phone"
        validators={{ onChange: phoneSchema, onSubmit: phoneSchema }}
      >
        {(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="mb-1.5 block text-sm font-medium"
            >
              Phone
            </label>
            <Input
              id={field.name}
              type="tel"
              aria-invalid={
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0
              }
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="+63 917 123 4567"
            />
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="paymentMethod">
        {(field) => (
          <div>
            <p className="mb-2 text-sm font-medium">Pay with</p>
            <div className="flex gap-2">
              {(["gcash", "paymaya"] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => field.handleChange(method)}
                  className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                    field.state.value === method
                      ? "border-lime bg-lime text-lime-foreground"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {method === "gcash" ? "GCash" : "Maya"}
                </button>
              ))}
            </div>
          </div>
        )}
      </form.Field>

      {slotError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          <p>{slotError}</p>
          <Link
            to="/venues/$slug"
            params={{ slug }}
            className="mt-1 block font-medium underline"
          >
            Back to court
          </Link>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full bg-lime text-lime-foreground hover:bg-lime/90"
      >
        {isSubmitting ? "Redirecting…" : `Pay with ${methodLabel}`}
      </Button>
    </form>
  );
}
