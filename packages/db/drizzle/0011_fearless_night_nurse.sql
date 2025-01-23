CREATE TYPE "public"."user_roles" AS ENUM('member', 'admin', 'super_admin');--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_roles" DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "data" RENAME COLUMN "short_id" TO "university_id";--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "thumbnail_Url" TO "thumbnail_url";--> statement-breakpoint
ALTER TABLE "data" DROP CONSTRAINT "data_short_id_unique";--> statement-breakpoint
ALTER TABLE "checkins" DROP CONSTRAINT "checkins_event_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "checkins" ALTER COLUMN "event_id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "checkins" ALTER COLUMN "feedback" SET DATA TYPE varchar(2000);--> statement-breakpoint
ALTER TABLE "data" ALTER COLUMN "major" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "data" ALTER COLUMN "classification" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "data" ALTER COLUMN "gender" SET DATA TYPE varchar(255)[];--> statement-breakpoint
ALTER TABLE "data" ALTER COLUMN "ethnicity" SET DATA TYPE varchar(255)[];--> statement-breakpoint
ALTER TABLE "data" ALTER COLUMN "resume" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "data" ALTER COLUMN "shirt_type" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "data" ALTER COLUMN "shirt_size" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "data" ALTER COLUMN "interested_event_types" SET DATA TYPE varchar(255)[];--> statement-breakpoint
ALTER TABLE "event_categories" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "event_categories" ALTER COLUMN "color" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "location" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "events_to_categories" ALTER COLUMN "event_id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "events_to_categories" ALTER COLUMN "category_id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "first_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE user_roles;--> statement-breakpoint
ALTER TABLE "data" ADD CONSTRAINT "data_university_id_unique" UNIQUE("university_id");