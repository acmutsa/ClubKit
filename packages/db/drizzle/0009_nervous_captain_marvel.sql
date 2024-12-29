ALTER TABLE "users" DROP CONSTRAINT "users_user_id_data_user_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "clerk_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_id_data_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."data"("user_id") ON DELETE cascade ON UPDATE no action;