import type { EventAndCategoriesType } from "@/lib/types/events";
import EventCardComponent from "./EventCardComponent";
import { ScrollArea } from "../ui/scroll-area";
export default function EventsCardView({events,clientTimeZone,currentDateUTC}: {events: Array<EventAndCategoriesType>,clientTimeZone: string,currentDateUTC: Date}) {

	return (
		<div className="flex w-full flex-1 flex-col items-center no-scrollbar">
			{/* h-auto */}
			<ScrollArea className="monitor:h-[90dvh] flex max-h-[75dvh]  w-[95%] no-scrollbar">
				<div className="mx-auto mt-4 grid w-[90%] grid-cols-1 gap-6 py-3 no-scrollbar sm:grid-cols-2 md:mb-4 md:w-[95%] lg:grid-cols-3 2xl:mt-6 2xl:grid-cols-4">
					{events.map((event) => (
						<EventCardComponent
							key={event.id}
							event={event}
							isPast={event.end < currentDateUTC}
							clientTimezone={clientTimeZone}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
