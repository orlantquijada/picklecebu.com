import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  CreditCard,
  MapPin,
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

export const FEATURED_VENUES: Venue[] = [
  {
    slug: "baseline-pickle-club",
    name: "Baseline Pickle Club",
    area: "IT Park",
    description: "4 indoor courts",
    pricePerHourCentavos: 35000,
    amenities: ["Indoor", "Parking", "Pro Shop"],
    courtCount: 4,
    badge: "Popular",
  },
  {
    slug: "cebu-pickle-arena",
    name: "Cebu Pickle Arena",
    area: "SRP",
    description: "6 indoor courts",
    pricePerHourCentavos: 40000,
    amenities: ["Indoor", "Showers", "Parking"],
    courtCount: 6,
    badge: "Verified",
  },
  {
    slug: "smash-court-lahug",
    name: "Smash Court Lahug",
    area: "Lahug",
    description: "3 covered courts",
    pricePerHourCentavos: 30000,
    amenities: ["Covered", "Floodlights", "Parking"],
    courtCount: 3,
  },
  {
    slug: "net-rush-mandaue",
    name: "Net Rush Mandaue",
    area: "Mandaue",
    description: "2 outdoor courts",
    pricePerHourCentavos: 28000,
    amenities: ["Outdoor", "Floodlights"],
    courtCount: 2,
  },
  {
    slug: "volley-hub-banilad",
    name: "Volley Hub Banilad",
    area: "Banilad",
    description: "5 indoor courts",
    pricePerHourCentavos: 45000,
    amenities: ["Indoor", "Showers", "Pro Shop"],
    courtCount: 5,
    badge: "Trending",
  },
  {
    slug: "island-pickle-mactan",
    name: "Island Pickle Mactan",
    area: "Mactan",
    description: "3 covered courts",
    pricePerHourCentavos: 32000,
    amenities: ["Outdoor", "Covered", "Parking"],
    courtCount: 3,
  },
];

