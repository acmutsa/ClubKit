import { db } from "db";
import EventError from "../../shared/EventError";
import Link from "next/link";
export default async function EventCheckin({ id }: { id: string }) {

    const event = await db.query.events.findFirst({
		where: (events, { eq }) => eq(events.id, id),
	});

    const currDate = new Date();

    if (!event){
        return <EventError message="Event Not Found" />
    }

    const isPassed = event.end < currDate;

    if (isPassed){
        return <EventError message="Event has already passed" />
    }

    return (
        <div>
            <h1>Events Checkin</h1>
        </div>
    );
}