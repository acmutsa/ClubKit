import type { EventAndCategoriesType } from "@/lib/types/events";

export default function EventsCalendarView({
	events,clientTimeZone}: {events: Array<EventAndCategoriesType>, clientTimeZone: string}) {
	return (
		<div>
			<h1>Events Calendar View</h1>
		</div>
	);
}
