import { now } from "@internationalized/date";
import { count, db, eq, sql, between, union } from "db";
import { checkins, events, users } from "db/schema";
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
	// return await db.execute(sql`
	// 	SELECT
	// 		events.*,
	// 		COUNT(*) AS checkin_count
	// 	FROM checkins
	// 	LEFT JOIN events on checkins.event_id = events.id
	// 	GROUP BY event_id, events.id`);
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
