import { MapPin } from "lucide-react";

import { Separator } from "#/components/ui/separator";
import type { VenueDetail } from "#/lib/constants";

export function LocationSection({ venue }: { venue: VenueDetail }) {
  return (
    <section id="location">
      <h2 className="text-xl font-semibold">Location</h2>
      <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
        <MapPin className="mt-0.5 size-4 shrink-0" />
        <span>{venue.address}</span>
      </div>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        {venue.locationDescription}
      </p>
      <Separator className="mt-8" />
    </section>
  );
}
