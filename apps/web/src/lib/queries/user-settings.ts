import { db, eq } from "db";
import { users } from "db/schema";

export async function getUserSettings(clerkID: string) {
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
}
