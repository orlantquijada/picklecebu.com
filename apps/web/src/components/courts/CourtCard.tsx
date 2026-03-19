import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { formatCentavos } from "#/lib/format";

export interface Court {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  locationArea: string;
  amenities: string[];
  coverImageUrl: string | null;
  hourlyRate: number;
}

export default function CourtCard({ court }: { court: Court }) {
  return (
    <Link
      to="/courts/$slug"
      params={{ slug: court.slug }}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_oklch(0.92_0.28_110/0.12)]">
        {/* Yellow left accent bar */}
        <div className="absolute inset-y-0 left-0 w-[3px] origin-bottom scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />

        {/* Image */}
        <div className="aspect-video overflow-hidden bg-muted relative">
          {court.coverImageUrl ? (
            <img
              src={court.coverImageUrl}
              alt={court.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center court-pattern">
              <svg
                className="h-12 w-12 text-primary/40"
                viewBox="0 0 48 48"
                fill="none"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M24 4 Q32 16 24 24 Q16 32 24 44"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M4 24 Q16 16 24 24 Q32 32 44 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
              {court.name}
            </h3>
            <span
              style={{ fontFamily: "var(--font-display)" }}
              className="shrink-0 text-lg font-bold leading-none text-primary"
            >
              {formatCentavos(court.hourlyRate)}/hr
            </span>
          </div>
          <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{court.locationArea}</span>
          </div>
          {court.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {court.amenities.slice(0, 3).map((a) => (
                <Badge
                  key={a}
                  variant="secondary"
                  className="text-xs bg-muted text-muted-foreground border-0"
                >
                  {a}
                </Badge>
              ))}
              {court.amenities.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs border-border text-muted-foreground"
                >
                  +{court.amenities.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
