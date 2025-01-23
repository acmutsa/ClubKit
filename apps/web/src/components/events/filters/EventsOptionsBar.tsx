import EventsSearch from "./EventsSearch";
import CategoriesDropDown from "./CategoriesDropDown";
import PastPresentDropDown from "./PastPresentDropDown";
import ViewToggle from "./ViewToggle";
import type { SearchParams } from "@/lib/types/shared";
import { db } from "db";
import clsx from "clsx";
import { EVENT_FILTERS } from "@/lib/constants/events";
import { getAllCategories } from "@/lib/queries/categories";
export default async function EventsOptionsBar({
	params,
}: {
	params: SearchParams;
}) {
	const { VIEW, CARD, SHOW_EVENTS, SHOW_UPCOMING_EVENTS } = EVENT_FILTERS;

	const cardViewSelected = params.view ? CARD === params[VIEW] ?? CARD : true;

	const showUpcomingEvents = params[SHOW_EVENTS]
		? SHOW_UPCOMING_EVENTS === params[SHOW_EVENTS] ?? SHOW_UPCOMING_EVENTS
		: true;

	const categories = await getAllCategories();

	return (
		<div className="mt-2 flex w-[98%] flex-row justify-between rounded-lg border-2 border-muted sm:w-[90%] md:mt-4">
			{/* Dropdown to show either past or present events */}
			<PastPresentDropDown
				cardViewSelected={cardViewSelected}
				showUpcomingEvents={showUpcomingEvents}
			/>
			{/* Search Component*/}
			<EventsSearch cardViewSelected={cardViewSelected} />
			{/* Div to keep both of these pieces at the end of the div */}
			<div
				className={clsx("flex", {
					"w-full justify-between md:px-2": !cardViewSelected,
				})}
			>
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
