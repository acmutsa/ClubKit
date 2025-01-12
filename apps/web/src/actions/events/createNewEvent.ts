"use server";

import { db } from "db";
import { customAlphabet } from "nanoid";
import { insertEventSchemaFormified } from "db/zod";
import { adminAction } from "@/lib/safe-action";
import { events, eventsToCategories } from "db/schema";
import c from "config";
import { revalidatePath } from "next/cache";

const nanoid = customAlphabet(
	"1234567890abcdefghijklmnopqrstuvwxyz",
	c.events.idLength,
);

export const createEvent = adminAction
	.schema(insertEventSchemaFormified)
	.action(async ({ parsedInput }) => {
		let res = {
			success: true,
			code: "success",
			eventID: "",
		};
		const { categories, ...e } = parsedInput;
		await db.transaction(async (tx) => {
			const eventIDs = await tx
				.insert(events)
				.values({ ...e, id: nanoid() })
				.returning({ eventID: events.id });

			if (eventIDs.length === 0) {
				res = {
					success: false,
					code: "insert_event_failed",
					eventID: "",
				};
				tx.rollback();
				return;
			}

			const { eventID } = eventIDs[0];

			const vals = categories.map((cat: string) => ({
				eventID,
				categoryID: cat,
			}));

			const events_to_categories = await tx
				.insert(eventsToCategories)
				.values(vals)
				.returning();

			if (events_to_categories.length === 0) {
				res = {
					success: false,
					code: "events_to_categories_failed",
					eventID: "",
				};
				tx.rollback();
				return;
			}

			res.eventID = eventID;
		});
		revalidatePath("/admin/events");
		revalidatePath("/events");

		return res;
	});
