import { Check } from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { QUICK_PICKS } from "#/lib/constants";

import { BookingBar } from "./booking-bar";

const TRUST_CHIPS = [
  "No account needed",
  "Instant booking",
  "GCash & Maya",
  "Cebu courts only",
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-12 pt-12 md:pb-20 md:pt-20"
    >
      {/* Subtle court-line background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="court-grid"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="10"
                y="10"
                width="100"
                height="100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="10"
                y1="60"
                x2="110"
                y2="60"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="35"
                y="30"
                width="50"
                height="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#court-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground italic">
            Cebu&rsquo;s court booking platform
          </p>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Book a pickleball court in&nbsp;Cebu.
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-base text-muted-foreground md:text-lg">
            See real-time availability, book instantly with GCash or Maya, and
            play today. No account needed.
          </p>
        </div>

        <BookingBar />

        {/* Trust chips */}
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2">
          {TRUST_CHIPS.map((chip) => (
            <Badge
              key={chip}
              variant="secondary"
              className="gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            >
              <Check className="size-3 text-lime-foreground" />
              {chip}
            </Badge>
          ))}
        </div>

        {/* Quick picks */}
        <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2">
          {QUICK_PICKS.map((pick) => (
            <button
              key={pick.label}
              type="button"
              className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-lime hover:bg-lime/10 hover:text-foreground"
            >
              {pick.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
