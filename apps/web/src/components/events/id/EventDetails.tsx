import { getEventDetails } from "@/lib/queries/events";
import PageError from "../../shared/PageError";
import EventDetailsMobile from "./EventDetailsMobile";
import EventDetailsDefault from "./EventDetailsDefault";
import { headers } from "next/headers";
import { VERCEL_IP_TIMEZONE_HEADER_KEY,TWENTY_FOUR_HOURS } from "@/lib/constants";
import {
	getClientTimeZone,
	getUTCDate,
	isEventCurrentlyHappening,
} from "@/lib/utils";
import { differenceInHours, isAfter } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { EVENT_DATE_FORMAT_STRING, EVENT_TIME_FORMAT_STRING } from "@/lib/constants/events";
import EventDetailsLiveIndicator from "../shared/EventDetailsLiveIndicator";
export default async function EventDetails({ id }: { id: string }) {
	
	const headerTimeZone = headers().get(VERCEL_IP_TIMEZONE_HEADER_KEY);
	const clientTimeZone = getClientTimeZone(headerTimeZone);
	const event = await getEventDetails(id);

	if (!event) {
		return <PageError message="Event Not Found" href="/events" />;
	}
	const {
		start,
		end,
		checkinStart,
		checkinEnd,
	} = event;
	const currentDateUTC = getUTCDate();
	const isEventPassed = isAfter(currentDateUTC, end);
	const isEventHappening = isEventCurrentlyHappening(currentDateUTC, start, end);


	const startTime = formatInTimeZone(
		start,
		clientTimeZone,
		`${EVENT_TIME_FORMAT_STRING}`,
	);
	
	const startDateFormatted = formatInTimeZone(start,clientTimeZone, `${EVENT_DATE_FORMAT_STRING}`);

	const rawEventDuration = differenceInHours(end, start);
	
	const isEventLongerThanADay = rawEventDuration > TWENTY_FOUR_HOURS;

	const formattedEventDuration = isEventLongerThanADay
		? (rawEventDuration / TWENTY_FOUR_HOURS).toFixed(2) + " day(s)"
		: rawEventDuration.toFixed(2) + " hour(s)";

	const checkInUrl = `/events/${event.id}/checkin`;

	const isCheckinAvailable =
		checkinStart <= currentDateUTC && currentDateUTC <= checkinEnd;

	const checkInMessage = isCheckinAvailable
		? "Ready to check-in? Click here!"
		: isEventPassed
			? "Check-in is closed"
			: `Check-in starts on ${formatInTimeZone(start,clientTimeZone, `${EVENT_TIME_FORMAT_STRING} @${EVENT_DATE_FORMAT_STRING}`)}`;

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
		startDate: startDateFormatted,
		formattedEventDuration,
		checkInUrl,
		checkInMessage,
		eventCalendarLink,
		isEventPassed,
		isCheckinAvailable,
		isEventHappening,
	};
	
	return (
		<div className="mt-2 flex flex-1 flex-col space-y-4 pb-20">
			<div className="flex w-full flex-col items-center justify-center lg:flex-row">
				<h1 className="px-2 py-1 text-center text-2xl font-black sm:text-2xl md:px-8 md:text-3xl lg:text-5xl">
					{event.name}
					{/* <span className="hidden lg:flex">{isEventHappening && <EventDetailsLiveIndicator />}</span> */}
				</h1>
			</div>
			<EventDetailsMobile {...detailsProps} />
			<EventDetailsDefault {...detailsProps} />
		</div>
	);
}
