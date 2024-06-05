import EventsCardView from "./EventsCardView";
import EventsCalendarView from "./EventsCalendarView";
import { db,eq,ilike,gte, and,lt,inArray, SQL, sql } from "db";
import { events,eventCategories, eventsToCategories, eventCategoriesRelations, eventsToCategoriesRelations } from "db/schema";
import type { SearchParams } from "config";
import { eventFilters } from "./filters/EventsOptionsBar";
import { unstable_noStore as noStore } from "next/cache";


// Original data fetching will be done by a server component and any further filtering will be handled client-side. Data is not super large or sensentive so this is fine
export default async function EventsView({params}:{params:SearchParams}) {
	noStore();
	
	console.log("events searchParams: ", params);
	const cardViewSelected = params[eventFilters.view]
		? eventFilters.card === params[eventFilters.view] ?? eventFilters.card
		: true;
	// await new Promise((resolve)=>setTimeout(resolve, 1000));
	// showUpcomingEvents boolean and its respective query value
	const showUpcomingEvents = params[eventFilters.showEvents]
		? eventFilters.showUpcomingEvents === params[eventFilters.showEvents] ??
			eventFilters.showUpcomingEvents
		: true;

	const dateComparison = showUpcomingEvents
		? gte(events.start, new Date())
		: lt(events.start, new Date());

	// We will process the categories and have them be passed down to the state. So still a single database call, but we can get access to them here for preprocessing

	// Event search query and its respective query value
	const eventSearch = params[eventFilters.query] ?? "";
	const eventSearchQuery = ilike(events.name, `%${eventSearch}%`);
	// Categories and its respective query value
	const categories = new Set(params[eventFilters.categories]?.split(",") ?? [])
	
	
	// TODO: Come back and add filtering options to db call
	const start = new Date().getTime();

	noStore();
	// Currently written like this because of weirdness with the where clause where it cannot be nested far down the with clauses
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
		// This will give us our most recent events first. This will be useful for how we sort
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


	// allEvents.filter((event) => 
	// 	event.eventsToCategories

	// const allEvents = await db.select()
	// .from(events)
	// .innerJoin(eventsToCategories,eq(events.id,eventsToCategories.eventID))
	// .innerJoin(eventCategories,eq(eventsToCategories.categoryID,eventCategories.id))
	// .where(and(eventSearchQuery, dateComparison))
	// .groupBy(events.id,eventsToCategories.categoryID,eventsToCategories.eventID,eventCategories.id)


	
	// console.log(allEvents);
	console.log(new Date().getTime() - start, "ms");

	

	return (
		<>
			{allEvents.length > 0 ? (
				<div className="h-3/4 no-scrollbar">
					{cardViewSelected ? (
						<EventsCardView events={allEvents} />
					) : (
						<EventsCalendarView events={allEvents} />
					)}
				</div>
			) : (
				<div className="flex w-full flex-col justify-center space-y-6 pt-[6%] md:pt-[2%]">
					<h1 className="w-full text-center text-3xl font-bold">
						Womp Womp :(
					</h1>
					<h1 className="mx-auto w-[95%] text-center text-xl">
						There are no events to display at this time for your
						desired parameters. Please check back later or widen
						your filtering options.
					</h1>
				</div>
			)}
		</>
	);
}


