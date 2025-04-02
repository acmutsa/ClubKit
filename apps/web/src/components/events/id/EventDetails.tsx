import { getEventDetails } from "@/lib/queries/events";
import PageError from "../../shared/PageError";
import EventImage from "../shared/EventImage";
import { headers } from "next/headers";
import { TWENTY_FOUR_HOURS, ONE_HOUR_IN_MILLISECONDS } from "@/lib/constants";
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
import {
	BellRing,
	Calendar,
	Clock,
	CircleArrowUp,
	Hourglass,
	MapPin,
	MonitorPlay,
	UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StreamingLink from "./StreamingLink";
import CalendarLink from "./CalendarLink";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const {
	streamingLinks,
	calendarLinks,
	events: { checkingInInfo, aboutOrg },
} = c;
import iCalIcon from "../../../../public/img/logos/ical-icon.svg";
import Image from "next/image";
import { ics } from "calendar-link";
import { getRequestContext } from "@cloudflare/next-on-pages";

export default async function EventDetails({
	id,
	isBroswerSafari,
}: {
	id: string;
	isBroswerSafari: boolean;
}) {
	const clientTimeZone = getClientTimeZone(getRequestContext().cf.timezone);
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
	const rawEventDuration =
		(end.getTime() - start.getTime()) / ONE_HOUR_IN_MILLISECONDS;

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
				<div className="flex w-full flex-wrap justify-between gap-8">
					<div className="grow">
						<EventImage
							src={thumbnailUrl}
							className="w-full rounded-md"
							isLive={isEventHappening}
							width={width}
							height={height}
						/>
					</div>
					<div className="grow">
						<div className="flex flex-col justify-between gap-y-8 md:h-full md:py-8">
							<div className="w-full text-left">
								<h2 className="mb-2 w-full text-2xl font-semibold underline">
									Description
								</h2>
								<p
									className={`w-full text-pretty text-lg 2xl:text-2xl `}
								>
									{description}
								</p>
							</div>

							<div className="flex flex-col gap-2 text-base sm:text-lg md:text-xl">
								<EventCategories
									className="justify-start"
									event={event}
									isPast={isEventPassed}
								/>
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

								<div className="flex gap-x-3">
									<CircleArrowUp size={24} />
									<h3>
										<span className="text-blue-500">
											{event.points}
										</span>{" "}
										pt{event.points != 1 ? "s" : ""}
									</h3>
								</div>
							</div>

							<div className="/sm:grid-cols-3 grid w-full grid-cols-1 gap-3">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="default"
											className="text-lg font-normal"
										>
											<div className="flex items-center justify-start gap-1">
												<MonitorPlay size={16} />
												<p>Watch Live</p>
											</div>
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
											variant="default"
											className="text-lg font-normal"
										>
											<div className="flex items-center justify-start gap-3">
												<BellRing size={16} />
												<p>Remind Me</p>
											</div>
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
										{isBroswerSafari ? (
											<Link
												href={ics(eventCalendarLink)}
												target="_blank"
												className="flex w-auto justify-between gap-3 rounded-md px-3 py-2 text-primary-foreground md:max-w-[7.5rem] lg:max-w-none"
											>
												<Image
													src={iCalIcon}
													alt="Calendar Icon"
													height={25}
													width={25}
												/>
												<p className="text-primary md:text-base lg:text-lg 2xl:text-2xl">
													{"iCal"}
												</p>
											</Link>
										) : (
											<a
												href={`/api/ics-calendar?event_id=${id}`}
												target="_blank"
												className="flex w-auto justify-between gap-3 rounded-md px-3 py-2 text-primary-foreground md:max-w-[7.5rem] lg:max-w-none"
												download={`event_${event.id}.ics`}
											>
												<Image
													src={iCalIcon}
													alt="Calendar Icon"
													height={25}
													width={25}
												/>
												<p className="text-primary md:text-base lg:text-lg 2xl:text-2xl">
													{"iCal"}
												</p>
											</a>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
								<Link href={checkInUrl} legacyBehavior>
									<Button
										variant="default"
										className="text-lg font-normal"
									>
										<div className="flex items-center justify-start gap-3">
											<UserRoundCheck size={16} />
											<p>Check In</p>
										</div>
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto grid w-5/6 grid-cols-1 gap-10 md:grid-cols-2">
				<Accordion type="single" collapsible>
					<AccordionItem value="about">
						<AccordionTrigger className="text-3xl font-bold">
							About ACM
						</AccordionTrigger>
						<AccordionContent>
							<p className="border-t border-muted-foreground pl-2 text-xl 2xl:text-2xl">
								{aboutOrg}
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<Accordion type="single" collapsible>
					<AccordionItem value="Check-In">
						<AccordionTrigger className="text-3xl font-bold">
							Checking In
						</AccordionTrigger>
						<AccordionContent>
							<p className="border-t border-muted-foreground text-xl 2xl:text-2xl">
								{checkingInInfo}
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
