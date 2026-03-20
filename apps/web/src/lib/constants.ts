import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  CreditCard,
  MapPin,
  Timer,
  UserX,
  Wallet,
  Zap,
} from "lucide-react";

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

export const FEATURED_VENUES: Venue[] = [
  {
    slug: "baseline-pickle-club",
    name: "Baseline Pickle Club",
    area: "IT Park",
    description: "4 Pro-grade Indoor Courts",
    pricePerHourCentavos: 35000,
    amenities: ["Indoor", "Parking", "Pro Shop"],
    courtCount: 4,
    badge: "Popular",
  },
  {
    slug: "cebu-pickle-arena",
    name: "Cebu Pickle Arena",
    area: "SRP",
    description: "6 Championship Indoor Courts",
    pricePerHourCentavos: 40000,
    amenities: ["Indoor", "Showers", "Parking"],
    courtCount: 6,
    badge: "Verified",
  },
  {
    slug: "smash-court-lahug",
    name: "Smash Court Lahug",
    area: "Lahug",
    description: "3 Covered Floodlit Courts",
    pricePerHourCentavos: 30000,
    amenities: ["Covered", "Floodlights", "Parking"],
    courtCount: 3,
  },
  {
    slug: "net-rush-mandaue",
    name: "Net Rush Mandaue",
    area: "Mandaue",
    description: "2 Outdoor Night Courts",
    pricePerHourCentavos: 28000,
    amenities: ["Outdoor", "Floodlights"],
    courtCount: 2,
  },
  {
    slug: "volley-hub-banilad",
    name: "Volley Hub Banilad",
    area: "Banilad",
    description: "5 Premium Indoor Courts",
    pricePerHourCentavos: 45000,
    amenities: ["Indoor", "Showers", "Pro Shop"],
    courtCount: 5,
    badge: "Trending",
  },
  {
    slug: "island-pickle-mactan",
    name: "Island Pickle Mactan",
    area: "Mactan",
    description: "3 Covered Beachside Courts",
    pricePerHourCentavos: 32000,
    amenities: ["Outdoor", "Covered", "Parking"],
    courtCount: 3,
  },
];

export const ADVANTAGES: Advantage[] = [
  {
    icon: UserX,
    title: "No account needed",
    description: "Book your first court without signing up.",
  },
  {
    icon: Timer,
    title: "Book in under a minute",
    description: "Pick a court, choose a time, and confirm instantly.",
  },
  {
    icon: Wallet,
    title: "GCash & Maya",
    description: "Pay with the e-wallets you already use.",
  },
  {
    icon: Zap,
    title: "Instant confirmation",
    description: "Your booking is confirmed the moment you pay.",
  },
  {
    icon: MapPin,
    title: "Cebu courts only",
    description: "Built for Cebu players. Every court is local.",
  },
];

export const STEPS: Step[] = [
  {
    number: 1,
    title: "Choose your area",
    description: "Browse courts by neighborhood or search by name.",
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
  { label: "For Court Owners", href: "#for-owners" },
];

export const QUICK_PICKS = [
  { label: "Tonight" },
  { label: "Tomorrow" },
  { label: "This weekend" },
  { label: "Indoor only" },
  { label: "Under ₱400" },
];

export const COURT_TYPES = ["Any court", "Indoor", "Outdoor", "Covered"];

export const DURATIONS = ["1 hour", "1.5 hours", "2 hours"];
