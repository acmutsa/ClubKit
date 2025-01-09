import { db, eq } from "db";
import { users } from "db/schema";
import { unstable_cache } from "next/cache";

const REVALIDATE_TIME = 3600 as const;

export const getUserSettings = unstable_cache(
	async (clerkID: string) => {
		const userData = await db.query.users.findFirst({
			where: eq(users.clerkID, clerkID),
			columns: {
				firstName: true,
				lastName: true,
			},
			with: {
				data: {
					columns: {
						gender: true,
						ethnicity: true,
						birthday: true,
						major: true,
						resume: true,
						shirtSize: true,
						shirtType: true,
						graduationYear: true,
						classification: true,
						graduationMonth: true,
						interestedEventTypes: true,
					},
				},
			},
		});

		return userData;
	},
	["userSettings"],
	{ revalidate: REVALIDATE_TIME, tags: ["userSettings"] },
);
