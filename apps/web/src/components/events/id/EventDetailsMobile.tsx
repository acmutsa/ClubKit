import Image from "next/image";
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
	} = detailsProps;

	return (
		<div className="flex flex-col space-y-4 lg:hidden">
			<div className="flex h-auto w-full items-center justify-center">
				<Image
					src={event.thumbnailUrl}
					alt="Event Image"
					priority={true}
					width={0}
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					height={0}
					quality={75}
					className={clsx("h-auto w-1/2 rounded-md", {})}
				/>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-5">
				<EventCategories event={event} isPast={isEventPassed} />
				<div className="flex flex-col gap-2">
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
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-center">
				{/* Might want to consider a scrollview for this if it gets too long? */}
				<div className="flex w-full flex-col items-center justify-center px-7 pb-6 pt-2">
					<p className="text-center">{event.description}</p>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
				<Link
					href={checkInUrl}
					className={clsx(
						"flex h-full w-1/2 flex-row items-center justify-center",
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
							"flex items-center gap-4 bg-blue-400 p-5 dark:bg-sky-300",
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
				<h1 className="text-xl font-bold">Streaming on...</h1>
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
				<h1 className="text-xl font-bold">Need a Reminder?</h1>
				<div className="flex w-full flex-row flex-wrap items-center justify-center gap-6 px-3">
					{calendarLinks.map((cal) => (
						<CalendarLink
							calendarName={cal}
							calendarDetails={eventCalendarLink}
							key={cal}
						/>
					))}
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-1 pt-8">
				<h1 className="border-b border-muted-foreground text-xl font-bold">
					About ACM
				</h1>
				<p className=" px-7 text-center">{aboutOrg}</p>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-1 pt-8">
				<h1 className="border-b border-muted-foreground text-xl font-bold">
					Checking In
				</h1>
				<p className="px-7 text-center">{checkingInInfo}</p>
			</div>
		</div>
	);
}
