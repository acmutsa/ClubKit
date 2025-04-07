import PageError from "../../../shared/PageError";
import { getEventById } from "@/lib/queries/events";
import { getUserDataAndCheckin } from "@/lib/queries/users";
import EventCheckinForm from "./EventCheckinForm";
import { getClientTimeZone } from "@/lib/utils";
import { headers } from "next/headers";
import { formatInTimeZone } from "date-fns-tz";
import { isBefore, isWithinInterval } from "date-fns";
import {
	EVENT_TIME_FORMAT_STRING,
	EVENT_DATE_FORMAT_STRING,
} from "@/lib/constants/events";
import { getRequestContext } from "@cloudflare/next-on-pages";
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

	const clientTimeZone = getClientTimeZone(getRequestContext().cf.timezone);

	if (!event) {
		return <PageError message="Event Not Found" href={"/events"} />;
	}

	const href = `/events/${event.id}`;

	const userEventData = await getUserDataAndCheckin(eventID, clerkId);

	if (!userEventData) {
		return (
			<PageError
				message={`There was an issue finding your account.`}
				href={"/events"}
			/>
		);
	}

	const { userID, checkins } = userEventData;

	if (checkins.length > 0) {
		return <PageError message="You have already checked in" href={href} />;
	}

	const isCheckinAvailable = isWithinInterval(currentDateUTC, {
		start: event.checkinStart,
		end: event.checkinEnd,
	});

	if (!isCheckinAvailable) {
		const isDateBeforeCheckinStart = isBefore(
			currentDateUTC,
			event.checkinStart,
		);
		const errorMessage = isDateBeforeCheckinStart
			? `Check-in does not start until ${formatInTimeZone(event.checkinStart, clientTimeZone, `${EVENT_TIME_FORMAT_STRING} @ ${EVENT_DATE_FORMAT_STRING}`)}`
			: `Check-in for this event ended on ${formatInTimeZone(event.checkinEnd, clientTimeZone, `${EVENT_TIME_FORMAT_STRING} @ ${EVENT_DATE_FORMAT_STRING}`)}`;
		return (
			<PageError
				message={errorMessage}
				href={href}
				className="text-base md:px-12 lg:px-16"
			/>
		);
	}

	return (
		<div className="flex w-full flex-1 flex-col gap-[8%]">
			<div className="flex w-full flex-col items-center justify-center gap-3 text-xl">
				<h1 className="text-2xl lg:text-3xl">Thanks for attending</h1>
				<h1 className="text-center text-2xl font-bold lg:text-3xl">{`${event.name}`}</h1>
			</div>
			<EventCheckinForm eventID={eventID} userID={userID} />
		</div>
	);
}
