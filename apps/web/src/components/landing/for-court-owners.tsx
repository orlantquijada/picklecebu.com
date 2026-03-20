import { BarChart3, Calendar, Users, Zap } from "lucide-react";

import { Button } from "#/components/ui/button";

const OWNER_BENEFITS = [
  {
    icon: Users,
    text: "Reach Cebu players actively looking",
  },
  {
    icon: Calendar,
    text: "Easy availability management",
  },
  {
    icon: BarChart3,
    text: "Fill your unused court hours",
  },
  {
    icon: Zap,
    text: "Bookings handled automatically",
  },
];

export function ForCourtOwners() {
  return (
    <section
      id="for-owners"
      className="bg-surface-dark py-16 text-surface-dark-foreground md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-surface-dark-foreground/50 italic">
              For court owners
            </p>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Own a pickleball court in&nbsp;Cebu?
            </h2>
            <p className="mb-8 text-base text-surface-dark-foreground/70">
              List your venue and fill your available hours. No setup fees. No
              contracts.
            </p>

            <ul className="space-y-4">
              {OWNER_BENEFITS.map((benefit) => (
                <li
                  key={benefit.text}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-dark-foreground/10">
                    <benefit.icon className="size-4 text-lime" />
                  </div>
                  {benefit.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-center md:text-center">
            <p className="text-lg font-medium text-surface-dark-foreground/80">
              Your courts, visible to every pickleball player in Cebu.
            </p>
            <Button
              size="lg"
              className="h-12 bg-lime px-8 text-base font-semibold text-lime-foreground hover:bg-lime/90"
            >
              List Your Court
            </Button>
            <span className="text-xs text-surface-dark-foreground/40">
              Free to get started. No credit card required.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
