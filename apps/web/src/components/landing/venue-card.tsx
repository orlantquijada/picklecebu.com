import { Zap } from "lucide-react";

import type { Venue } from "#/lib/constants";
import { formatCentavos } from "#/lib/format";

const VENUE_COLORS = [
  "from-emerald-900 to-emerald-950",
  "from-slate-800 to-slate-950",
  "from-cyan-900 to-cyan-950",
  "from-amber-900 to-amber-950",
  "from-violet-900 to-violet-950",
  "from-rose-900 to-rose-950",
];

const AMENITY_ICONS: Record<string, string> = {
  Indoor: "🏠",
  Outdoor: "☀️",
  Covered: "🏗️",
  Floodlights: "💡",
  Parking: "🅿️",
  Showers: "🚿",
  "Pro Shop": "🏪",
};

export function VenueCard({
  venue,
  index,
}: {
  venue: Venue;
  index: number;
}) {
  return (
    <div className="group cursor-pointer">
      {/* Image area — tall card with overlaid content */}
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br ${VENUE_COLORS[index % VENUE_COLORS.length]}`}
      >
        {/* Court-line SVG pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-15"
          viewBox="0 0 300 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect
            x="30"
            y="60"
            width="240"
            height="280"
            stroke="white"
            strokeWidth="2"
            rx="2"
          />
          <line
            x1="30"
            y1="200"
            x2="270"
            y2="200"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="8 5"
          />
          <rect
            x="80"
            y="60"
            width="140"
            height="280"
            stroke="white"
            strokeWidth="1.5"
            rx="1"
          />
          <line
            x1="150"
            y1="60"
            x2="150"
            y2="340"
            stroke="white"
            strokeWidth="0.5"
          />
          <circle cx="150" cy="200" r="8" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>

        {/* Price badge — top right */}
        <div className="absolute right-3 top-3 z-10">
          <span className="rounded-lg bg-lime px-2.5 py-1.5 text-sm font-bold text-lime-foreground shadow-md">
            {formatCentavos(venue.pricePerHourCentavos)}
            <span className="text-xs font-medium">/HR</span>
          </span>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Overlaid text — bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          {venue.badge && (
            <div className="mb-2 flex items-center gap-1.5">
              <Zap className="size-3.5 fill-lime text-lime" />
              <span className="text-xs font-semibold uppercase tracking-wider text-lime">
                {venue.badge}
              </span>
            </div>
          )}
          <h3 className="text-xl font-bold tracking-tight text-white">
            {venue.name}
          </h3>
        </div>
      </div>

      {/* Metadata below card */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {venue.area}, Cebu
          </p>
          <p className="mt-0.5 text-sm text-foreground">
            {venue.description}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5 pt-0.5">
          {venue.amenities.slice(0, 2).map((amenity) => (
            <span
              key={amenity}
              className="text-base text-muted-foreground"
              title={amenity}
            >
              {AMENITY_ICONS[amenity] ?? "·"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
