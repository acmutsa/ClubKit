import PageError from "../../../shared/PageError";
import { getEventById,getUserDataAndCheckin } from "@/lib/queries";
import EventCheckinForm from "./EventCheckinForm";
import { getClientTimeZone } from "@/lib/utils";
import { headers } from "next/headers";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants";
import { formatInTimeZone } from "date-fns-tz";
import { isAfter } from "date-fns";
import { EVENT_TIME_FORMAT_STRING, EVENT_DATE_FORMAT_STRING } from "@/lib/constants/events";

export default async function EventCheckin({
	eventID,
	clerkId,
	currentDateUTC,
}: {
	eventID: string;
	clerkId: string;
	currentDateUTC: Date;
}) {

	const event = await getEventById(eventID);

	const headerTimeZone = headers().get(VERCEL_IP_TIMEZONE_HEADER_KEY);
	const clientTimeZone = getClientTimeZone(headerTimeZone);
	// This query is going to be way too expensive. We should break this up into two queries

	if (!event) {
		return <PageError message="Event Not Found" href={"/events"} />;
	}

	const href = `/events/${event.id}`;

	const isPassed = isAfter(currentDateUTC, event.end);

	if (isPassed) {
		return <PageError message="Event has already passed" href={href} />;
	}
	const userEventData = await getUserDataAndCheckin(eventID, clerkId);

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
				message={`Check-in does not start until ${formatInTimeZone(event.checkinStart,clientTimeZone, `${EVENT_TIME_FORMAT_STRING} @ ${EVENT_DATE_FORMAT_STRING}`)}`}
				href={href}
				className="md:px-12 lg:px-16 text-base"
			/>
		);
	}

	return (
		<div className="flex w-full flex-1 flex-col gap-[8%]">
			<div className="flex w-full flex-col items-center justify-center gap-3 text-xl">
				<h1 className="text-2xl">Thanks for attending</h1>
				<h1 className="text-center text-2xl font-bold">{`${event.name}`}</h1>
			</div>
			<EventCheckinForm eventID={eventID} userID={userID} />
		</div>
	);
}
