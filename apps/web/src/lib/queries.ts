import { count, db, eq, gte, sql, between, inArray, desc } from "db";
import { checkins, events, users, data } from "db/schema";
import { getUTCDate } from "@/lib/utils";
import c from "config";

export const getCategoryOptions = async () => {
	const categories = (await db.query.eventCategories.findMany()).reduce(
		(acc, cat) => {
			acc[cat.name] = cat.id;
			return acc;
		},
		{} as { [key: string]: string },
	);
	return categories;
};

// TODO: Apply filtering options later
export const getEvents = async () => {
	const events = await db.query.events.findMany();
	return events;
};

export const getEventStatsOverview = async () => {
	const [groupedStats] = await db
		.select({
			totalEvents: count(),
			thisWeek:
				sql`COUNT(*) FILTER (WHERE ${events.start} BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '7 days')`.mapWith(
					Number,
				),
			pastEvents:
				sql`COUNT(*) FILTER (WHERE ${events.end} <= CURRENT_TIMESTAMP)`.mapWith(
					Number,
				),
		})
		.from(events);
	return groupedStats;
};

export const getEventById = async (id: string) => {
	return await db.query.events.findFirst({
		where: (events, { eq }) => eq(events.id, id),
	});
};

export const getEventCheckins = async (id: string) => {
	return await db.query.checkins.findMany({
		where: (checkins, { eq }) => eq(checkins.eventID, id),
		orderBy: (checkins, { desc }) => desc(checkins.time),
	});
};

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

export const getEventsWithCheckins = async () => {
	return (
		await db
			.select({ events: events, checkin_count: count(checkins.eventID) })
			.from(checkins)
			.rightJoin(events, eq(events.id, checkins.eventID))
			.groupBy(checkins.eventID, events.id)
	).map(({ events, checkin_count }) => ({ checkin_count, ...events }));
};

export const getUserWithData = async () => {
	return await db
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

export const getEventDetails = async (id: string) => {
	return db.query.events.findFirst({
		with: {
			eventsToCategories: {
				with: {
					category: {
						columns: {
							name: true,
							color: true,
						},
					},
				},
			},
		},
		where: eq(events.id, id),
	});
};

export const getUserCheckin = async (eventID: string, userID: number) => {
	return db.query.checkins.findFirst({
		where: (checkins, { and }) =>
			and(eq(checkins.eventID, eventID), eq(checkins.userID, userID)),
	});
};

export const getUserCheckins = async (userID: number) => {
	return db.query.checkins.findMany({
		where: eq(checkins.userID, userID),
	});
};

export const getEventList = async () => {
	return await db.query.events.findMany({
		columns: { id: true, name: true },
		orderBy: desc(events.start),
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

export const checkInUser = async (
	eventID: string,
	userID: number,
	feedback: string,
	rating?: number,
	adminID?: string,
) => {
	return db.insert(checkins).values({
		userID,
		eventID,
		adminID,
		rating,
		feedback,
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

	const time = getUTCDate();
	const successfulIDs = (
		await db
			.insert(checkins)
			.values(
				userIDs.map(({ userID }) => ({
					userID,
					eventID,
					adminID,
					time,
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
