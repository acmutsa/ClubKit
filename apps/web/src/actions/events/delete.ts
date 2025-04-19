"use server";
import { adminAction } from "@/lib/safe-action";
import { db, eq } from "db";
import { deleteEventSchema } from "db/zod";
import { events } from "db/schema";
import { del } from "@/lib/server/file-upload";
import c from "config";

export const deleteEventAction = adminAction
	.schema(deleteEventSchema)
	.action(async ({ parsedInput }) => {
		const { id, thumbnailUrl } = parsedInput;
		if (thumbnailUrl !== c.thumbnails.default) {
			const res = await del(thumbnailUrl);
			if (!res) {
				console.log("Failed to delete thumbnail");
			}
		}
		await db.delete(events).where(eq(events.id, id));
		// redirect("/admin/events");
	});
