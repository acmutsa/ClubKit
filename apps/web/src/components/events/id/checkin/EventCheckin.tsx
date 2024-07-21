import PageError from "../../../shared/PageError";
import { getEventById,getUserDataAndCheckin } from "@/lib/queries";
import EventCheckinForm from "./EventCheckinForm";
import { headers } from "next/headers";
export default async function EventCheckin({
	eventID,
	clerkId,
}: {
	eventID: string;
	clerkId: string;
}) {

    const getIPAddress = getClientIPAddress();
    console.log(getIPAddress);
    
    
    
	const eventPromise = getEventById(eventID);

	const userEventDataPromise = getUserDataAndCheckin(eventID, clerkId);

	const [event, userEventData] = await Promise.all([
		eventPromise,
		userEventDataPromise,
	]);

	const currDate = new Date();

	if (!event) {
		return <PageError message="Event Not Found" href={"/events"} />;
	}

	const href = `/events/${event.id}`;

	const isPassed = event.end < currDate;

	if (isPassed) {
		return <PageError message="Event has already passed" href={href} />;
	}

	if (!userEventData) {
		return (
			<PageError
				message={`User ${clerkId} could not be found`}
				href={"/events"}
			/>
		);
	}

	const {
        userID,
        checkins
    } = userEventData;

	if (checkins.length > 0) {
		return <PageError message="You have already checked in" href={href} />;
	}

	const isCheckinAvailable =
		event.checkinStart <= currDate && currDate <= event.checkinEnd;
	if (!isCheckinAvailable) {
		return (
			<PageError
				message="Check-in is not available at this time"
				href={href}
			/>
		);
	}

	return (
		<div className="flex w-full flex-1 flex-col gap-[8%]">
			<div className="flex w-full flex-col items-center justify-center gap-3 text-xl">
				<h1 className="text-2xl">Event Check-In</h1>
				<h1 className="text-center text-2xl font-bold">{`${event.name}`}</h1>
			</div>
			<EventCheckinForm eventID={eventID} userID={userID} />
		</div>
	);
}

const getClientIPAddress = () => {
    const FALLBACK_IP_ADDRESS = "0.0.0.0";
	const forwardedFor = headers().get("x-forwarded-for");

	if (forwardedFor) {
		return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
	}

	return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}