import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const courtOwners = sqliteTable("court_owners", {
  createdAt: text("created_at")
    .default(sql`datetime('now')`)
    .notNull(),
  email: text("email").notNull().unique(),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => sql`lower(hex(randomblob(8)))` as unknown as string),
  name: text("name").notNull(),
  notifyOnBooking: integer("notify_on_booking").default(1).notNull(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
});

export const courts = sqliteTable("courts", {
  address: text("address").notNull(),
  amenities: text("amenities").notNull().default("[]"),
  coverImageUrl: text("cover_image_url"),
  createdAt: text("created_at")
    .default(sql`datetime('now')`)
    .notNull(),
  description: text("description"),
  hourlyRate: integer("hourly_rate").notNull(),
  id: text("id").primaryKey(),
  isActive: integer("is_active").default(1).notNull(),
  locationArea: text("location_area").notNull(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => courtOwners.id),
  slug: text("slug").notNull().unique(),
  updatedAt: text("updated_at")
    .default(sql`datetime('now')`)
    .notNull(),
});

export const blockedSlots = sqliteTable(
  "blocked_slots",
  {
    courtId: text("court_id")
      .notNull()
      .references(() => courts.id),
    createdAt: text("created_at")
      .default(sql`datetime('now')`)
      .notNull(),
    id: text("id").primaryKey(),
    reason: text("reason"),
    slotDate: text("slot_date").notNull(),
    slotHour: integer("slot_hour").notNull(),
  },
  (t) => ({
    courtDateIdx: index("blocked_court_date_idx").on(t.courtId, t.slotDate),
    uniqueSlot: uniqueIndex("unique_slot").on(
      t.courtId,
      t.slotDate,
      t.slotHour
    ),
  })
);

export const bookings = sqliteTable(
  "bookings",
  {
    bookingDate: text("booking_date").notNull(),
    convenienceFee: integer("convenience_fee").notNull().default(5000),
    courtId: text("court_id")
      .notNull()
      .references(() => courts.id),
    createdAt: text("created_at")
      .default(sql`datetime('now')`)
      .notNull(),
    endHour: integer("end_hour").notNull(),
    id: text("id").primaryKey(),
    numHours: integer("num_hours").notNull(),
    paymongoPaymentId: text("paymongo_payment_id").unique(),
    paymongoPaymentIntentId: text("paymongo_payment_intent_id").unique(),
    playerEmail: text("player_email").notNull(),
    playerName: text("player_name").notNull(),
    playerPhone: text("player_phone").notNull(),
    startHour: integer("start_hour").notNull(),
    status: text("status", {
      enum: ["pending", "confirmed", "failed", "cancelled"],
    })
      .notNull()
      .default("pending"),
    subtotal: integer("subtotal").notNull(),
    totalAmount: integer("total_amount").notNull(),
    updatedAt: text("updated_at")
      .default(sql`datetime('now')`)
      .notNull(),
  },
  (t) => ({
    courtDateIdx: index("booking_court_date_idx").on(t.courtId, t.bookingDate),
    statusIdx: index("booking_status_idx").on(t.status),
  })
);
