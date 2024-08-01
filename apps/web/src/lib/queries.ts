import { now } from "@internationalized/date";
import { count, db, eq, sql, between, desc } from "db";
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

export const getCheckinLog = async () => {
	return await db.query.checkins.findMany({
		columns: {
			time: true,
			feedback: true,
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

	// return await db
	// 	.select({
	// 		event: events.name,
	// 		user: users.firstName,
	// 		time: checkins.time,
	// 		feedback: checkins.feedback,
	// 	})
	// 	.from(checkins)
	// 	.orderBy(desc(checkins.time))
	// 	.innerJoin(events, eq(checkins.eventID, events.id))
	// 	.innerJoin(users, eq(checkins.userID, users.userID));
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
