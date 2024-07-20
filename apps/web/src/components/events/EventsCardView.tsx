import type { EventType } from "./filters/EventsOptionsBar";
import EventCardComponent from "./EventCardComponent";
import { Suspense } from "react";
import { ScrollArea } from "../ui/scroll-area";
export default function EventsCardView({
  events,
}: {
  events: Array<EventType>;
}) {
  const currentDate = new Date();

  return (
		<div className="flex flex-1 w-full flex-col items-center no-scrollbar">
			{/* h-auto */}
			<ScrollArea className="flex w-[95%] no-scrollbar  max-h-[75dvh] monitor:h-[90dvh]">
				<div className="mx-auto mt-4 py-3 2xl:mt-6 grid w-[90%] grid-cols-1 gap-6 no-scrollbar sm:grid-cols-2 md:mb-4 md:w-[95%] lg:grid-cols-3 2xl:grid-cols-4">
					{events.map((event) => (
						<EventCardComponent
							key={event.id}
							event={event}
							isPast={event.end < currentDate}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
  );
}
