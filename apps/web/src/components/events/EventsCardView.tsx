import type { EventType } from 'config'
import EventCardComponent from './EventCardComponent';

export default function EventsCardView({ Events }: { Events: Array<EventType> }) {
  return (
    <div className='w-[90%] flex flex-col items-center space-y-5 mt-[15%]'>
      {Events.map((event) => (
        <EventCardComponent key={event.id} event={event} />
    ))}
    </div>
  );
}
