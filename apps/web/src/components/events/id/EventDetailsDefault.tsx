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
import EventDetailsLiveIndicator from "../shared/EventDetailsLiveIndicator";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

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
	const width = 500;
	const height = 500;

	const isDescriptionTextCentered = description.length < 50;

	return (
		<div className="hidden flex-col items-center gap-4 overflow-x-hidden pt-7 lg:flex">
			<div className="w-full max-w-[1550px] space-y-4 pl-4 3xl:pl-2">
				<div className="grid w-[98%] grid-cols-2 pb-6">
					<div className="relative flex h-auto w-full flex-col justify-center space-y-4 ">
						<EventImage
							src={thumbnailUrl}
							className="rounded-md"
							width={width}
							height={height}
						/>
						{isEventHappening && (
							<EventDetailsLiveIndicator className="absolute left-3 top-0 z-50" />
						)}
						<EventCategories
							event={event}
							isPast={isEventPassed}
							className={`h-full w-[${width}px] max-w-[${height}px] items-start xl:w-[500px] xl:max-w-[500px]`}
						/>
						<div className="mt-[4%] grid grid-cols-2 gap-4 pr-3">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="text-2xl"
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
										className="text-2xl"
									>
										Reminders
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
									{calendarLinks.map((cal) => (
										<CalendarLink
											calendarName={cal}
											calendarDetails={eventCalendarLink}
											key={cal.title}
										/>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Right side view starts here */}
					<div className="flex flex-col items-center justify-between space-y-6">
						<div className="h-full w-full flex-1 flex-col space-y-3 border-b-2 px-2 pb-4">
							<h2 className="w-full text-center text-2xl font-semibold underline">
								Description
							</h2>
							<p
								className={`w-full ${isDescriptionTextCentered ? "text-center" : "text-start"} text-lg 2xl:text-2xl `}
							>
								{description}
							</p>
						</div>

						<div className="flex h-auto w-full flex-col justify-center gap-2 space-y-1 font-bold md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 3xl:font-medium">
							<div className="grid grid-cols-2">
								<div className="flex items-center justify-start gap-2">
									<Calendar size={24} />
									<p className="flex">{startDate}</p>
								</div>
								<div className="flex items-center justify-start gap-2">
									<Clock size={24} />
									<p className=" flex">{startTime}</p>
								</div>
							</div>
							<div className="grid grid-cols-2">
								<div className="flex items-center justify-start gap-2">
									<Hourglass size={24} />
									<p className="flex">
										{formattedEventDuration}
									</p>
								</div>
								<div className="flex flex-row items-center justify-start gap-2">
									<MapPin size={24} />
									<p className="flex">{location}</p>
								</div>
							</div>

							<div className="grid grid-cols-1">
								<h3>
									Points Gained:{" "}
									<span className="text-blue-400 dark:text-sky-300">
										{event.points}
									</span>{" "}
									pt(s)
								</h3>
							</div>
							<Link
								href={checkInUrl}
								className={clsx(
									"flex h-full flex-row items-center justify-center gap-4 rounded-md bg-blue-400 p-4 dark:bg-sky-300 ",
									{
										"pointer-events-none grayscale":
											isEventPassed ||
											!isCheckinAvailable,
									},
								)}
								aria-disabled={isEventPassed}
								tabIndex={isEventPassed ? -1 : 0}
							>
								<UserRoundCheck size={24} />
								<p className="text-base lg:text-lg xl:text-xl 2xl:text-2xl monitor:text-3xl">
									{checkInMessage}
								</p>
							</Link>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-10">
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
								Checkin In
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
		</div>
	);
}
