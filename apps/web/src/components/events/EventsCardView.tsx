import type { EventType } from "@/app/events/page";
import EventCardComponent from "./EventCardComponent";
import { Suspense } from "react";
import { ScrollArea } from "../ui/scroll-area";
export default function  EventsCardView({
  events,
}: {
  events: Array<EventType>;
}) {
  // Come back later and add a skeleton to show users that something is loading
  return (
    // border-2 border-red-400
    <div className="w-full h-[80vh] flex flex-col items-center mt-5 border-b-4 ">
      {/* gap-6 */}
      <ScrollArea className="w-[95%] h-full no-scrollbar">
        <div className="w-[90%] md:w-[95%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto mt-4 mb-20 no-scrollbar">
          {events.map((event) => (
            <EventCardComponent key={event.id} event={event} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
