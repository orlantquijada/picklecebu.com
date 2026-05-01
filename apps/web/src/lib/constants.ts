import type { LucideIcon } from "lucide-react";
import { CalendarCheck, CreditCard, MapPin, Wallet, Zap } from "lucide-react";

export type Area = {
  name: string;
  slug: string;
  courtCount: number;
};

export type Amenity =
  | "Indoor"
  | "Outdoor"
  | "Covered"
  | "Floodlights"
  | "Parking"
  | "Showers"
  | "Pro Shop";

export type Venue = {
  slug: string;
  name: string;
  area: string;
  description: string;
  pricePerHourCentavos: number;
  amenities: Amenity[];
  courtCount: number;
  badge?: string;
};

export type CourtInfo = {
  name: string;
  type: "Indoor" | "Outdoor" | "Covered";
};

export type VenueDetail = Venue & {
  address: string;
  fullDescription: string;
  operatingHours: string;
  courts: CourtInfo[];
  rules: string[];
  cancellationPolicy: string;
  checkInTime: string;
  checkOutTime: string;
  maxGuests: number;
  locationDescription: string;
};

export type Advantage = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Step = {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const AREAS: Area[] = [
  { name: "Cebu City", slug: "cebu-city", courtCount: 8 },
  { name: "Lahug", slug: "lahug", courtCount: 4 },
  { name: "IT Park", slug: "it-park", courtCount: 3 },
  { name: "Banilad", slug: "banilad", courtCount: 3 },
  { name: "Talamban", slug: "talamban", courtCount: 2 },
  { name: "Mandaue", slug: "mandaue", courtCount: 5 },
  { name: "Mactan", slug: "mactan", courtCount: 3 },
  { name: "Talisay", slug: "talisay", courtCount: 2 },
  { name: "SRP", slug: "srp", courtCount: 4 },
];

export const ADVANTAGES: Advantage[] = [
  {
    icon: Zap,
    title: "Book in seconds",
    description:
      "No signup needed. Pick a court, choose a time, confirm instantly.",
  },
  {
    icon: Wallet,
    title: "GCash & Maya",
    description: "Pay with the e-wallets you already use. No cash, no hassle.",
  },
  {
    icon: MapPin,
    title: "Made for Cebu",
    description:
      "Every court is local. Built by and for Cebu's pickleball community.",
  },
];

export const STEPS: Step[] = [
  {
    number: 1,
    title: "Pick an area",
    description: "Browse courts by area or search by venue name.",
    icon: MapPin,
  },
  {
    number: 2,
    title: "Pick a time slot",
    description: "See real-time availability and choose your hour.",
    icon: CalendarCheck,
  },
  {
    number: 3,
    title: "Pay and play",
    description: "Pay with GCash or Maya. You're booked.",
    icon: CreditCard,
  },
];

export const NAV_LINKS = [
  { label: "Browse Courts", href: "#browse" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "List Your Court", href: "#for-owners" },
];

export const QUICK_PICKS = [
  { label: "Tonight" },
  { label: "Tomorrow" },
  { label: "Weekend" },
  { label: "Indoor" },
  { label: "Under ₱400" },
];

export const COURT_TYPES = ["Any court", "Indoor", "Outdoor", "Covered"];

export const DURATIONS = ["1 hour", "2 hours"];
