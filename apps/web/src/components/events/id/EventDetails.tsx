import { getEventDetails } from "@/lib/queries";
import PageError from "../../shared/PageError";
import EventDetailsMobile from "./EventDetailsMobile";
import EventDetailsDefault from "./EventDetailsDefault";
import { headers } from "next/headers";
import { VERCEL_IP_TIMEZONE_HEADER_KEY,TWENTY_FOUR_HOURS } from "@/lib/constants/shared";
import {
	getClientTimeZone,
	getDateAndTimeWithTimeZoneString,
	getDateWithTimeZoneString,
	getDateDifferentInHours,
	getUTCDate,
} from "@/lib/utils";

export default async function EventDetails({ id }: { id: string }) {
	const headerTimeZone = headers().get(VERCEL_IP_TIMEZONE_HEADER_KEY);
	const clientTimeZone = getClientTimeZone(headerTimeZone);
	const event = await getEventDetails(id);

	if (!event) {
		return <PageError message="Event Not Found" href="/events" />;
	}
	// This needs to be fixed
	const currentDateUTC = getUTCDate();
	const isEventPassed = event.end < currentDateUTC;

	const startTime = getDateWithTimeZoneString(event.start, clientTimeZone);
	
	const startDate = event.start.toLocaleDateString(undefined,{
		timeZone: clientTimeZone,
		month: "long",
		day: "numeric",
		year: "numeric"
	});

	const rawEventDuration = getDateDifferentInHours(event.end, event.start);
	
	const isEventLongerThanADay = rawEventDuration > TWENTY_FOUR_HOURS;

	const formattedEventDuration = isEventLongerThanADay
		? (rawEventDuration / TWENTY_FOUR_HOURS).toFixed(2) + " day(s)"
		: rawEventDuration.toFixed(2) + " hour(s)";

	const checkInUrl = `/events/${event.id}/checkin`;

	const isCheckinAvailable =
		event.checkinStart <= currentDateUTC && currentDateUTC <= event.checkinEnd;

	const checkInMessage = isCheckinAvailable
		? "Ready to check in? Click here!"
		: isEventPassed
			? "Check-in is closed"
			: `Check-in starts on ${getDateAndTimeWithTimeZoneString(event.checkinStart, clientTimeZone)}`;

	const eventCalendarLink = {
		title: event.name,
		description: event.description,
		start: event.start.toISOString(),
		end: event.end.toISOString(),
		location: event.location,
	};

	const detailsProps = {
		event,
		startTime,
		startDate,
		formattedEventDuration,
		checkInUrl,
		checkInMessage,
		eventCalendarLink,
		isEventPassed,
		isCheckinAvailable
	};
	


	// Also, we should display how many points something is worth to entice people to show up for it
	return (
		<div className="mt-2 flex flex-1 flex-col space-y-4 pb-20">
			<h1 className=" px-2 py-1 text-center text-2xl font-black sm:text-2xl md:px-8 md:text-3xl lg:text-5xl">
				{event.name}
			</h1>
			<EventDetailsMobile {...detailsProps} />
			<EventDetailsDefault
				{...detailsProps}
			/>
		</div>
	);
}
