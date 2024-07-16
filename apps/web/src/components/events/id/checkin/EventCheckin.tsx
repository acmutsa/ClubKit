import PageError from "../../../shared/PageError";
import { getEventById,getUserCheckin } from "@/lib/queries";
import EventCheckinForm from "./EventCheckinForm";
export default async function EventCheckin({ eventID,userID }: { eventID: string,userID:string }) {

    const eventPromise = getEventById(eventID);

    const checkedInUser = getUserCheckin(eventID,userID);

    const [event,isCheckedInUser] = await Promise.all([eventPromise,checkedInUser]);

    const currDate = new Date();
    if (!event){
        return <PageError message="Event Not Found" href={"/events"} />
    }

    const href = `/events/${event.id}`;

    // if (isCheckedInUser){
    //     return <PageError message="You have already checked in" href={href} />;
    // }

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
		<div className="flex w-full flex-1 flex-col gap-[8%]">
			<div className="flex w-full flex-col items-center justify-center gap-3 text-xl">
				<h1 className="text-2xl">Event Check-In</h1>
				<h1 className="text-2xl font-bold text-center">{`${event.name}`}</h1>
			</div>
			<EventCheckinForm eventID={eventID} userID={userID}  />
		</div>
	);
}