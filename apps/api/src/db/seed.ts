import { Database } from "bun:sqlite";

import { hash } from "bcryptjs";
import { drizzle } from "drizzle-orm/bun-sqlite";

import { runMigrations } from "./migrate";
import * as schema from "./schema";

runMigrations();

const sqlite = new Database("./picklecebu.sqlite");
const db = drizzle(sqlite, { schema, casing: "snake_case" });

const seed = async () => {
  const passwordHash = await hash("password123", 12);
  const ownerId = "owner_test_01";

  await db
    .insert(schema.courtOwners)
    .values({
      email: "owner@test.com",
      id: ownerId,
      name: "Juan dela Cruz",
      notifyOnBooking: true,
      passwordHash,
      phone: "+639171234567",
    })
    .onConflictDoNothing();

  const courts = [
    {
      id: "court_baseline",
      slug: "baseline-pickle-club",
      name: "Baseline Pickle Club",
      address: "IT Park, Apas, Cebu City 6000",
      locationArea: "IT Park",
      description:
        "Baseline Pickle Club is Cebu's premier indoor pickleball facility, located in the heart of IT Park. Featuring four regulation-size indoor courts with professional-grade surfaces, air conditioning, and LED lighting.",
      hourlyRate: 35_000,
      amenities: ["Indoor", "Parking", "Pro Shop", "Showers"],
      operatingHours: "6:00 AM – 10:00 PM daily",
      cancellationPolicy: "Free cancellation up to 2 hours before your booking.",
      rules: [
        "Proper court shoes required",
        "No food or drinks on the court",
        "Maximum 4 players per court",
        "15-minute grace period for late arrivals",
      ],
      coverImageUrl: "https://picsum.photos/seed/court_baseline/800/600",
      galleryImageUrls: [
        "https://picsum.photos/seed/court_baseline-1/800/600",
        "https://picsum.photos/seed/court_baseline-2/800/600",
        "https://picsum.photos/seed/court_baseline-3/800/600",
      ],
    },
    {
      id: "court_cebu_pickle_arena",
      slug: "cebu-pickle-arena",
      name: "Cebu Pickle Arena",
      address: "SRP (South Road Properties), Cebu City 6000",
      locationArea: "SRP",
      description:
        "Cebu Pickle Arena is the largest dedicated pickleball facility in the Visayas region. With six full-size indoor courts, the arena hosts regular tournaments, clinics, and open play sessions.",
      hourlyRate: 40_000,
      amenities: ["Indoor", "Showers", "Parking", "Pro Shop", "Floodlights"],
      operatingHours: "5:00 AM – 11:00 PM daily",
      cancellationPolicy: "Free cancellation up to 4 hours before your booking.",
      rules: [
        "Court shoes mandatory",
        "No outside food on courts",
        "Paddle rentals available at the pro shop",
        "Tournament courts may have restricted access",
      ],
      coverImageUrl: "https://picsum.photos/seed/court_cebu_pickle_arena/800/600",
      galleryImageUrls: [
        "https://picsum.photos/seed/court_cebu_pickle_arena-1/800/600",
        "https://picsum.photos/seed/court_cebu_pickle_arena-2/800/600",
        "https://picsum.photos/seed/court_cebu_pickle_arena-3/800/600",
      ],
    },
    {
      id: "court_smash_lahug",
      slug: "smash-court-lahug",
      name: "Smash Court Lahug",
      address: "Gov. M. Cuenco Ave., Lahug, Cebu City 6000",
      locationArea: "Lahug",
      description:
        "Smash Court Lahug offers three covered outdoor courts perfect for those who enjoy playing in open air while staying protected from sun and rain.",
      hourlyRate: 30_000,
      amenities: ["Covered", "Floodlights", "Parking"],
      operatingHours: "6:00 AM – 9:00 PM daily",
      cancellationPolicy: "Free cancellation up to 1 hour before your booking.",
      rules: [
        "Court shoes required",
        "Bring your own paddle or rent on-site",
        "Water bottles only on court side",
      ],
      coverImageUrl: "https://picsum.photos/seed/court_smash_lahug/800/600",
      galleryImageUrls: [
        "https://picsum.photos/seed/court_smash_lahug-1/800/600",
        "https://picsum.photos/seed/court_smash_lahug-2/800/600",
        "https://picsum.photos/seed/court_smash_lahug-3/800/600",
      ],
    },
    {
      id: "court_net_rush",
      slug: "net-rush-mandaue",
      name: "Net Rush Mandaue",
      address: "A.S. Fortuna St., Mandaue City 6014",
      locationArea: "Mandaue",
      description:
        "Net Rush Mandaue is an intimate outdoor pickleball venue with two courts, ideal for casual play and small group sessions.",
      hourlyRate: 28_000,
      amenities: ["Outdoor", "Floodlights"],
      operatingHours: "6:00 AM – 9:00 PM daily",
      cancellationPolicy: "Free cancellation up to 1 hour before your booking.",
      rules: [
        "Court shoes recommended",
        "Bring your own equipment",
        "No glass containers",
      ],
      coverImageUrl: "https://picsum.photos/seed/court_net_rush/800/600",
      galleryImageUrls: [
        "https://picsum.photos/seed/court_net_rush-1/800/600",
        "https://picsum.photos/seed/court_net_rush-2/800/600",
        "https://picsum.photos/seed/court_net_rush-3/800/600",
      ],
    },
    {
      id: "court_volley_hub",
      slug: "volley-hub-banilad",
      name: "Volley Hub Banilad",
      address: "Gov. M. Cuenco Ave., Banilad, Cebu City 6000",
      locationArea: "Banilad",
      description:
        "Volley Hub Banilad is a premium indoor sports facility featuring five pickleball courts with tournament-grade surfaces.",
      hourlyRate: 45_000,
      amenities: ["Indoor", "Showers", "Pro Shop", "Parking"],
      operatingHours: "6:00 AM – 10:00 PM daily",
      cancellationPolicy: "Free cancellation up to 3 hours before your booking.",
      rules: [
        "Indoor court shoes required (non-marking soles)",
        "No food on courts",
        "Equipment rental available",
        "Coaching sessions by appointment only",
      ],
      coverImageUrl: "https://picsum.photos/seed/court_volley_hub/800/600",
      galleryImageUrls: [
        "https://picsum.photos/seed/court_volley_hub-1/800/600",
        "https://picsum.photos/seed/court_volley_hub-2/800/600",
        "https://picsum.photos/seed/court_volley_hub-3/800/600",
      ],
    },
    {
      id: "court_island_pickle",
      slug: "island-pickle-mactan",
      name: "Island Pickle Mactan",
      address: "Mactan Newtown, Lapu-Lapu City 6015",
      locationArea: "Mactan",
      description:
        "Island Pickle Mactan brings pickleball to the resort island of Mactan. Three covered courts with ocean breeze ventilation offer a unique playing experience.",
      hourlyRate: 32_000,
      amenities: ["Outdoor", "Covered", "Parking"],
      operatingHours: "6:00 AM – 8:00 PM daily",
      cancellationPolicy: "Free cancellation up to 2 hours before your booking.",
      rules: [
        "Court shoes required",
        "Paddle rental available",
        "Sunscreen application off-court only",
        "Water stations provided",
      ],
      coverImageUrl: "https://picsum.photos/seed/court_island_pickle/800/600",
      galleryImageUrls: [
        "https://picsum.photos/seed/court_island_pickle-1/800/600",
        "https://picsum.photos/seed/court_island_pickle-2/800/600",
        "https://picsum.photos/seed/court_island_pickle-3/800/600",
      ],
    },
  ];

  for (const court of courts) {
    await db
      .insert(schema.courts)
      .values({
        address: court.address,
        amenities: court.amenities,
        cancellationPolicy: court.cancellationPolicy,
        coverImageUrl: court.coverImageUrl,
        description: court.description,
        galleryImageUrls: court.galleryImageUrls,
        hourlyRate: court.hourlyRate,
        id: court.id,
        isActive: true,
        locationArea: court.locationArea,
        name: court.name,
        operatingHours: court.operatingHours,
        ownerId,
        rules: court.rules,
        slug: court.slug,
      })
      .onConflictDoNothing();
  }

  console.log("✅ Seed data inserted");
  sqlite.close();
};

await seed();
