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
import { DetailsProps } from "@/lib/types/events";
import EventDetailsLiveIndicator from "../shared/EventDetailsLiveIndicator";
export default function EventDetailsDefault(detailsProps: DetailsProps) {

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

	const { thumbnailUrl, location, description, points } = event;

	return (
		<div className="hidden flex-col items-center gap-4 lg:flex">
			<div className="flex w-full flex-row items-center justify-center xl:w-[90%]">
				<div className="flex flex-col items-start justify-center xl:w-1/2 ">
					<Image
						src={thumbnailUrl}
						alt="Event Image"
						priority={true}
						width={0}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						height={0}
						quality={100}
						className="h-auto w-[350px] max-w-[350px] rounded-md xl:w-[500px] xl:max-w-[500px]"
					/>
					<EventCategories
						event={event}
						isPast={isEventPassed}
						className="h-full w-[350px] max-w-[350px] items-start pt-3 xl:w-[500px] xl:max-w-[500px]"
					/>
				</div>
				<div className="flex h-full w-3/4 flex-col gap-12">
					<p className="w-full md:text-sm lg:text-base xl:text-lg 2xl:text-xl">
						{description}
					</p>
					<div className="flex h-full w-full flex-row items-start justify-between">
						<div className="flex flex-col gap-2 md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
							<div className="flex items-center justify-start gap-3">
								<MapPin size={24} />
								<p className="flex">{location}</p>
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
										{points} Point(s)
									</span>
								</h3>
							</div>
						</div>
						<div className="flex h-full w-1/2 flex-col items-center justify-center gap-6">
							{/* Streaming on div */}
							<div className="flex w-full flex-col items-center justify-center gap-5">
								<h1 className="text-3xl font-bold">
									Streaming on...
								</h1>
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
								<h1 className="text-3xl font-bold">
									Need a Reminder?
								</h1>
								<div className="flex w-full flex-row flex-wrap items-center justify-center gap-5">
									{calendarLinks.map((cal) => (
										<CalendarLink
											calendarName={cal}
											calendarDetails={eventCalendarLink}
											key={cal}
										/>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
				<Link
					href={checkInUrl}
					className={clsx(
						"flex h-full w-3/4 flex-row items-center justify-center",
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
							"flex items-center gap-4 bg-blue-400 p-6 dark:bg-sky-300",
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

			<div className="flex w-full flex-row items-start justify-between gap-20 px-10 pt-10">
				<div className="flex flex-col items-start justify-center gap-1">
					<h1 className="text-3xl font-bold">About ACM</h1>
					<p className="border-t border-muted-foreground pl-1 text-xl 2xl:text-2xl">
						{aboutOrg}
					</p>
				</div>
				<div className="flex flex-col items-start justify-center gap-1">
					<h1 className=" text-3xl font-bold">Checking In</h1>
					<p className="border-t border-muted-foreground pl-1 text-xl">
						{checkingInInfo}
					</p>
				</div>
			</div>
		</div>
	);
}
