import { now } from "@internationalized/date";
import { count, db, eq, gte, sql, between, union } from "db";
import { checkins, events, users, data } from "db/schema";
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
	rating: number,
) => {
	return db.insert(checkins).values({
		userID: userID,
		eventID: eventID,
		rating,
		feedback,
	});
};
