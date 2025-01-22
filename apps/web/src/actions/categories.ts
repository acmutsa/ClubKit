"use server";
import { adminAction } from "@/lib/safe-action";
import { db, eq } from "db";
import { createEventCategorySchema, eventCategorySchema } from "db/zod";
import { customAlphabet } from "nanoid";
import { LOWER_ALPHANUM_CUSTOM_ALPHABET } from "@/lib/constants";
import c from "config";
import { revalidatePath } from "next/cache";
import { eventCategories } from "db/schema";
import { UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE } from "@/lib/constants";
import z from "zod";

const deleteEventCategorySchema = z.string().length(c.events.categoryIDLength);

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
			///@ts-expect-error could not find the type of the error and the status code is the next most accurate way of telling an issue
			if (e.code === UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE) {
				return {
					success: false,
					message: "category_exists",
				};
			}
			throw e;
		}
		revalidatePath("/admin/categories");
		return {
			success: true,
			message: "category_created",
		};
	});

export const updateEventCategory = adminAction
	.schema(eventCategorySchema)
	.action(async ({ parsedInput }) => {
		const { id: categoryID, ...inputs } = parsedInput;
		try {
			await db
				.update(eventCategories)
				.set(inputs)
				.where(eq(eventCategories.id, categoryID));
		} catch (e) {
			///@ts-expect-error could not find the type of the error and the status code is the next most accurate way of telling an issue
			if (e.code === UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE) {
				return {
					success: false,
					message: "category_exists",
				};
			}
			throw e;
		}
		revalidatePath("/admin/categories");
		return {
			success: true,
			message: "category_updated",
		};
	});

export const deleteEventCategory = adminAction
	.schema(deleteEventCategorySchema)
	.action(async ({ parsedInput: categoryID }) => {
		await db
			.delete(eventCategories)
			.where(eq(eventCategories.id, categoryID));
		revalidatePath("/admin/categories");
		return {
			success: true,
			message: "category_deleted",
		};
	});
