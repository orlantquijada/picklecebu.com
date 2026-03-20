import { CircleAlert, Clock, LogIn, LogOut, Users } from "lucide-react";

import type { VenueDetail } from "#/lib/constants";

export function RulesSection({ venue }: { venue: VenueDetail }) {
  return (
    <section id="rules">
      <h2 className="text-xl font-semibold">Things to know</h2>
      <div className="mt-4 grid gap-8 sm:grid-cols-3">
        {/* Cancellation policy */}
        <div>
          <h3 className="text-sm font-semibold">Cancellation policy</h3>
          <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
            <Clock className="mt-0.5 size-4 shrink-0" />
            <span>{venue.cancellationPolicy}</span>
          </div>
        </div>

        {/* Venue rules */}
        <div>
          <h3 className="text-sm font-semibold">Venue rules</h3>
          <ul className="mt-3 space-y-2">
            {venue.rules.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Check-in info */}
        <div>
          <h3 className="text-sm font-semibold">Check-in info</h3>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <LogIn className="mt-0.5 size-4 shrink-0" />
              <span>{venue.checkInTime}</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <LogOut className="mt-0.5 size-4 shrink-0" />
              <span>{venue.checkOutTime}</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <Users className="mt-0.5 size-4 shrink-0" />
              <span>{venue.maxGuests} players maximum</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
