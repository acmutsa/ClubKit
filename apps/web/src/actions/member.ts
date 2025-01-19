"use server";
import { executiveAction } from "@/lib/safe-action";
import z from "zod";
import { db, eq } from "db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { users } from "db/schema";
import c from "config";

export const updateMemberRole = executiveAction
	.schema(
		z.object({
			userID: z.number().positive(),
			role: z.enum(c.memberRoles),
		}),
	)
	.action(async ({ parsedInput }) => {
		const link = headers().get("referer") ?? "";
		const { userID, role } = parsedInput;
		await db
			.update(users)
			.set({
				role,
			})
			.where(eq(users.userID, userID));

		// check if we need to do this
		revalidatePath(link);

		return {
			success: true,
		};
	});
