"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { insertUserWithDataSchemaFormified } from "db/zod";
import { db } from "db";
import { eq, or } from "db/drizzle";
import { users, data } from "db/schema";
import type { UserWithDataSchemaType } from "db/types";

export const createRegistration = authenticatedAction
	.schema(insertUserWithDataSchemaFormified)
	.action(async ({ parsedInput: registerFormInputs, ctx: { clerkID } }) => {
		const { data: dataSchemaInputs, ...usersSchemaInputs } =
			registerFormInputs;
		// I think we can stll do db.query on this
		const existingUser = await db
			.select()
			.from(users)
			.innerJoin(data, eq(users.userID, data.userID))
			.where(
				or(
					eq(users.email, registerFormInputs.email),
					eq(users.clerkID, clerkID),
					eq(data.universityID, registerFormInputs.data.universityID),
				),
			)
			.limit(1);

		if (existingUser.length > 0) {
			const foundUser = existingUser[0];
			if (foundUser.users.clerkID == clerkID) {
				return {
					success: false,
					code: "user_already_exists",
				};
			} else if (foundUser.users.email == registerFormInputs.email) {
				return {
					success: false,
					code: "email_already_exists",
				};
			} else if (
				foundUser.data.universityID ==
				registerFormInputs.data.universityID
			) {
				return {
					success: false,
					code: "university_id_already_exists",
				};
			}
		}

		await db.transaction(async (tx) => {
			const res = await tx
				.insert(users)
				.values({
					...usersSchemaInputs,
					clerkID: clerkID,
				})
				.returning({ userID: users.userID });
			const userID = res[0].userID;
			await tx.insert(data).values({
				...dataSchemaInputs,
				userID,
				// this is a placeholder for now. This isn't super important
				interestedEventTypes: [],
			});
		});

		return {
			success: true,
			code: "success",
		};
	});
