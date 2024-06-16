import EventsCardView from "./EventsCardView";
import EventsCalendarView from "./EventsCalendarView";
import { db,ilike,gte, and,lt } from "db";
import { events, } from "db/schema";
import type { SearchParams } from "config";
import { eventFilters } from "./filters/EventsOptionsBar";
import { unstable_noStore as noStore } from "next/cache";


// Original data fetching will be done by a server component and any further filtering will be handled client-side. Data is not super large or sensentive so this is fine
export default async function EventsView({params}:{params:SearchParams}) {
	
	
		const cardViewSelected = params[eventFilters.view]
		? eventFilters.card === params[eventFilters.view] ?? eventFilters.card
		: true;
	
	const showUpcomingEvents = params[eventFilters.showEvents]
		? eventFilters.showUpcomingEvents === params[eventFilters.showEvents] ??
			eventFilters.showUpcomingEvents
		: true;

	const dateComparison = showUpcomingEvents
		? gte(events.start, new Date())
		: lt(events.start, new Date());


	const eventSearch = params[eventFilters.query] ?? "";
	const eventSearchQuery = ilike(events.name, `%${eventSearch}%`);
	const categories = new Set(params[eventFilters.categories]?.split(",") ?? [])
	
	
	const start = new Date().getTime();

	// Currently written like this because of weirdness with the where clause where it cannot be nested far down the with clauses
	noStore();
	const allEvents = await db.query.events.findMany({
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
	}).then((events) => {
		if (categories.size > 0){
			return events.filter((event) => {
				return event.eventsToCategories.some((eventToCategory) => {
					return categories.has(eventToCategory.category.name);
				});
			});
		}
		return events;
	});

	if (allEvents.length < 0) {
		return (
			<div className="flex flex-1 w-full flex-col items-center pt-[6%] md:pt-[2%]">
				<h1 className="w-full text-center text-3xl font-bold">
					Aw Man :(
				</h1>
				<h3 className="mx-auto w-[95%] text-center text-xl">
					There are no events to display at this time for your desired
					parameters.
				</h3>
				<h3 className="mx-auto w-[95%] text-center text-xl">
					Please check back later or widen your filtering options.
				</h3>
			</div>
		);
	}

	return (
			<div className="flex w-full no-scrollbar">
				{cardViewSelected ? (
					<EventsCardView events={allEvents} />
				) : (
					<EventsCalendarView events={allEvents} />
				)}
			</div>
	);
}


