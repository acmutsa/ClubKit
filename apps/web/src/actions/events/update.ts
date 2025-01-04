"use server";

import { and, db, eq, inArray, sql } from "db";
import { updateEventSchema } from "db/zod";
import { adminAction } from "@/lib/safe-action";
import { events, eventsToCategories } from "db/schema";

export const updateEvent = adminAction
	.schema(updateEventSchema)
	.action(async ({ parsedInput }) => {
		let res = {
			success: true,
			code: "success",
		};
		const { eventID, oldCategories, categories, ...e } = parsedInput;
		await db.transaction(async (tx) => {
			const ids = await tx
				.update(events)
				.set({ ...e, updatedAt: sql`NOW()` })
				.where(eq(events.id, eventID))
				.returning({ eventID: events.id });

			if (ids.length === 0) {
				res = {
					success: false,
					code: "update_event_failed",
				};
				tx.rollback();
			}

			//find new categories
			const newCategories: string[] = categories.filter(
				(item: string) => !oldCategories.includes(item),
			);

			//find deleting categories
			const deletingCategories: string[] = oldCategories.filter(
				(item: string) => !categories.includes(item),
			);

			const insertVal = newCategories.map((cat) => ({
				eventID,
				categoryID: cat,
			}));

			if (insertVal.length !== 0) {
				await tx.insert(eventsToCategories).values(insertVal);
			}

			await tx
				.delete(eventsToCategories)
				.where(
					and(
						inArray(
							eventsToCategories.categoryID,
							deletingCategories,
						),
						eq(eventsToCategories.eventID, eventID),
					),
				);
		});

		await db.execute(sql`VACUUM events_to_categories`);

		return res;
	});
