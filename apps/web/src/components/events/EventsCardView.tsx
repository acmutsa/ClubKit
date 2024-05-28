import type { EventType } from "./Events";
import EventCardComponent from "./EventCardComponent";
import { Calendar } from "lucide-react";
export default function  EventsCardView({
  events,
}: {
  events: Array<EventType>;
}) {
  // Come back later and add a skeleton to show users that something is loading
  return (
    <div className="w-full flex flex-col items-center justify-center pb-6 ">
      {/* gap-6 */}
      <div className="w-[90%] md:w-[95%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-[5%] ">
        {events.map((event) => (
          <EventCardComponent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
