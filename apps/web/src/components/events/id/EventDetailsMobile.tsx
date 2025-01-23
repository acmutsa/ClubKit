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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EventDetailsMobile(detailsProps: DetailsProps) {
	const {
		streamingLinks,
		calendarLinks,
		events: { checkingInInfo, aboutOrg },
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

	return (
		<div className="flex flex-col space-y-4 lg:hidden">
			<div className="flex w-full items-center justify-center">
				<div className="relative">
					<EventImage
						src={event.thumbnailUrl}
						className="rounded-md"
						width={300}
						height={300}
					/>
					{isEventHappening && (
						<EventDetailsLiveIndicator className="absolute left-3 top-2 z-50" />
					)}
				</div>
			</div>

			<div className="flex w-full flex-col items-center justify-center gap-5">
				<EventCategories event={event} isPast={isEventPassed} />
				<div className="flex flex-col gap-2 text-base sm:text-lg md:text-xl">
					<div className="flex items-center justify-start gap-3">
						<Calendar size={24} />
						<p className="flex">{startDate}</p>
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
			</div>

			<Accordion type="single" collapsible className="px-[8%] py-[4%]">
				<AccordionItem value="description">
					<AccordionTrigger>Description</AccordionTrigger>
					<AccordionContent>
						<p className="w-[85%] pl-[9px] md:px-3">
							{event.description}
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<div className="my-10 flex flex-col items-center justify-center">
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

			<div className="flex w-full flex-row items-center justify-center gap-6 py-[5%]">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="w-40" variant="outline">
							Where to Watch
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-40">
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
						<Button className="w-40" variant="outline">
							Reminders
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-40">
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

			<Accordion type="single" collapsible className="px-[8%]">
				<AccordionItem value="description">
					<AccordionTrigger>About ACM</AccordionTrigger>
					<AccordionContent>
						<p className="w-[85%] pl-[9px] md:pl-3">{aboutOrg}</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<Accordion type="single" collapsible className="px-[8%]">
				<AccordionItem value="description">
					<AccordionTrigger>Checking In</AccordionTrigger>
					<AccordionContent>
						<p className="w-[85%] pl-[9px] md:pl-3">
							{checkingInInfo}
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
