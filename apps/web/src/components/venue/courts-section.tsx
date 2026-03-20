import { Warehouse, Sun, Umbrella } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Separator } from "#/components/ui/separator";
import type { VenueDetail, CourtInfo } from "#/lib/constants";

const COURT_TYPE_ICONS: Record<CourtInfo["type"], LucideIcon> = {
  Indoor: Warehouse,
  Outdoor: Sun,
  Covered: Umbrella,
};

const COURT_COLORS = [
  "from-emerald-900 to-emerald-950",
  "from-slate-800 to-slate-950",
  "from-cyan-900 to-cyan-950",
  "from-amber-900 to-amber-950",
  "from-violet-900 to-violet-950",
  "from-rose-900 to-rose-950",
];

export function CourtsSection({ venue }: { venue: VenueDetail }) {
  return (
    <section id="courts">
      <h2 className="text-xl font-semibold">Available courts</h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {venue.courts.map((court, i) => {
          const Icon = COURT_TYPE_ICONS[court.type];
          return (
            <div key={court.name} className="w-44 shrink-0">
              <div
                className={`flex h-28 items-center justify-center rounded-xl bg-gradient-to-br ${COURT_COLORS[i % COURT_COLORS.length]}`}
              >
                <svg
                  className="h-full w-full opacity-15"
                  viewBox="0 0 300 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect
                    x="30"
                    y="20"
                    width="240"
                    height="160"
                    stroke="white"
                    strokeWidth="2"
                    rx="2"
                  />
                  <line
                    x1="150"
                    y1="20"
                    x2="150"
                    y2="180"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="8 5"
                  />
                </svg>
              </div>
              <p className="mt-2 text-sm font-semibold">{court.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon className="size-3" />
                {court.type}
              </p>
            </div>
          );
        })}
      </div>
      <Separator className="mt-8" />
    </section>
  );
}
