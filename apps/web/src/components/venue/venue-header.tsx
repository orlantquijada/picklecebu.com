import { MapPin, Share2 } from "lucide-react";

import { Button } from "#/components/ui/button";
import type { VenueDetail } from "#/lib/constants";
import { formatCentavos } from "#/lib/format";

export function VenueHeader({ venue }: { venue: VenueDetail }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <a href="/" className="hover:underline">
            Home
          </a>
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {venue.name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {venue.area}, Cebu
          </span>
          <span>·</span>
          <span>
            {venue.courtCount} {venue.courtCount === 1 ? "court" : "courts"}
          </span>
          <span>·</span>
          <span>{formatCentavos(venue.pricePerHourCentavos)}/hr</span>
        </div>
      </div>
      <Button variant="outline" size="icon" className="shrink-0">
        <Share2 className="size-4" />
      </Button>
    </div>
  );
}
