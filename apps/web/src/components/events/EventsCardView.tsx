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
   
    <div className="w-full flex flex-col items-center no-scrollbar">
      <ScrollArea className="w-[95%] flex h-[600px] no-scrollbar">
        <div className="w-[90%] md:w-[95%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mx-auto mt-4 md:mb-4 no-scrollbar">
          {events.map((event) => (
            <EventCardComponent key={event.id} event={event} isPast={event.start < currentDate} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
