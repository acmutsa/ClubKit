import EventsCardView from "./EventsCardView";
import EventsCalendarView from "./EventsCalendarView";
import { db, ilike, gte, and, lt } from "db";
import { events } from "db/schema";
import type { SearchParams } from "@/lib/types/shared";
import { eventFilters } from "./filters/EventsOptionsBar";
import { unstable_noStore as noStore } from "next/cache";
import NoEvents from "./NoEvents";
// Original data fetching will be done by a server component and any further filtering will be handled client-side. Data is not super large or sensentive so this is fine
export default async function EventsView({ params }: { params: SearchParams }) {
	const cardViewSelected = params[eventFilters.view]
		? eventFilters.card === params[eventFilters.view] ?? eventFilters.card
		: true;

	const showUpcomingEvents = params[eventFilters.showEvents]
		? eventFilters.showUpcomingEvents === params[eventFilters.showEvents] ??
			eventFilters.showUpcomingEvents
		: true;

	const currDate = new Date();

	const dateComparison = showUpcomingEvents
		? gte(events.end, currDate)
		: lt(events.end, currDate);

	const eventSearch = params[eventFilters.query] ?? "";
	const eventSearchQuery = ilike(events.name, `%${eventSearch}%`);
	const categories = new Set(
		params[eventFilters.categories]?.split(",") ?? [],
	);

	// Currently written like this because of weirdness with the where clause where it cannot be nested far down the with clauses
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

	return (
		<div className="flex w-full flex-1 overflow-x-hidden no-scrollbar">
			{cardViewSelected ? (
				<EventsCardView events={allEvents} />
			) : (
				<EventsCalendarView events={allEvents} />
			)}
		</div>
	);
}
