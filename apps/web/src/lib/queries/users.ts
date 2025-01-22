import c from "config";
import { count, db, eq, gte, inArray, sql } from "db";
import {
	checkins,
	data,
	eventCategories,
	events,
	eventsToCategories,
	users,
} from "db/schema";

export const getAdminUser = async (clerkId: string) => {
	return db.query.users.findFirst({
		where: (users, { eq, and, inArray }) =>
			and(
				eq(users.clerkID, clerkId),
				inArray(users.role, ["admin", "super_admin"]),
			),
	});
};

export const getUserWithData = async () => {
	return db
		.select({
			user: users,
			data: data,
			checkin_count: count(checkins.userID),
		})
		.from(checkins)
		.rightJoin(users, eq(users.userID, checkins.userID))
		.groupBy(checkins.userID, users.userID, data.userID)
		.innerJoin(data, eq(data.userID, users.userID));
};

export const getMemberStatsOverview = async () => {
	const [{ totalMembers }] = await db
		.select({
			totalMembers: count(),
		})
		.from(events);

	const checkin_counts = db
		.select({ user_id: checkins.userID, count: count(checkins.eventID) })
		.from(checkins)
		.groupBy(checkins.userID)
		.having(({ count }) => gte(count, c.membership.activeThreshold))
		.as("checkin_counts");
	const [{ activeMembers }] = await db
		.select({
			activeMembers: count(checkin_counts.user_id),
		})
		.from(checkin_counts);

	return { totalMembers, activeMembers };
};

export const getUserCheckin = async (eventID: string, userID: number) => {
	return db.query.checkins.findFirst({
		where: (checkins, { and }) =>
			and(eq(checkins.eventID, eventID), eq(checkins.userID, userID)),
	});
};

export const getUserDataAndCheckin = async (
	eventID: string,
	clerkId: string,
) => {
	return db.query.users.findFirst({
		where: eq(users.clerkID, clerkId),
		with: {
			checkins: {
				where: eq(checkins.eventID, eventID),
			},
		},
	});
};
