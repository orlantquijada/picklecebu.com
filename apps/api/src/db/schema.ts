import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const courtOwners = sqliteTable("court_owners", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text().notNull().unique(),
  name: text().notNull(),
  passwordHash: text().notNull(),
  phone: text(),
  notifyOnBooking: integer({ mode: "boolean" }).default(true).notNull(),
  createdAt: text()
    .default(sql`(datetime('now'))`)
    .notNull(),
});

export const courts = sqliteTable("courts", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  ownerId: text()
    .notNull()
    .references(() => courtOwners.id),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  address: text().notNull(),
  locationArea: text().notNull(),
  amenities: text({ mode: "json" }).$type<string[]>().notNull().default([]),
  coverImageUrl: text(),
  galleryImageUrls: text({ mode: "json" }).$type<string[]>(),
  hourlyRate: integer().notNull(),
  isActive: integer({ mode: "boolean" }).default(true).notNull(),
  operatingHours: text(),
  cancellationPolicy: text(),
  rules: text({ mode: "json" }).$type<string[]>(),
  createdAt: text()
    .default(sql`(datetime('now'))`)
    .notNull(),
  updatedAt: text()
    .default(sql`(datetime('now'))`)
    .notNull(),
});

export const blockedSlots = sqliteTable(
  "blocked_slots",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    courtId: text()
      .notNull()
      .references(() => courts.id),
    slotDate: text().notNull(),
    slotHour: integer().notNull(),
    reason: text(),
    createdAt: text()
      .default(sql`(datetime('now'))`)
      .notNull(),
  },
  (t) => [
    index("blocked_court_date_idx").on(t.courtId, t.slotDate),
    uniqueIndex("unique_slot").on(t.courtId, t.slotDate, t.slotHour),
  ]
);

export const bookings = sqliteTable(
  "bookings",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    courtId: text()
      .notNull()
      .references(() => courts.id),
    bookingDate: text().notNull(),
    startHour: integer().notNull(),
    endHour: integer().notNull(),
    numHours: integer().notNull(),
    playerName: text().notNull(),
    playerEmail: text().notNull(),
    playerPhone: text().notNull(),
    subtotal: integer().notNull(),
    convenienceFee: integer().notNull().default(5000),
    totalAmount: integer().notNull(),
    status: text({ enum: ["pending", "confirmed", "failed", "cancelled"] })
      .notNull()
      .default("pending"),
    paymongoPaymentIntentId: text().unique(),
    paymongoPaymentId: text().unique(),
    createdAt: text()
      .default(sql`(datetime('now'))`)
      .notNull(),
    updatedAt: text()
      .default(sql`(datetime('now'))`)
      .notNull(),
  },
  (t) => [
    index("booking_court_date_idx").on(t.courtId, t.bookingDate),
    index("booking_status_idx").on(t.status),
  ]
);
