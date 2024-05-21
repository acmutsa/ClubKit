import type { EventType } from 'config'
import EventCardComponent from './EventCardComponent';
import { Calendar } from 'lucide-react';
export default function EventsCardView({ events }: { events: Array<EventType> }) {
    // Come back later and add a skeleton to show users that something is loading
  return (
    <div className='h-full w-full flex flex-col overflow-y-auto items-center justify-center pb-8 md:pb-12'>
      <div className="w-[90%] md:w-[95%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-center justify-center mt-[5%] transition">
        {events.map((event) => (
          <EventCardComponent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
