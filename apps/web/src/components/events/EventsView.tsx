import EventsCardView from "./EventsCardView";
import EventsCalendarView from "./EventsCalendarView";
import { db, ilike, gte, and, lt } from "db";
import { events } from "db/schema";
import type { SearchParams } from "@/lib/types/shared";
import { EVENT_FILTERS } from "@/lib/constants/events";
import { unstable_noStore as noStore } from "next/cache";
import NoEvents from "./NoEvents";
import { headers } from "next/headers";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants/shared";
import { getClientTimeZone,getUTCDate } from "@/lib/utils";

export default async function EventsView({ params }: { params: SearchParams }) {

	const {
		VIEW,
		CARD,
		SHOW_EVENTS,
		SHOW_UPCOMING_EVENTS,
		QUERY,
		CATEGORIES
	} = EVENT_FILTERS;

	const cardViewSelected = params[EVENT_FILTERS.VIEW]
		? CARD === params[VIEW] ?? CARD
		: true;

	const showUpcomingEvents = params[SHOW_EVENTS]
		? SHOW_UPCOMING_EVENTS === params[SHOW_EVENTS] ??
			SHOW_UPCOMING_EVENTS
		: true;

	const currentDateUTC = getUTCDate();

	const dateComparison = showUpcomingEvents
		? gte(events.end, currentDateUTC)
		: lt(events.end, currentDateUTC);

	const eventSearch = params[QUERY] ?? "";
	const eventSearchQuery = ilike(events.name, `%${eventSearch}%`);
	const categories = new Set(
		params[CATEGORIES]?.split(",") ?? [],
	);

	// Currently written like this because of weirdness with the 'where' clause where it cannot be nested far down the 'with' clauses
	noStore();
	const allEvents = await db.query.events
		.findMany({
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
			where: and(eventSearchQuery, dateComparison),
			orderBy: events.start,
		})
		.then((events) => {
			if (categories.size > 0) {
				return events.filter((event) => {
					return event.eventsToCategories.some((eventToCategory) => {
						return categories.has(eventToCategory.category.name);
					});
				});
			}
			return events;
		});

	if (allEvents.length < 0) {
		return <NoEvents />;
	}

	const clientHeaderTimezoneValue = headers().get(
		VERCEL_IP_TIMEZONE_HEADER_KEY,
	);

	const clientTimeZone = getClientTimeZone(clientHeaderTimezoneValue);

	return (
		<div className="flex w-full flex-1 overflow-x-hidden no-scrollbar">
			{cardViewSelected ? (
				<EventsCardView
					events={allEvents}
					clientTimeZone={clientTimeZone}
					currentDateUTC={currentDateUTC}
				/>
			) : (
				<EventsCalendarView
					events={allEvents}
					clientTimeZone={clientTimeZone}
					currentDateUTC={currentDateUTC}
				/>
			)}
		</div>
	);
}
