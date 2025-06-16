CREATE TABLE `thumbnails` (
	`thumbnail_id` integer PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`uploaded_at` integer DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `thumbnails_url_unique` ON `thumbnails` (`url`);--> statement-breakpoint
ALTER TABLE `event_categories` DROP COLUMN `thumnail_url`;