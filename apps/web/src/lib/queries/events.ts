import { count, db, desc, eq, sql } from "db";
import {
	checkins,
	eventCategories,
	events,
	eventsToCategories,
} from "db/schema";
import { iEvent, uEvent } from "../types/events";

export async function getEventWithCategoriesById(id: string) {
	const event = await db.query.events.findFirst({
		where: () => eq(events.id, id),
		with: {
			eventsToCategories: {
				with: {
					category: {
						columns: {
							name: true,
						},
					},
				},
			},
		},
		columns: {
			id: false,
		},
	});

	if (event === undefined) return undefined;

	return {
		name: event.name,
		description: event.description,
		id: id,
		start: event.start,
		end: event.end,
		checkinStart: event.checkinStart,
		checkinEnd: event.checkinEnd,
		location: event.location,
		categories: event.eventsToCategories.map((cat) => cat.category.name),
		thumbnailUrl: event.thumbnailUrl,
		isUserCheckinable: event.isUserCheckinable,
		isHidden: event.isHidden,
		points: event.points,
	};
}

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
				sql`COUNT(*) FILTER (WHERE ${events.start} BETWEEN datetime('now') AND datetime('now', '+7 days'))`.mapWith(
					Number,
				),
			pastEvents:
				sql`COUNT(*) FILTER (WHERE ${events.end} <= datetime('now'))`.mapWith(
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
			.select({
				events: events,
				checkin_count: count(checkins.eventID),
				avg_rating: sql<number>`AVG(${checkins.rating})`.mapWith(
					Number,
				),
			})
			.from(checkins)
			.rightJoin(events, eq(events.id, checkins.eventID))
			.groupBy(checkins.eventID, events.id)
	).map(({ events, checkin_count, avg_rating }) => ({
		checkin_count,
		avg_rating,
		...events,
	}));
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

export const getEventList = async () => {
	return await db.query.events.findMany({
		columns: { id: true, name: true },
		orderBy: desc(events.start),
	});
};
