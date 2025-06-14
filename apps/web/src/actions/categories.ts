"use server";
import { adminAction } from "@/lib/safe-action";
import { db, eq } from "db";
import {
	createEventCategorySchema,
	eventCategorySchema,
	editEventCategorySchema,
} from "db/zod";
import { DatabseError} from "db/types"
import { customAlphabet } from "nanoid";
import { LOWER_ALPHANUM_CUSTOM_ALPHABET } from "@/lib/constants";
import c from "config";
import { revalidatePath } from "next/cache";
import { eventCategories } from "db/schema";
import z from "zod";
import { del } from "@/lib/server/file-upload";
import { getEventWithCategoryThumbnail } from "@/lib/queries/categories";

const deleteEventCategorySchema = z.object({
	categoryID: z.string().length(c.events.categoryIDLength),
	thumbnailUrl: z.string().optional(),
});

const nanoid = customAlphabet(
	LOWER_ALPHANUM_CUSTOM_ALPHABET,
	c.events.categoryIDLength,
);

export const createEventCategory = adminAction
	.schema(createEventCategorySchema)
	.action(async ({ parsedInput }) => {
		try {
			await db.insert(eventCategories).values({
				...parsedInput,
				id: nanoid(),
			});
		} catch (e) {
			if (e instanceof DatabseError) {
				return {
					success: false,
					message: "category_exists",
				};
			}
			throw e;
		}
		// revalidatePath("/admin/categories");
		return {
			success: true,
			message: "category_created",
		};
	});

// come back and change them all
export const updateEventCategory = adminAction
	.schema(editEventCategorySchema)
	.action(async ({ parsedInput }) => {
		const { id: categoryID, oldThumbnailUrl, ...inputs } = parsedInput;
		try {
			await db
				.update(eventCategories)
				.set(inputs)
				.where(eq(eventCategories.id, categoryID));
			if (
				oldThumbnailUrl &&
				inputs.thumbnailUrl !== oldThumbnailUrl &&
				oldThumbnailUrl !== c.thumbnails.default
				&& !(await getEventWithCategoryThumbnail(oldThumbnailUrl))
			) {
				const deleteResult = await del(oldThumbnailUrl);
				if (!deleteResult) {
					console.log(
						"Failed to delete old thumbnail",
						oldThumbnailUrl,
					);
				}
			}
		} catch (e) {
			if (e instanceof DatabseError) {
				return {
					success: false,
					message: "category_exists",
				};
			}
			throw e;
		}
		// revalidatePath("/admin/categories");
		return {
			success: true,
			message: "category_updated",
		};
	});

export const deleteEventCategory = adminAction
	.schema(deleteEventCategorySchema)
	.action(async ({ parsedInput }) => {
		const { categoryID, thumbnailUrl } = parsedInput;
		if (thumbnailUrl && thumbnailUrl !== c.thumbnails.default && !(await getEventWithCategoryThumbnail(thumbnailUrl))) {
			const deleteResult = await del(thumbnailUrl);
			if (!deleteResult) {
				console.log("Failed to delete thumbnail", thumbnailUrl);
			}
		}
		await db
			.delete(eventCategories)
			.where(eq(eventCategories.id, categoryID));
		// revalidatePath("/admin/categories");
		return {
			success: true,
			message: "category_deleted",
		};
	});
