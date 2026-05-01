import { CircleAlert, Clock, LogIn, LogOut, Users } from "lucide-react";

import type { ApiCourt } from "#/lib/api";

export function RulesSection({ court }: { court: ApiCourt }) {
  return (
    <section id="rules">
      <h2 className="text-xl font-semibold">Things to know</h2>
      <div className="mt-4 grid gap-8 sm:grid-cols-3">
        {/* Cancellation policy */}
        <div>
          <h3 className="text-sm font-semibold">Cancellation policy</h3>
          <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
            <Clock className="mt-0.5 size-4 shrink-0" />
            <span>{court.cancellationPolicy}</span>
          </div>
        </div>

        {/* Venue rules */}
        <div>
          <h3 className="text-sm font-semibold">Venue rules</h3>
          <ul className="mt-3 space-y-2">
            {court.rules.map((rule) => (
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
              <span>Arrive a few minutes before your slot</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <LogOut className="mt-0.5 size-4 shrink-0" />
              <span>Please vacate the court on time</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <Users className="mt-0.5 size-4 shrink-0" />
              <span>4 players maximum</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
