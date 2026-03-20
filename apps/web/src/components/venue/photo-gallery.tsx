import { Images } from "lucide-react";

import { Button } from "#/components/ui/button";

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
        <circle
          cx="150"
          cy="200"
          r="8"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
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
