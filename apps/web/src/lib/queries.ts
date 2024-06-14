import { count, db, eq, sql } from "db";
import { checkins, data, events, users } from "db/schema";

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
		.rightJoin(
			users,
			eq(sql`CAST (users.user_id AS TEXT)`, checkins.userID),
		)
		.groupBy(checkins.userID, users.userID, data.userID)
		.innerJoin(data, eq(data.userID, users.userID));
};
