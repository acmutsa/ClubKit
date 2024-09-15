import { count, db, eq, inArray, sql } from "db";
import { checkins } from "db/schema";
import { CheckInUserClientProps } from "db/types";

export const getCheckinLog = async () => {
	return await db.query.checkins.findMany({
		columns: {
			time: true,
			feedback: true,
			rating: true,
		},
		with: {
			author: {
				columns: {
					userID: true,
					firstName: true,
					lastName: true,
				},
			},
			event: {
				columns: {
					name: true,
				},
			},
		},
	});
};

export const getCheckinStatsOverview = async () => {
	const [res] = await db.select({ total_checkins: count() }).from(checkins);
	return res;
};

export const checkInUserClient = async (props: CheckInUserClientProps) => {
	return db.insert(checkins).values({
		...props,
	});
};

export const checkInUserList = async (
	eventID: string,
	universityIDs: string[],
	adminID: string,
) => {
	const userIDs = await db.query.data.findMany({
		where: (data) => inArray(data.universityID, universityIDs),
		columns: { userID: true, universityID: true },
	});

	const successfulIDs = (
		await db
			.insert(checkins)
			.values(
				userIDs.map(({ userID }) => ({
					userID,
					eventID,
					adminID,
				})),
			)
			.returning({ userID: checkins.userID })
			.onConflictDoNothing()
	).map(({ userID }) => userID);

	// Return only failed ids
	const successful = userIDs.filter(({ userID }) =>
		successfulIDs.includes(userID),
	);
	const failed = universityIDs.filter(
		(id) => !successful.some(({ universityID }) => universityID === id),
	);
	return failed;
};
