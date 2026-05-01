CREATE TABLE `blocked_slots` (
	`court_id` text NOT NULL,
	`created_at` text DEFAULT datetime('now') NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`reason` text,
	`slot_date` text NOT NULL,
	`slot_hour` integer NOT NULL,
	FOREIGN KEY (`court_id`) REFERENCES `courts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `blocked_court_date_idx` ON `blocked_slots` (`court_id`,`slot_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_slot` ON `blocked_slots` (`court_id`,`slot_date`,`slot_hour`);--> statement-breakpoint
CREATE TABLE `bookings` (
	`booking_date` text NOT NULL,
	`convenience_fee` integer DEFAULT 5000 NOT NULL,
	`court_id` text NOT NULL,
	`created_at` text DEFAULT datetime('now') NOT NULL,
	`end_hour` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`num_hours` integer NOT NULL,
	`paymongo_payment_id` text,
	`paymongo_payment_intent_id` text,
	`player_email` text NOT NULL,
	`player_name` text NOT NULL,
	`player_phone` text NOT NULL,
	`start_hour` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`subtotal` integer NOT NULL,
	`total_amount` integer NOT NULL,
	`updated_at` text DEFAULT datetime('now') NOT NULL,
	FOREIGN KEY (`court_id`) REFERENCES `courts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_paymongo_payment_id_unique` ON `bookings` (`paymongo_payment_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_paymongo_payment_intent_id_unique` ON `bookings` (`paymongo_payment_intent_id`);--> statement-breakpoint
CREATE INDEX `booking_court_date_idx` ON `bookings` (`court_id`,`booking_date`);--> statement-breakpoint
CREATE INDEX `booking_status_idx` ON `bookings` (`status`);--> statement-breakpoint
CREATE TABLE `court_owners` (
	`created_at` text DEFAULT datetime('now') NOT NULL,
	`email` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`notify_on_booking` integer DEFAULT 1 NOT NULL,
	`password_hash` text NOT NULL,
	`phone` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `court_owners_email_unique` ON `court_owners` (`email`);--> statement-breakpoint
CREATE TABLE `courts` (
	`address` text NOT NULL,
	`amenities` text DEFAULT '[]' NOT NULL,
	`cover_image_url` text,
	`created_at` text DEFAULT datetime('now') NOT NULL,
	`description` text,
	`hourly_rate` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`location_area` text NOT NULL,
	`name` text NOT NULL,
	`owner_id` text NOT NULL,
	`slug` text NOT NULL,
	`gallery_image_urls` text,
	`operating_hours` text,
	`cancellation_policy` text,
	`rules` text,
	`updated_at` text DEFAULT datetime('now') NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `court_owners`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courts_slug_unique` ON `courts` (`slug`);