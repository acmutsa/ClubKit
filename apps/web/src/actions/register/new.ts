"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { insertUserWithDataSchemaFormified } from "db/zod";
import { db } from "db";
import { eq, or, isNull } from "db/drizzle";
import { users, data } from "db/schema";
import { z } from "zod";

export const createRegistration = authenticatedAction(
	insertUserWithDataSchemaFormified,
	async (u, { clerkID }) => {
		const existingUser = await db
			.select()
			.from(users)
			.innerJoin(data, eq(users.userID, data.userID))
			.where(
				or(
					eq(users.email, u.email),
					eq(users.clerkID, clerkID),
					eq(data.universityID, u.data.universityID)
				)
			)
			.limit(1);

		if (existingUser.length > 0) {
			const foundUser = existingUser[0];
			if (foundUser.users.clerkID == clerkID) {
				return {
					success: false,
					code: "user_already_exists",
				};
			} else if (foundUser.users.email == u.email) {
				return {
					success: false,
					code: "email_already_exists",
				};
			} else if (foundUser.data.universityID == u.data.universityID) {
				return {
					success: false,
					code: "university_id_already_exists",
				};
			}
		}

		await db.insert(users).values({
			...u,
			clerkID: clerkID,
		});

		return {
			success: true,
			code: "success",
		};
	}
);
