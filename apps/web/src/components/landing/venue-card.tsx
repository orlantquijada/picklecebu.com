import { Link } from "@tanstack/react-router";

import { CourtPatternSVG } from "#/components/icons/court-pattern-svg";
import type { ApiCourt } from "#/lib/api";
import { AMENITY_ICONS } from "#/components/icons/amenity-icons";
import { formatCentavos } from "#/lib/format";

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
        <CourtPatternSVG />

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
