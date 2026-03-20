import { useState } from "react";

import { Separator } from "#/components/ui/separator";
import type { VenueDetail } from "#/lib/constants";

export function AboutSection({ venue }: { venue: VenueDetail }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = venue.fullDescription.length > 200;
  const displayText =
    isLong && !expanded
      ? venue.fullDescription.slice(0, 200) + "..."
      : venue.fullDescription;

  return (
    <section id="about">
      <h2 className="text-xl font-semibold">About the venue</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        {displayText}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm font-medium underline underline-offset-4"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
      <Separator className="mt-8" />
    </section>
  );
}
