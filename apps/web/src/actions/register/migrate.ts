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
					eq(data.universityID, universityID)
				)
			)
			.limit(1);

		if (lookup[0]) {
			console.log("Found user in without clerk", lookup);
			return {
				success: true,
				data: lookup[0].users.firstName,
			};
		} else {
			console.log("No user found in without clerk");
			return {
				success: false,
				data: null,
			};
		}
	}
);
