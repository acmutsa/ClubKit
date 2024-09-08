import Link from "next/link";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import c from "config";
import EventCategories from "../EventCategories";
import { MapPin, Clock, Calendar, Hourglass } from "lucide-react";
import StreamingLink from "./StreamingLink";
import CalendarLink from "./CalendarLink";
import { UserRoundCheck } from "lucide-react";
import type { DetailsProps } from "@/lib/types/events";
import EventDetailsLiveIndicator from "../shared/EventDetailsLiveIndicator";
import EventImage from "../shared/EventImage";

export default function EventDetailsMobile(detailsProps: DetailsProps) {
	const { streamingLinks, calendarLinks, checkingInInfo, aboutOrg } = c;

	const {
		event,
		checkInMessage,
		checkInUrl,
		eventCalendarLink,
		startTime,
		startDate,
		formattedEventDuration,
		isCheckinAvailable,
		isEventPassed,
		isEventHappening,
	} = detailsProps;

	return (
		<div className="flex flex-col space-y-4 lg:hidden">
			<div className="relative flex h-auto w-full items-center justify-center">
				<EventImage
					src={event.thumbnailUrl}
					className={clsx("h-auto w-1/2 rounded-md", {})}
				/>
				{isEventHappening && (
					<EventDetailsLiveIndicator className="absolute left-[26%] top-1 z-50" />
				)}
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-5">
				<EventCategories event={event} isPast={isEventPassed} />
				<div className="flex flex-col gap-2 text-base sm:text-lg md:text-xl">
					<div className="flex items-center justify-start gap-3">
						<MapPin size={24} />
						<p className=" flex">{event.location}</p>
					</div>
					<div className="flex items-center justify-start gap-3">
						<Clock size={24} />
						<p className=" flex">{startTime}</p>
					</div>
					<div className="flex items-center justify-start gap-3">
						<Hourglass size={24} />
						<p className="flex">{formattedEventDuration}</p>
					</div>
					<div className="flex items-center justify-start gap-3">
						<Calendar size={24} />
						<p className="flex">{startDate}</p>
					</div>
					<div>
						<h3>
							Points Gained:{" "}
							<span className="text-sky-500">
								{event.points} Point(s)
							</span>
						</h3>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-center">
				<div className="flex w-full flex-col items-center justify-center gap-y-1 px-7 pb-6 pt-2">
					<h1 className="w-1/2 border-b border-muted-foreground text-center text-xl font-bold">
						Description
					</h1>
					<p className="text-base md:w-3/4">{event.description}</p>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
				<Link
					href={checkInUrl}
					className={clsx(
						"flex h-full w-full flex-row items-center justify-center",
						{
							"pointer-events-none":
								isEventPassed || !isCheckinAvailable,
						},
					)}
					aria-disabled={isEventPassed}
					tabIndex={isEventPassed ? -1 : 0}
				>
					<Button
						className={clsx(
							"flex min-w-[60%] items-center gap-4 bg-blue-400 p-5 dark:bg-sky-300 md:min-w-[50%]",
							{
								"pointer-events-none grayscale":
									isEventPassed || !isCheckinAvailable,
							},
						)}
					>
						<UserRoundCheck size={24} />
						<p className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl">
							{checkInMessage}
						</p>
					</Button>
				</Link>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-5 pt-5">
				<h1 className="text-xl font-bold">Where to Watch</h1>
				<div className="flex w-full flex-row items-center justify-center gap-5">
					{streamingLinks.map((link) => (
						<StreamingLink
							title={link.title}
							href={link.href}
							key={link.title}
						/>
					))}
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-5">
				<h1 className="text-xl font-bold">Reminders</h1>
				<div className="flex w-full flex-row flex-wrap items-center justify-center gap-6 px-3">
					{calendarLinks.map((cal) => (
						<CalendarLink
							calendarName={cal}
							calendarDetails={eventCalendarLink}
							key={cal.title}
						/>
					))}
				</div>
			</div>
			<div className="flex flex-col items-center justify-center gap-1 pt-8">
				<div className="w-full px-[8%]">
					<h1 className="border-b border-muted-foreground text-left text-xl font-bold">
						About ACM
					</h1>
				</div>
				<p className="w-[85%] px-[9px] md:px-3">{aboutOrg}</p>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-1 pt-8">
				<div className="w-full px-[8%]">
					<h1 className="border-b border-muted-foreground text-left text-xl font-bold">
						Checking In
					</h1>
				</div>
				<p className="w-[85%] px-[9px] md:px-3">{checkingInInfo}</p>
			</div>
		</div>
	);
}
