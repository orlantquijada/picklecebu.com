import type { LucideIcon } from "lucide-react";
import {
  CircleParking,
  Lightbulb,
  ShowerHead,
  Store,
  Sun,
  Umbrella,
  Warehouse,
} from "lucide-react";

export const AMENITY_ICONS: Record<string, LucideIcon> = {
  Indoor: Warehouse,
  Outdoor: Sun,
  Covered: Umbrella,
  Floodlights: Lightbulb,
  Parking: CircleParking,
  Showers: ShowerHead,
  "Pro Shop": Store,
};
