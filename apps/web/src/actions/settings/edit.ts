"use server";

import { userAction } from "@/lib/safe-action";
import { db, eq } from "db";
import { data, users } from "db/schema";
import { revalidatePath } from "next/cache";
import { del } from "@/lib/server/file-upload";
import {
	editAccountSettingsSchema,
	editAcademicSettingsSchema,
	editClubSettingsSchema,
	editResumeActionSchema,
} from "@/validators/settings";

export const editAccountSettings = userAction
	.schema(editAccountSettingsSchema)
	.action(
		async ({
			parsedInput: { firstName, lastName, ethnicity, gender, birthday },
			ctx: { userID, clerkID },
		}) => {
			try {
				await db.transaction(async (tx) => {
					await tx
						.update(users)
						.set({ firstName, lastName })
						.where(eq(users.clerkID, clerkID));

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

			// revalidatePath("/settings");
			return { success: true };
		},
	);

export const editAcademicSettings = userAction
	.schema(editAcademicSettingsSchema)
	.action(
		async ({
			parsedInput: {
				major,
				classification,
				graduationYear,
				graduationMonth,
			},
			ctx: { userID },
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
					.where(eq(data.userID, userID));
			} catch (error) {
				console.error(error);
				return {
					success: false,
					error: "Failed to save academic settings",
				};
			}

			// revalidatePath("/settings");
			return { success: true };
		},
	);

export const editResumeUrl = userAction
	.schema(editResumeActionSchema)
	.action(async ({ ctx: { userID }, parsedInput: { resume, oldResume } }) => {
		try {
			await db
				.update(data)
				.set({ resume })
				.where(eq(data.userID, userID));

			if (oldResume) await del(oldResume);

			// revalidatePath("/settings");
			return { success: true };
		} catch (error) {
			// Failed to update user data to new resume.  Delete the new resume from the blob and make the user try again.
			console.error(error);
			await del(resume);
			return {
				success: false,
				error: "Failed to finalize resume upload.",
			};
		}
	});

export const editClubSettings = userAction
	.schema(editClubSettingsSchema)
	.action(
		async ({ ctx: { userID }, parsedInput: { shirtSize, shirtType } }) => {
			try {
				await db
					.update(data)
					.set({ shirtSize, shirtType })
					.where(eq(data.userID, userID));
			} catch (error) {
				console.error(error);
				return {
					success: false,
					error: "Failed to update user settings",
				};
			}

			// revalidatePath("/settings");
			return { success: true };
		},
	);
