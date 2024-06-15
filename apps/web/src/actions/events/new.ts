"use server";

import { db } from "db";
import { customAlphabet } from "nanoid";
import { insertEventSchemaFormified } from "db/zod";
import { adminAction } from "@/lib/safe-action";
import { events, eventsToCategories } from "db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 6);

export const createEvent = adminAction(
	insertEventSchemaFormified,
	async ({ categories, ...e }) => {
		var res = {
			success: true,
			code: "success",
			eventID: "",
		};
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
				await tx.rollback();
				return;
			}

			const { eventID } = eventIDs[0];

			const vals = categories.map((cat) => ({
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
				await tx.rollback();
				return;
			}

			res.eventID = eventID;
		});

		return res;
	},
);
