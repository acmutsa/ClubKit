import EventsSearch from "./EventsSearch";
import CategoriesDropDown from "./CategoriesDropDown";
import PastPresentDropDown from "./PastPresentDropDown";
import ViewToggle from "./ViewToggle";
import type { SearchParams } from "config";
import { db } from "db";
import clsx from "clsx";

export type EventCategory = {
	name: string;
	color: string;
	id: string;
};

type EventsToCategories = {
	eventID: string;
	categoryID: string;
	category: {
		name: string;
		color: string;
	};
};

export type EventType = {
	id: string;
	name: string;
	description: string;
	start: Date;
	end: Date;
	checkinStart: Date;
	checkinEnd: Date;
	location: string;
	isUserCheckinable: boolean;
	isHidden: boolean;
	eventsToCategories: Array<EventsToCategories>;
};

// This is use to create a single source of truth in our filters for the events
export const eventFilters = {
	query: "query",
	card: "card",
	view: "view",
	calendar: "calendar",
	showUpcomingEvents: "upcoming",
	showPastEvents: "past",
	showEvents: "show_events",
	categories: "categories",
	weekOf: "week_of",
};

export default async function EventsOptionsBar({params}:{params:SearchParams}) {

const cardViewSelected = (params.view) ? eventFilters.card === params[eventFilters.view] ?? eventFilters.card : true;
const showUpcomingEvents = params[eventFilters.showEvents]
	? eventFilters.showUpcomingEvents === params[eventFilters.showEvents] ??
		eventFilters.showUpcomingEvents
	: true;
const categories = await db.query.eventCategories.findMany();
console.log('EventOptionsBar categories',categories);
console.log('EventOptionsBar params',params);
return (
	<div className="flex w-[98%] flex-row justify-between rounded-lg border-2 sm:w-[90%] border-muted mt-2 md:mt-4">
		{/* Dropdown to show either past or present events */}
		<PastPresentDropDown
			cardViewSelected={cardViewSelected}
			showUpcomingEvents={showUpcomingEvents}
		/>
		{/* Search Component*/}
		<EventsSearch cardViewSelected={cardViewSelected} />
		{/* Div to keep both of these pieces at the end of the div */}
		<div className={clsx('flex',{
			'w-full justify-between md:px-2': !cardViewSelected,})}>
			{/* Filter by categories component */}
			<CategoriesDropDown
				cardViewSelected={cardViewSelected}
				categories={categories}
				searchParams={params}
			/>
			{/* Toggle either to card or calendar view */}
			<ViewToggle cardViewSelected={cardViewSelected} />
		</div>
	</div>
);
}

