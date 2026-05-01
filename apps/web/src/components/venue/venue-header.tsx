import { MapPin, Share2 } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import type { ApiCourt } from "#/lib/api";
import { formatCentavos } from "#/lib/format";
import { copyCurrentUrl } from "#/lib/share";

export function VenueHeader({ court }: { court: ApiCourt }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <a href="/" className="hover:underline">
            Home
          </a>
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {court.name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {court.locationArea}, Cebu
          </span>
          <span>·</span>
          <span>1 court</span>
          <span>·</span>
          <span>{formatCentavos(court.hourlyRate)}/hr</span>
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => copyCurrentUrl("Share this venue with friends.")}
          >
            <Share2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy link</TooltipContent>
      </Tooltip>
    </div>
  );
}
