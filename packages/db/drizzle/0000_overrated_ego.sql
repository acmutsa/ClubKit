CREATE TABLE `checkins` (
	`event_id` text(100) NOT NULL,
	`user_id` integer NOT NULL,
	`time` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`rating` integer,
	`admin_id` integer,
	`feedback` text(2000),
	PRIMARY KEY(`user_id`, `event_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `data` (
	`user_id` integer PRIMARY KEY NOT NULL,
	`major` text(255) NOT NULL,
	`classification` text(255) NOT NULL,
	`graduation_month` integer NOT NULL,
	`graduation_year` integer NOT NULL,
	`birthday` integer,
	`gender` text NOT NULL,
	`ethnicity` text NOT NULL,
	`resume` text(255),
	`shirt_type` text(255) NOT NULL,
	`shirt_size` text(255) NOT NULL,
	`interested_event_types` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `event_categories` (
	`id` text(8) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`color` text(255) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_categories_name_unique` ON `event_categories` (`name`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text(100) PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`description` text NOT NULL,
	`thumbnail_url` text(255) DEFAULT '/img/thumbnails/default.png' NOT NULL,
	`start` integer NOT NULL,
	`end` integer NOT NULL,
	`checkin_start` integer NOT NULL,
	`checkin_end` integer NOT NULL,
	`location` text(255) NOT NULL,
	`is_user_checkinable` integer DEFAULT true NOT NULL,
	`is_hidden` integer DEFAULT false NOT NULL,
	`points` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`semester_id` integer,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`semester_id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `events_to_categories` (
	`event_id` text(100) NOT NULL,
	`category_id` text(100) NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `event_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `semesters` (
	`semester_id` integer PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`points_required` integer NOT NULL,
	`is_current` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `semesters_name_unique` ON `semesters` (`name`);--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` integer PRIMARY KEY NOT NULL,
	`clerk_id` text(255),
	`first_name` text(255) NOT NULL,
	`last_name` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`join_date` integer DEFAULT (current_timestamp) NOT NULL,
	`university_id` text(255) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_clerk_id_unique` ON `users` (`clerk_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_university_id_unique` ON `users` (`university_id`);