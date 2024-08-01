import type { EventAndCategoriesType } from "@/lib/types/events";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import clsx from "clsx";
import EventCategories from "./EventCategories";
import { getDateAndTimeWithTimeZoneString } from "@/lib/utils";

export default function EventCardComponent({ event,isPast,clientTimezone }: { event: EventAndCategoriesType,isPast:boolean,clientTimezone:string }) {

	const {
		thumbnailUrl,
		start,
		id,
	} = event;

  return (
		<Card className="group flex h-full w-full flex-col transition duration-300 ease-in-out hover:shadow-md hover:shadow-slate-400 md:hover:scale-105">
			<CardHeader className="p-0 pb-4 h-full flex justify-center">
				{/* Come back and make sure skeleton loads here or something to ensure no weird layouts */}
					<Image
						src={thumbnailUrl}
						alt="Event Image"
						priority={true}
						width={0}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						height={0}
						quality={100}
						className={clsx("w-full rounded-md", {
							"h-auto grayscale group-hover:grayscale-0": isPast,
						})}
					/>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col w-full p-0 pb-4 justify-end">
				<CardTitle className="w-full truncate whitespace-nowrap px-4 pb-1 text-center font-bold md:px-4 ">
					{event.name}
				</CardTitle>
				<EventCategories
					event={event}
					isPast={isPast}
					className="pb-3 pt-3"
				/>
				<div className="flex w-full justify-center px-2 text-gray-600 md:px-6">
					<p className="text-primary">
						{`${isPast ? "Ended on: " : ""}`}
						{getDateAndTimeWithTimeZoneString(start, clientTimezone)}
					</p>
				</div>
			</CardContent>
			<CardFooter className="flex w-full">
				<Link
					href={`/events/${id}`}
					className="flex h-full w-1/2 flex-row items-center justify-center border-r border-gray-400"
				>
					<h1 className="text-primary">Details</h1>
				</Link>

				<Link
					href={`/events/${id}/checkin`}
					className={clsx(
						"flex h-full w-1/2 flex-row items-center justify-center border-l border-gray-400",
						{
							"pointer-events-none": isPast,
						},
					)}
					aria-disabled={isPast}
					tabIndex={isPast ? -1 : 0}
				>
					<h1
						className={clsx("text-blue-400 dark:text-sky-300", {
							"line-through": isPast,
						})}
					>
						Check-In
					</h1>
				</Link>
			</CardFooter>
		</Card>
  );
}
