import { Database } from "bun:sqlite";

import { hash } from "bcryptjs";
import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";

const sqlite = new Database("./picklecebu.sqlite");
const db = drizzle(sqlite, { schema });

const seed = async () => {
  const passwordHash = await hash("password123", 12);
  const ownerId = "owner_test_01";
  const courtId = "court_test_01";

  // Insert owner
  await db
    .insert(schema.courtOwners)
    .values({
      email: "owner@test.com",
      id: ownerId,
      name: "Juan dela Cruz",
      notifyOnBooking: 1,
      passwordHash,
      phone: "+639171234567",
    })
    .onConflictDoNothing();

  // Insert court
  await db
    .insert(schema.courts)
    .values({
      address: "SM Seaside City Cebu, SRP, Cebu City",
      amenities: JSON.stringify([
        "Air Conditioning",
        "Locker Rooms",
        "Parking",
        "Pro Shop",
        "Viewing Gallery",
      ]),
      coverImageUrl: null,
      description:
        "Professional indoor pickleball court at SM Seaside City Cebu. Air-conditioned with pro-grade surface.",
      // ₱500/hour in centavos
      hourlyRate: 50_000,
      id: courtId,
      isActive: 1,
      locationArea: "Cebu City",
      name: "SM Seaside Pickleball Court",
      ownerId,
      slug: "sm-seaside",
    })
    .onConflictDoNothing();

  // Insert second court
  await db
    .insert(schema.courts)
    .values({
      address: "Ayala Center Cebu, Archbishop Reyes Ave, Cebu City",
      amenities: JSON.stringify([
        "Covered Court",
        "Parking",
        "Restrooms",
        "Equipment Rental",
      ]),
      coverImageUrl: null,
      description:
        "Outdoor covered pickleball courts at Ayala Center Cebu. Perfect for evening games.",
      // ₱400/hour
      hourlyRate: 40_000,
      id: "court_test_02",
      isActive: 1,
      locationArea: "Cebu City",
      name: "Ayala Center Cebu Courts",
      ownerId,
      slug: "ayala-center",
    })
    .onConflictDoNothing();

  console.log("✅ Seed data inserted");
  sqlite.close();
};

await seed();
