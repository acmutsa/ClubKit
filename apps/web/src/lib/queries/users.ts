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

interface AttendedEvents {
	id: string;
	name: string;
	points: number;
	start: typeof events.start;
}

export const getRichUserData = async (clerkID: string) => {
	return db
		.select({
			user: users,
			userData: data,
			attendedEvents:
				sql<Array<AttendedEvents> | null>`JSONB_AGG(JSONB_BUILD_OBJECT(
			'id', ${events.id},
			'name', ${events.name},
			'points', ${events.points},
			'start', ${events.start}) ORDER BY ${events.start} DESC) FILTER (WHERE ${events.start} BETWEEN SYMMETRIC ${c.semesters.current.startDate} AND ${c.semesters.current.endDate} OR ${events.checkinStart} BETWEEN SYMMETRIC ${c.semesters.current.startDate} AND ${c.semesters.current.endDate})`.as(
					"attendedEvents",
				),
			currentSemesterPoints: sql<
				number | null
			>`SUM(${events.points}) FILTER (WHERE ${events.start} BETWEEN SYMMETRIC ${c.semesters.current.startDate} AND ${c.semesters.current.endDate} OR ${events.checkinStart} BETWEEN SYMMETRIC ${c.semesters.current.startDate} AND ${c.semesters.current.endDate})`.mapWith(
				Number,
			),
			// totalPoints: sum(events.points),
			currentSemesterEventsAttended: sql<
				number | null
			>`COUNT(${events.id}) FILTER (WHERE ${events.start} BETWEEN SYMMETRIC ${c.semesters.current.startDate} AND ${c.semesters.current.endDate} OR ${events.checkinStart} BETWEEN SYMMETRIC ${c.semesters.current.startDate} AND ${c.semesters.current.endDate})`.mapWith(
				Number,
			),
			totalEventsAttended: count(checkins.userID),
			// userCheckins: sql`ARRAY_AGG(${checkins.eventID})`,
		})
		.from(users)
		.innerJoin(data, eq(users.userID, data.userID))
		.leftJoin(checkins, eq(users.userID, checkins.userID))
		.leftJoin(events, eq(events.id, checkins.eventID))
		.groupBy(users.userID, data.userID)
		.where(eq(users.clerkID, clerkID));
};
