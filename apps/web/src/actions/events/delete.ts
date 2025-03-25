"use server";
import { adminAction } from "@/lib/safe-action";
import { db, eq } from "db";
import { deleteEventSchema } from "db/zod";
import { events } from "db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const deleteEventAction = adminAction
	.schema(deleteEventSchema)
	.action(async ({ parsedInput: id }) => {
		await db.delete(events).where(eq(events.id, id));
		// redirect("/admin/events");
	});
