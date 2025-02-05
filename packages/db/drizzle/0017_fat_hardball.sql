CREATE TABLE "semesters" (
	"semester_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"points_required" integer NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	CONSTRAINT "semesters_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "semester_id" integer;