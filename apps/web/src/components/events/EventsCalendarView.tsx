<<<<<<< HEAD
import type { EventType } from "./filters/EventsOptionsBar";

export default function EventsCalendarView({
	events,
}: {
	events: Array<EventType>;
}) {
=======
import type { EventAndCategoriesType } from "@/lib/types/events";

export default function EventsCalendarView({
	events,clientTimeZone,currentDateUTC}: {events: Array<EventAndCategoriesType>, clientTimeZone: string, currentDateUTC: Date}) {
>>>>>>> dev
	return (
		<div>
			<h1>Events Calendar View</h1>
		</div>
	);
}
