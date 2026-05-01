import { Link } from "@tanstack/react-router";

import type { ApiCourt } from "#/lib/api";
import { formatCentavos } from "#/lib/format";
import { AMENITY_ICONS } from "#/lib/amenity-icons";

const VENUE_COLORS = [
  "from-emerald-900 to-emerald-950",
  "from-slate-800 to-slate-950",
  "from-cyan-900 to-cyan-950",
  "from-amber-900 to-amber-950",
  "from-violet-900 to-violet-950",
  "from-rose-900 to-rose-950",
];

export function VenueCard({
  court,
  index,
}: {
  court: ApiCourt;
  index: number;
}) {
  return (
    <Link
      to="/venues/$slug"
      params={{ slug: court.slug }}
      className="group block"
    >
      {/* Image area */}
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
          <span className="rounded-md bg-lime px-2 py-1 text-sm font-bold text-lime-foreground">
            {formatCentavos(court.hourlyRate)}
            <span className="text-xs font-medium">/hr</span>
          </span>
        </div>
      </div>

      {/* Details below image */}
      <div className="mt-3 space-y-1">
        <h3 className="text-lg font-bold tracking-tight">{court.name}</h3>
        <p className="text-sm text-muted-foreground">
          {court.locationArea}, Cebu · 1 Court
        </p>
        <div className="flex gap-3 pt-1">
          {court.amenities.slice(0, 3).map((amenity) => {
            const Icon = AMENITY_ICONS[amenity];
            if (!Icon) return null;
            return (
              <span
                key={amenity}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <Icon className="size-3.5" />
                {amenity}
              </span>
            );
          })}
        </div>
      </div>
    </Link>
  );
}
