"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { and, eq, isNull } from "db/drizzle";
import { users, data } from "db/schema";
import { currentUser } from "@clerk/nextjs/server";
import c from "config";

export const doPortalLookupCheck = authenticatedAction
	.schema(
		z.object({ universityID: z.string().min(1), email: z.string().min(1) }),
	)
	.action(async ({ parsedInput: { email, universityID } }) => {
		const lookup = await db
			.select()
			.from(users)
			.where(
				and(
					eq(users.email, email),
					isNull(users.clerkID),
					eq(users.universityID, universityID),
				),
			)
			.limit(1);

		if (lookup[0]) {
			return {
				success: true,
				name: lookup[0].firstName + " " + lookup[0].lastName,
			};
		} else {
			return {
				success: false,
				name: null,
			};
		}
	});

export const doPortalLink = authenticatedAction
	.schema(
		z.object({ universityID: z.string().min(1), email: z.string().min(1) }),
	)
	.action(
		async ({ ctx: { clerkID }, parsedInput: { email, universityID } }) => {
			// why we do we care about their inner join data?
			const lookup = await db
				.select()
				.from(users)
				.where(
					and(
						eq(users.email, email),
						isNull(users.clerkID),
						eq(users.universityID, universityID),
					),
				)
				.limit(1);
			const currUser = await currentUser();
			if (!currUser) {
				return {
					success: false,
				};
			}
			// we set these when connected in order to keep clerk in sync
			const userEmail = currUser.emailAddresses[0].emailAddress;
			if (lookup[0]) {
				await db
					.update(users)
					.set({ clerkID: clerkID, email: userEmail })
					.where(eq(users.userID, lookup[0].userID));
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
