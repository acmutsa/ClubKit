ALTER TABLE "users" ADD COLUMN "university_id" varchar(255);--> statement-breakpoint
UPDATE "users" SET "university_id" = (SELECT "university_id" FROM "data" WHERE "data"."user_id" = "users"."user_id");--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "university_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "data" DROP CONSTRAINT "data_university_id_unique";--> statement-breakpoint
ALTER TABLE "data" DROP COLUMN "university_id";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_university_id_unique" UNIQUE("university_id");