export const VENUE_DETAILS: Record<string, VenueDetail> = {
  "baseline-pickle-club": {
    slug: "baseline-pickle-club",
    name: "Baseline Pickle Club",
    area: "IT Park",
    description: "4 indoor courts",
    pricePerHourCentavos: 35000,
    amenities: ["Indoor", "Parking", "Pro Shop", "Showers"],
    courtCount: 4,
    badge: "Popular",
    address: "IT Park, Apas, Cebu City 6000",
    fullDescription:
      "Baseline Pickle Club is Cebu's premier indoor pickleball facility, located in the heart of IT Park. Featuring four regulation-size indoor courts with professional-grade surfaces, air conditioning, and LED lighting. Whether you're a beginner looking to learn the game or a competitive player seeking quality court time, Baseline has you covered. The facility includes a fully stocked pro shop, clean shower rooms, and a lounge area where you can relax between games.",
    operatingHours: "6:00 AM – 10:00 PM daily",
    courts: [
      { name: "Court 1", type: "Indoor" },
      { name: "Court 2", type: "Indoor" },
      { name: "Court 3", type: "Indoor" },
      { name: "Court 4", type: "Indoor" },
    ],
    rules: [
      "Proper court shoes required",
      "No food or drinks on the court",
      "Maximum 4 players per court",
      "15-minute grace period for late arrivals",
    ],
    cancellationPolicy: "Free cancellation up to 2 hours before your booking.",
    checkInTime: "Arrive 10 minutes before your slot",
    checkOutTime: "Please vacate the court promptly at session end",
    maxGuests: 4,
    locationDescription:
      "Located in IT Park, Cebu's thriving business and lifestyle district. Easy access from major roads with plenty of nearby restaurants and cafes. Paid parking available in the IT Park complex.",
  },
  "cebu-pickle-arena": {
    slug: "cebu-pickle-arena",
    name: "Cebu Pickle Arena",
    area: "SRP",
    description: "6 indoor courts",
    pricePerHourCentavos: 40000,
    amenities: ["Indoor", "Showers", "Parking", "Pro Shop", "Floodlights"],
    courtCount: 6,
    badge: "Verified",
    address: "SRP (South Road Properties), Cebu City 6000",
    fullDescription:
      "Cebu Pickle Arena is the largest dedicated pickleball facility in the Visayas region. With six full-size indoor courts, the arena hosts regular tournaments, clinics, and open play sessions. The venue features top-of-the-line cushioned court surfaces that reduce joint stress, making it ideal for players of all ages. A spacious viewing gallery, pro shop with equipment rentals, and modern shower facilities complete the experience.",
    operatingHours: "5:00 AM – 11:00 PM daily",
    courts: [
      { name: "Court 1", type: "Indoor" },
      { name: "Court 2", type: "Indoor" },
      { name: "Court 3", type: "Indoor" },
      { name: "Court 4", type: "Indoor" },
      { name: "Court 5", type: "Indoor" },
      { name: "Court 6", type: "Indoor" },
    ],
    rules: [
      "Court shoes mandatory",
      "No outside food on courts",
      "Paddle rentals available at the pro shop",
      "Tournament courts may have restricted access",
    ],
    cancellationPolicy: "Free cancellation up to 4 hours before your booking.",
    checkInTime: "Arrive 15 minutes before your slot",
    checkOutTime: "Sessions end on the hour",
    maxGuests: 4,
    locationDescription:
      "Situated along SRP (South Road Properties), one of Cebu's newest development areas. The venue is easily accessible from the main SRP highway with ample free parking.",
  },
  "smash-court-lahug": {
    slug: "smash-court-lahug",
    name: "Smash Court Lahug",
    area: "Lahug",
    description: "3 covered courts",
    pricePerHourCentavos: 30000,
    amenities: ["Covered", "Floodlights", "Parking"],
    courtCount: 3,
    badge: undefined,
    address: "Gov. M. Cuenco Ave., Lahug, Cebu City 6000",
    fullDescription:
      "Smash Court Lahug offers three covered outdoor courts perfect for those who enjoy playing in open air while staying protected from sun and rain. The courts feature professional floodlighting for evening play, and the covered design provides excellent ventilation. A popular choice among the Lahug pickleball community for casual games and friendly tournaments.",
    operatingHours: "6:00 AM – 9:00 PM daily",
    courts: [
      { name: "Court 1", type: "Covered" },
      { name: "Court 2", type: "Covered" },
      { name: "Court 3", type: "Covered" },
    ],
    rules: [
      "Court shoes required",
      "Bring your own paddle or rent on-site",
      "Water bottles only on court side",
    ],
    cancellationPolicy: "Free cancellation up to 1 hour before your booking.",
    checkInTime: "Arrive 5 minutes before your slot",
    checkOutTime: "Please clear the court on time",
    maxGuests: 4,
    locationDescription:
      "Located along Gov. M. Cuenco Avenue in Lahug, a central Cebu City neighborhood. Close to JY Square Mall and several restaurants. Street parking available.",
  },
  "net-rush-mandaue": {
    slug: "net-rush-mandaue",
    name: "Net Rush Mandaue",
    area: "Mandaue",
    description: "2 outdoor courts",
    pricePerHourCentavos: 28000,
    amenities: ["Outdoor", "Floodlights"],
    courtCount: 2,
    badge: undefined,
    address: "A.S. Fortuna St., Mandaue City 6014",
    fullDescription:
      "Net Rush Mandaue is an intimate outdoor pickleball venue with two courts, ideal for casual play and small group sessions. The outdoor setting offers a refreshing playing experience, especially during cooler mornings and evenings. Equipped with quality floodlights for night games, it's become a favorite spot for after-work pickleball sessions among Mandaue residents.",
    operatingHours: "6:00 AM – 9:00 PM daily",
    courts: [
      { name: "Court 1", type: "Outdoor" },
      { name: "Court 2", type: "Outdoor" },
    ],
    rules: [
      "Court shoes recommended",
      "Bring your own equipment",
      "No glass containers",
    ],
    cancellationPolicy: "Free cancellation up to 1 hour before your booking.",
    checkInTime: "Arrive on time",
    checkOutTime: "Please finish on time for the next group",
    maxGuests: 4,
    locationDescription:
      "Found along A.S. Fortuna Street in Mandaue City, a bustling commercial area with easy access from Cebu City. Multiple dining options nearby.",
  },
  "volley-hub-banilad": {
    slug: "volley-hub-banilad",
    name: "Volley Hub Banilad",
    area: "Banilad",
    description: "5 indoor courts",
    pricePerHourCentavos: 45000,
    amenities: ["Indoor", "Showers", "Pro Shop", "Parking"],
    courtCount: 5,
    badge: "Trending",
    address: "Gov. M. Cuenco Ave., Banilad, Cebu City 6000",
    fullDescription:
      "Volley Hub Banilad is a premium indoor sports facility featuring five pickleball courts with tournament-grade surfaces. The venue boasts excellent air conditioning, high ceilings, and professional lighting — creating an optimal playing environment. Their pro shop carries the latest paddles and gear, and experienced coaches are available for private lessons. The upscale lounge area makes it a great venue for corporate events and social play.",
    operatingHours: "6:00 AM – 10:00 PM daily",
    courts: [
      { name: "Court 1", type: "Indoor" },
      { name: "Court 2", type: "Indoor" },
      { name: "Court 3", type: "Indoor" },
      { name: "Court 4", type: "Indoor" },
      { name: "Court 5", type: "Indoor" },
    ],
    rules: [
      "Indoor court shoes required (non-marking soles)",
      "No food on courts",
      "Equipment rental available",
      "Coaching sessions by appointment only",
    ],
    cancellationPolicy: "Free cancellation up to 3 hours before your booking.",
    checkInTime: "Arrive 10 minutes early",
    checkOutTime: "Sessions end promptly at the booked time",
    maxGuests: 4,
    locationDescription:
      "Located in Banilad, one of Cebu's upscale residential and commercial areas. Near Country Mall and Banilad Town Centre. Dedicated parking lot available.",
  },
  "island-pickle-mactan": {
    slug: "island-pickle-mactan",
    name: "Island Pickle Mactan",
    area: "Mactan",
    description: "3 covered courts",
    pricePerHourCentavos: 32000,
    amenities: ["Outdoor", "Covered", "Parking"],
    courtCount: 3,
    badge: undefined,
    address: "Mactan Newtown, Lapu-Lapu City 6015",
    fullDescription:
      "Island Pickle Mactan brings pickleball to the resort island of Mactan. Three covered courts with ocean breeze ventilation offer a unique playing experience. The venue is popular with both locals and tourists staying at nearby resorts. The covered design protects from tropical sun and rain while maintaining the outdoor island atmosphere. Perfect for a morning game before hitting the beach.",
    operatingHours: "6:00 AM – 8:00 PM daily",
    courts: [
      { name: "Court 1", type: "Covered" },
      { name: "Court 2", type: "Covered" },
      { name: "Court 3", type: "Covered" },
    ],
    rules: [
      "Court shoes required",
      "Paddle rental available",
      "Sunscreen application off-court only",
      "Water stations provided",
    ],
    cancellationPolicy: "Free cancellation up to 2 hours before your booking.",
    checkInTime: "Arrive 5 minutes before your slot",
    checkOutTime: "Please vacate on time",
    maxGuests: 4,
    locationDescription:
      "Located in Mactan Newtown, Lapu-Lapu City — a modern township development on Mactan Island. Close to beaches, resorts, and the Mactan-Cebu International Airport.",
  },
};

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
