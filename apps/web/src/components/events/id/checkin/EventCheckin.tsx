import { db } from "db";
import EventNotFound from "../../shared/EventNotFound";
export default async function EventCheckin({ id }: { id: string }) {

    const event = await db.query.events.findFirst({
		where: (events, { eq }) => eq(events.id, id),
	});

    if (!event){
        return <EventNotFound />
    }

    return (
        <div>
            <h1>Events Checkin</h1>
        </div>
    );
}