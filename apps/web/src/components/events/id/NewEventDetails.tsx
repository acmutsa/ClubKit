import { getEventDetails } from "@/lib/queries/events";
import PageError from "../../shared/PageError";
import EventImage from "../shared/EventImage";
import { headers } from "next/headers";
import {
	VERCEL_IP_TIMEZONE_HEADER_KEY,
	TWENTY_FOUR_HOURS,
} from "@/lib/constants";
import c from "config";
import {
	getClientTimeZone,
	getUTCDate,
	isEventCurrentlyHappening,
} from "@/lib/utils";
import { differenceInHours, isAfter } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
	EVENT_DATE_FORMAT_STRING,
	EVENT_TIME_FORMAT_STRING,
} from "@/lib/constants/events";
import EventDetailsLiveIndicator from "../shared/EventDetailsLiveIndicator";
import EventCategories from "../EventCategories";
import { Calendar, Clock, Hourglass, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StreamingLink from "./StreamingLink";
import CalendarLink from "./CalendarLink";

const {
	streamingLinks,
	calendarLinks,
	events: { checkingInInfo, aboutOrg },
} = c;

export default async function NewEventDetails({ id }: { id: string }) {
	const headerTimeZone = headers().get(VERCEL_IP_TIMEZONE_HEADER_KEY);
	const clientTimeZone = getClientTimeZone(headerTimeZone);
	const event = await getEventDetails(id);

	if (!event) {
		return <PageError message="Event Not Found" href="/events" />;
	}
	const { start, end, checkinStart, checkinEnd } = event;
	const currentDateUTC = getUTCDate();
	const isEventPassed = isAfter(currentDateUTC, end);
	const isEventHappening = isEventCurrentlyHappening(
		currentDateUTC,
		start,
		end,
	);

	const startTime = formatInTimeZone(
		start,
		clientTimeZone,
		`${EVENT_TIME_FORMAT_STRING}`,
	);

	const startDateFormatted = formatInTimeZone(
		start,
		clientTimeZone,
		`${EVENT_DATE_FORMAT_STRING}`,
	);

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
			: `Check-in starts on ${formatInTimeZone(start, clientTimeZone, `${EVENT_TIME_FORMAT_STRING} @${EVENT_DATE_FORMAT_STRING}`)}`;

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

	const { thumbnailUrl, location, description, points } = event;
	const width = 500;
	const height = 500;

	return (
		<div className="mt-2 flex flex-1 flex-col space-y-4 pb-20">
			<h1 className="px-2 py-4 text-center text-2xl font-black sm:text-2xl md:px-8 md:text-3xl lg:text-5xl">
				{event.name}
			</h1>
			<div className="mx-auto flex w-5/6 items-center">
				<div className="flex w-full justify-between">
					<div className="">
						<EventImage
							src={thumbnailUrl}
							className="rounded-md"
							isLive={isEventHappening}
							width={width}
							height={height}
						/>
					</div>
					<div className="w-1/2">
						<div className="flex h-full w-full grow flex-col justify-evenly">
							<EventCategories
								className="justify-start"
								event={event}
								isPast={isEventPassed}
							/>
							<div className="flex flex-col gap-2 text-base sm:text-lg md:text-xl">
								<div className="flex items-center justify-start gap-3">
									<Calendar size={24} />
									<p className="flex">{startDateFormatted}</p>
								</div>
								<div className="flex items-center justify-start gap-3">
									<Clock size={24} />
									<p className=" flex">{startTime}</p>
								</div>
								<div className="flex items-center justify-start gap-3">
									<Hourglass size={24} />
									<p className="flex">
										{formattedEventDuration}
									</p>
								</div>

								<div className="flex items-center justify-start gap-3">
									<MapPin size={24} />
									<p className=" flex">{event.location}</p>
								</div>

								<div>
									<h3>
										Points Gained:{" "}
										<span className="text-blue-500">
											{event.points}
										</span>{" "}
										pt(s)
									</h3>
								</div>
							</div>
							<div className="w-full">
								<h2 className="w-full text-2xl font-semibold underline">
									Description
								</h2>
								<p
									className={`w-full text-pretty text-lg 2xl:text-2xl `}
								>
									{description}
								</p>
							</div>
							<div className="grid w-full ">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="text-xl"
										>
											Where to Watch
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
										{streamingLinks.map((link) => (
											<StreamingLink
												title={link.title}
												href={link.href}
												key={link.title}
											/>
										))}
									</DropdownMenuContent>
								</DropdownMenu>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="text-xl"
										>
											Reminders
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
										{calendarLinks.map((cal) => (
											<CalendarLink
												calendarName={cal}
												calendarDetails={
													eventCalendarLink
												}
												key={cal.title}
											/>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</div>
				</div>
				<div></div>
			</div>
		</div>
	);
}
