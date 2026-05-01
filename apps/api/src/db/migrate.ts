import { Database } from "bun:sqlite";

import { env } from "../env";

export const runMigrations = () => {
  const sqlite = new Database(env.DATABASE_URL);

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS court_owners (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      phone TEXT,
      notify_on_booking INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS courts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      address TEXT NOT NULL,
      location_area TEXT NOT NULL,
      amenities TEXT NOT NULL DEFAULT '[]',
      cover_image_url TEXT,
      hourly_rate INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      owner_id TEXT NOT NULL REFERENCES court_owners(id),
      gallery_image_urls TEXT,
      operating_hours TEXT,
      cancellation_policy TEXT,
      rules TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS blocked_slots (
      id TEXT PRIMARY KEY,
      court_id TEXT NOT NULL REFERENCES courts(id),
      slot_date TEXT NOT NULL,
      slot_hour INTEGER NOT NULL,
      reason TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(court_id, slot_date, slot_hour)
    )
  `);

  sqlite.run(`
    CREATE INDEX IF NOT EXISTS blocked_court_date_idx ON blocked_slots(court_id, slot_date)
  `);

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      court_id TEXT NOT NULL REFERENCES courts(id),
      booking_date TEXT NOT NULL,
      start_hour INTEGER NOT NULL,
      end_hour INTEGER NOT NULL,
      num_hours INTEGER NOT NULL,
      player_name TEXT NOT NULL,
      player_email TEXT NOT NULL,
      player_phone TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      convenience_fee INTEGER NOT NULL DEFAULT 5000,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','failed','cancelled')),
      paymongo_payment_intent_id TEXT UNIQUE,
      paymongo_payment_id TEXT UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  sqlite.run(`
    CREATE INDEX IF NOT EXISTS booking_court_date_idx ON bookings(court_id, booking_date)
  `);
  sqlite.run(`
    CREATE INDEX IF NOT EXISTS booking_status_idx ON bookings(status)
  `);

  sqlite.close();
};
