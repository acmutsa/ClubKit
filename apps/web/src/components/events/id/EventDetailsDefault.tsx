import Link from "next/link";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import c from "config";
import EventCategories from "../EventCategories";
import { MapPin, Clock, Calendar, Hourglass } from "lucide-react";
import StreamingLink from "./StreamingLink";
import CalendarLink from "./CalendarLink";
import { UserRoundCheck } from "lucide-react";
import { DetailsProps } from "@/lib/types/events";
import EventImage from "../shared/EventImage";
export default function EventDetailsDefault(detailsProps: DetailsProps) {

	const {
		streamingLinks,
		calendarLinks,
		events: { 
			checkingInInfo, aboutOrg 
		},
	} = c;

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

	const { thumbnailUrl, location, description, points } = event;

	return (
		<div className="hidden flex-col items-center gap-4 overflow-x-hidden pt-7 lg:flex">
			<div className="grid w-[98%] grid-cols-2">
				<div className="flex w-full flex-col items-center justify-center space-y-4 ">
					<EventImage
						src={thumbnailUrl}
						className="h-[500px] w-[500px] rounded-md"
					/>
					<EventCategories
						event={event}
						isPast={isEventPassed}
						className="h-full w-[350px] max-w-[350px] items-start xl:w-[500px] xl:max-w-[500px]"
					/>
				</div>

				{/* Description starts here */}
				<div className="flex flex-col items-center justify-between">
					<p className="w-full text-start text-lg 2xl:text-2xl ">
						{description}
					</p>
					<div className="flex h-auto w-full flex-col justify-center gap-2 font-bold md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 3xl:font-medium">
						<div className="flex items-center justify-start gap-2">
							<Calendar size={24} />
							<p className="flex">{startDate}</p>
						</div>
						<div className="flex items-center justify-start gap-2">
							<Clock size={24} />
							<p className=" flex">{startTime}</p>
						</div>
						<div className="flex items-center justify-start gap-2">
							<Hourglass size={24} />
							<p className="flex">{formattedEventDuration}</p>
						</div>
						<div className="flex flex-row items-center justify-start gap-2">
							<MapPin size={24} />
							<p className="flex">{location}</p>
						</div>

						<div className="flex w-full flex-row items-center ">
							<h3>
								Points Gained:{" "}
								<span className="text-sky-500">
									{points} Point(s)
								</span>
							</h3>
						</div>
					</div>
				</div>
			</div>

			{/* New layout */}
			<div className="flex h-auto w-full flex-col gap-20 pt-10">
				<div className="ml-2 flex h-full w-full flex-row justify-evenly gap-4 2xl:justify-around">
					<div className="flex h-full flex-row items-center justify-center gap-12">
						{/* Streaming on div */}
						<div className="flex flex-col items-center justify-center gap-5">
							<h1 className="text-2xl font-bold xl:text-3xl">
								Where to Watch
							</h1>
							<div className="flex flex-wrap items-center justify-center gap-5">
								{streamingLinks.map((link) => (
									<StreamingLink
										title={link.title}
										href={link.href}
										key={link.title}
									/>
								))}
							</div>
						</div>
						<div className="flex flex-col items-center justify-center gap-5">
							<h1 className="text-2xl font-bold xl:text-3xl">
								Reminders
							</h1>
							<div className="flex w-full flex-wrap items-center justify-center gap-5">
								{calendarLinks.map((cal) => (
									<CalendarLink
										calendarName={cal}
										calendarDetails={eventCalendarLink}
										key={cal.title}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
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
							"flex min-w-[70%] items-center gap-4 bg-blue-400 p-6 dark:bg-sky-300",
							{
								"pointer-events-none grayscale":
									isEventPassed || !isCheckinAvailable,
							},
						)}
					>
						<UserRoundCheck size={24} />
						<p className="text-base lg:text-lg xl:text-xl 2xl:text-2xl monitor:text-3xl">
							{checkInMessage}
						</p>
					</Button>
				</Link>
			</div>
			<div className="flex w-[98%] flex-row items-start justify-between gap-20 px-10 pt-10 xl:w-[90%]">
				<div className="flex flex-col items-start justify-center gap-1">
					<h1 className="text-3xl font-bold">About ACM</h1>
					<p className="border-t border-muted-foreground pl-2 text-xl 2xl:text-2xl">
						{aboutOrg}
					</p>
				</div>
				<div className="flex flex-col items-start justify-center gap-1">
					<h1 className="text-3xl font-bold">Checking-in</h1>
					<p className="border-t border-muted-foreground pl-2 text-xl 2xl:text-2xl">
						{checkingInInfo}
					</p>
				</div>
			</div>
		</div>
	);
}
