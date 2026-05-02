CREATE TABLE `blocked_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`court_id` text NOT NULL,
	`slot_date` text NOT NULL,
	`slot_hour` integer NOT NULL,
	`reason` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`court_id`) REFERENCES `courts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `blocked_court_date_idx` ON `blocked_slots` (`court_id`,`slot_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_slot` ON `blocked_slots` (`court_id`,`slot_date`,`slot_hour`);--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`court_id` text NOT NULL,
	`booking_date` text NOT NULL,
	`start_hour` integer NOT NULL,
	`end_hour` integer NOT NULL,
	`num_hours` integer NOT NULL,
	`player_name` text NOT NULL,
	`player_email` text NOT NULL,
	`player_phone` text NOT NULL,
	`subtotal` integer NOT NULL,
	`convenience_fee` integer DEFAULT 5000 NOT NULL,
	`total_amount` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`paymongo_payment_intent_id` text,
	`paymongo_payment_id` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`court_id`) REFERENCES `courts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_paymongoPaymentIntentId_unique` ON `bookings` (`paymongo_payment_intent_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_paymongoPaymentId_unique` ON `bookings` (`paymongo_payment_id`);--> statement-breakpoint
CREATE INDEX `booking_court_date_idx` ON `bookings` (`court_id`,`booking_date`);--> statement-breakpoint
CREATE INDEX `booking_status_idx` ON `bookings` (`status`);--> statement-breakpoint
CREATE TABLE `court_owners` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`phone` text,
	`notify_on_booking` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `court_owners_email_unique` ON `court_owners` (`email`);--> statement-breakpoint
CREATE TABLE `courts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`address` text NOT NULL,
	`location_area` text NOT NULL,
	`amenities` text DEFAULT '[]' NOT NULL,
	`cover_image_url` text,
	`gallery_image_urls` text,
	`hourly_rate` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`operating_hours` text,
	`cancellation_policy` text,
	`rules` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `court_owners`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courts_slug_unique` ON `courts` (`slug`);