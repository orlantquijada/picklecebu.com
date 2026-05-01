import { useState } from "react";

import { Separator } from "#/components/ui/separator";
import type { ApiCourt } from "#/lib/api";

export function AboutSection({ court }: { court: ApiCourt }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = court.description.length > 200;
  const displayText =
    isLong && !expanded
      ? court.description.slice(0, 200) + "..."
      : court.description;

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
