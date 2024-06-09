import { db } from "db";

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
