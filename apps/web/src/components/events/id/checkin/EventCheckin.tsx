import { db } from "db";
import NotFound from "../../../shared/NotFound";
import Link from "next/link";
export default async function EventCheckin({ id }: { id: string }) {

    const event = await db.query.events.findFirst({
		where: (events, { eq }) => eq(events.id, id),
	});

    const currDate = new Date();
    const href = "/events";
    if (!event){
        return <NotFound message="Event Not Found" href={href} />
    }

    const isPassed = event.end < currDate;

    // TODO: Uncomment after testing

    // if (isPassed){
    //     return <NotFound message="Event has already passed" href={href} />;
    // }

    // const checkinAvailabile = event.checkinStart <= currDate && currDate <= event.checkinEnd;
    // if (!checkinAvailabile){
    //     return (
	// 		<NotFound
	// 			message="Check-in is not available at this time"
	// 			href={href}
	// 		/>
	// 	);
    // }

    return (
        <div>
            <h1>Events Checkin</h1>
        </div>
    );
}