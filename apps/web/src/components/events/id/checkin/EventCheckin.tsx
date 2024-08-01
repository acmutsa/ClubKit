import PageError from "../../../shared/PageError";
import { getEventById,getUserDataAndCheckin } from "@/lib/queries";
import EventCheckinForm from "./EventCheckinForm";
import { getDateAndTimeWithTimeZoneString,getClientTimeZone } from "@/lib/utils";
import { headers } from "next/headers";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants/shared";
export default async function EventCheckin({
	eventID,
	clerkId,
	currentDateUTC,
}: {
	eventID: string;
	clerkId: string;
	currentDateUTC: Date;
}) {

	const eventPromise = getEventById(eventID);

	const headerTimeZone = headers().get(VERCEL_IP_TIMEZONE_HEADER_KEY);
	const clientTimeZone = getClientTimeZone(headerTimeZone);
	// This query is going to be way too expensive. We should break this up into two queries
	const userEventDataPromise = getUserDataAndCheckin(eventID, clerkId);

	const [event, userEventData] = await Promise.all([
		eventPromise,
		userEventDataPromise,
	]);

	if (!event) {
		return <PageError message="Event Not Found" href={"/events"} />;
	}

	const href = `/events/${event.id}`;

	const isPassed = event.end < currentDateUTC;

	if (isPassed) {
		return <PageError message="Event has already passed" href={href} />;
	}

	if (!userEventData) {
		return (
			<PageError
				message={`There was an issue finding your account.`}
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
		event.checkinStart <= currentDateUTC && currentDateUTC <= event.checkinEnd;
	if (!isCheckinAvailable) {
		return (
			<PageError
				message={`Check-in does not start until ${getDateAndTimeWithTimeZoneString(event.checkinStart, clientTimeZone)}`}
				href={href}
				className="md:px-12 lg:px-16 text-base"
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
