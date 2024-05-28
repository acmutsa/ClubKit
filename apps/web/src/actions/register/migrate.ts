"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { and, eq, isNull } from "db/drizzle";
import { users, data } from "db/schema";

export const doPortalLookupCheck = authenticatedAction(
	z.object({ universityID: z.string().min(1), email: z.string().min(1) }),
	async ({ universityID, email }) => {
		// const lookup = await db
		// 	.select()
		// 	.from(users)
		// 	.innerJoin(data, eq(users.userID, data.userID))
		// 	.where(
		// 		and(
		// 			eq(users.email, email),
		// 			isNull(users.clerkID),
		// 			eq(data.interestedEventTypes, universityID)
		// 		)
		// 	);

		const lookup = await db
			.select()
			.from(users)
			.innerJoin(data, eq(users.userID, data.userID))
			.where(
				and(
					eq(users.email, email),
					isNull(users.clerkID),
					eq(data.universityID, universityID),
				),
			)
			.limit(1);

		if (lookup[0]) {
			return {
				success: true,
				name:
					lookup[0].users.firstName + " " + lookup[0].users.lastName,
			};
		} else {
			return {
				success: false,
				name: null,
			};
		}
	},
);

export const doPortalLink = authenticatedAction(
	z.object({ universityID: z.string().min(1), email: z.string().min(1) }),
	async ({ universityID, email }, { clerkID }) => {
		const lookup = await db
			.select()
			.from(users)
			.innerJoin(data, eq(users.userID, data.userID))
			.where(
				and(
					eq(users.email, email),
					isNull(users.clerkID),
					eq(data.universityID, universityID),
				),
			)
			.limit(1);

		if (lookup[0]) {
			await db
				.update(users)
				.set({ clerkID: clerkID })
				.where(eq(users.userID, lookup[0].users.userID));
			return {
				success: true,
			};
		} else {
			return {
				success: false,
			};
		}
	},
);
