import { Images } from "lucide-react";

import { Button } from "#/components/ui/button";
import { CourtPatternSVG } from "#/components/icons/court-pattern-svg";

const GALLERY_COLORS = [
  "from-emerald-900 to-emerald-950",
  "from-slate-800 to-slate-950",
  "from-cyan-900 to-cyan-950",
  "from-amber-900 to-amber-950",
  "from-violet-900 to-violet-950",
];

function PlaceholderImage({
  colorClass,
  className,
}: {
  colorClass: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${colorClass} ${className ?? ""}`}
    >
      <CourtPatternSVG />
    </div>
  );
}

export function PhotoGallery() {
  return (
    <div className="grid h-[28rem] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl sm:h-[32rem]">
      {/* Large hero image */}
      <PlaceholderImage
        colorClass={GALLERY_COLORS[0]}
        className="col-span-2 row-span-2"
      />
      {/* 4 smaller images */}
      <PlaceholderImage colorClass={GALLERY_COLORS[1]} />
      <PlaceholderImage colorClass={GALLERY_COLORS[2]} />
      <div className="relative">
        <PlaceholderImage
          colorClass={GALLERY_COLORS[3]}
          className="h-full w-full"
        />
      </div>
      <div className="relative">
        <PlaceholderImage
          colorClass={GALLERY_COLORS[4]}
          className="h-full w-full"
        />
        <div className="absolute inset-0 flex items-end justify-end p-3">
          <Button variant="secondary" size="sm" className="gap-1.5 shadow-sm">
            <Images className="size-4" />
            Show all photos
          </Button>
        </div>
      </div>
    </div>
  );
}
