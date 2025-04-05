import c from "config";
import { count, db, eq, sum } from "db";
import { checkins, data, events, users } from "db/schema";
import { getCurrentSemester } from "./semesters";

export const getAdminUser = async (clerkId: string) => {
	return db.query.users.findFirst({
		where: (users, { eq, and, inArray }) =>
			and(
				eq(users.clerkID, clerkId),
				inArray(users.role, ["admin", "super_admin"]),
			),
	});
};

export const getUser = async (userID: string) => {
	return db.query.users.findFirst({
		where: eq(users.userID, Number(userID)),
		with: {
			data: true,
		},
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
	const currentSemester = await getCurrentSemester();
	const [{ totalMembers }] = await db
		.select({
			totalMembers: count(),
		})
		.from(users);

	const checkin_counts = await db
		.select({
			user_id: checkins.userID,
			totalPoints: sum(events.points).mapWith(Number),
		})
		.from(checkins)
		.innerJoin(events, eq(checkins.eventID, events.id))
		.groupBy(checkins.userID);

	let activeMembers = checkin_counts.length;
	let banquetQualifiers = 0;
	checkin_counts.forEach((checkin) => {
		if (
			checkin.totalPoints >=
			(currentSemester?.pointsRequired ??
				c.semesters.current.pointsRequired)
		) {
			banquetQualifiers++;
		}
	});

	return { totalMembers, activeMembers, banquetQualifiers };
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
