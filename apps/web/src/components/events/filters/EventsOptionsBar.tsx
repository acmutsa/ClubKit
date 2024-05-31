import EventsSearch from "./EventsSearch";
import CategoriesDropDown from "./CategoriesDropDown";
import PastPresentDropDown from "./PastPresentDropDown";
import ViewToggle from "./ViewToggle";
import type { SearchParams } from "config";
import { db } from "db";
import { eventFilters } from "@/app/events/page";


export default async function EventsOptionsBar({params}:{params:SearchParams}) {

const cardViewSelected = (params.view) ? eventFilters.card === params[eventFilters.view] ?? eventFilters.card : true;
const showUpcomingEvents = params[eventFilters.showEvents]
	? eventFilters.showUpcomingEvents === params[eventFilters.showEvents] ??
		eventFilters.showUpcomingEvents
	: true;
const categories = await db.query.eventCategories.findMany();

return (
	<div className="flex w-full flex-row justify-between rounded-lg border-2 sm:w-[90%] ">
		{/* Dropdown to show either past or present events */}
		<PastPresentDropDown cardViewSelected={cardViewSelected} showUpcomingEvents={showUpcomingEvents} />
		{/* Search Component*/}
		<EventsSearch cardViewSelected={cardViewSelected} />
		<div className="flex">
			{/* Filter by categories component */}
		<CategoriesDropDown cardViewSelected={cardViewSelected} categories={categories} searchParams={params} />
		{/* Toggle either to card or calendar view */}
		<ViewToggle cardViewSelected={cardViewSelected}/>
		</div>
	</div>
);
}

