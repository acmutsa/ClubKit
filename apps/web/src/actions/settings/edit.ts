"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { db, eq } from "db";
import { data, users } from "db/schema";
import { revalidateTag } from "next/cache";
import { del } from "@vercel/blob"
import {
	editAccountSettingsSchema,
	editAcademicSettingsSchema,
	editClubSettingsSchema,
	editResumeActionSchema
} from "@/validators/settings";

export const editAccountSettings = authenticatedAction
	.schema(editAccountSettingsSchema)
	.action(
		async ({
			parsedInput: { firstName, lastName, ethnicity, gender, birthday },
			ctx: { userId: clerkID },
		}) => {
			try {
				await db.transaction(async (tx) => {
					const userID = await tx
						.update(users)
						.set({ firstName, lastName })
						.where(eq(users.clerkID, clerkID))
						.returning({ id: users.userID })
						.then((data) => data[0].id);

					await tx
						.update(data)
						.set({ ethnicity, gender, birthday })
						.where(eq(data.userID, userID));
				});
			} catch (error) {
				console.error(error);
				return {
					success: false,
					error: "Failed to save account settings",
				};
			}

			revalidateTag("userSettings");
			return { success: true };
		},
	);

export const editAcademicSettings = authenticatedAction
	.schema(editAcademicSettingsSchema)
	.action(
		async ({
			parsedInput: {
				major,
				classification,
				graduationYear,
				graduationMonth,
			},
			ctx: { userId: clerkID },
		}) => {
			try {
				await db
					.update(data)
					.set({
						major,
						classification,
						graduationYear,
						graduationMonth,
					})
					.from(users)
					.where(eq(users.clerkID, clerkID));
			} catch (error) {
				console.error(error);
				return {
					success: false,
					error: "Failed to save academic settings",
				};
			}

			revalidateTag("userSettings");
			return { success: true };
		},
	);

export const editResumeUrl = authenticatedAction
	.schema(editResumeActionSchema)
	.action(async ({
		ctx: { userId: clerkID },
		parsedInput: { resume, oldResume }
	}) => {
		try {
			await db
				.update(data)
				.set({ resume })
				.from(users)
				.where(eq(users.clerkID, clerkID));

			if (oldResume) await del(oldResume);

			revalidateTag("userSettings");
			return { success: true };
		} catch (error) { // Failed to update user data to new resume.  Delete the new resume from the blob and make the user try again.
			console.error(error);
			await del(resume);
			return { success: false, error: "Failed to finalize resume upload." };
		}
	});

export const editClubSettings = authenticatedAction
	.schema(editClubSettingsSchema)
	.action(async ({
		ctx: { userId: clerkID },
		parsedInput: { shirtSize, shirtType }
	}) => {
		try {
			await db
				.update(data)
				.set({ shirtSize, shirtType })
				.from(users)
				.where(eq(users.clerkID, clerkID));
		} catch (error) {
			console.error(error);
			return {
				success: false,
				error: "Failed to update user settings",
			};
		}

		revalidateTag("userSettings");
		return { success: true };
	});
