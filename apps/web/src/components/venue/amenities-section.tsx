import { Separator } from "#/components/ui/separator";
import type { VenueDetail } from "#/lib/constants";
import { AMENITY_ICONS } from "#/lib/amenity-icons";

export function AmenitiesSection({ venue }: { venue: VenueDetail }) {
  return (
    <section id="amenities">
      <h2 className="text-xl font-semibold">Amenities</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {venue.amenities.map((amenity) => {
          const Icon = AMENITY_ICONS[amenity];
          if (!Icon) return null;
          return (
            <div key={amenity} className="flex items-center gap-3">
              <Icon className="size-5 text-muted-foreground" />
              <span className="text-sm">{amenity}</span>
            </div>
          );
        })}
      </div>
      <Separator className="mt-8" />
    </section>
  );
}
