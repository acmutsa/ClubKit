import type { EventType } from "./filters/EventsOptionsBar";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import defaultImg from "../../../public/img/test_image.webp";
import clsx from "clsx";
import { Badge } from "../ui/badge";
import c from "config"
export default function EventCardComponent({ event,isPast }: { event: EventType,isPast:boolean }) {
	// Should this be in suspense bc of the pictures? 
  return (
		<Card className="group flex h-full w-full flex-col transition duration-300 ease-in-out hover:shadow-md hover:shadow-slate-400 md:hover:scale-105">
			{/* flex w-full flex-col items-center */}
			<CardHeader className="flex w-full flex-col items-center p-0 pb-4">
				<div className="flex h-auto w-full">
					<Image
						src={event.thumbnailUrl}
						alt="Event Image"
						priority={true}
						width={0}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						height={0}
						quality={75}
						className={clsx("h-auto w-full rounded-md", {
							"h-auto grayscale group-hover:grayscale-0": isPast,
						})}
						// placeholder="blur"
					/>
				</div>
			</CardHeader>
			<CardContent className="flex w-full flex-col p-0 pb-4">
				{/* This will eventually change to the source passed in */}
				<CardTitle className="w-full truncate whitespace-nowrap px-4 pb-1 text-center font-bold md:px-2 ">
					{event.name}
				</CardTitle>
				<div className="flex w-full flex-row items-center justify-center space-x-3 pb-6 pt-2 md:space-x-4">
					{event.eventsToCategories.length > 0 ? (
						event.eventsToCategories.map((category) => {
							// Style is like this for now because of the way tailwind ships, it prevents you from using arbitrary colors that are not known ahead of time
							return (
								<Badge
									key={category.category.name}
									style={{
										backgroundColor:
											category.category.color,
									}}
								>
									<h1 className="text-sm text-muted ">
										{category.category.name}
									</h1>
								</Badge>
							);
						})
					) : (
						<Badge>
							<h1 className="text-sm">{c.clubName}</h1>
						</Badge>
					)}
					{isPast && (
						<Badge className="bg-red-400 hover:bg-red-400">
							<h1 className="text-sm">Past</h1>
						</Badge>
					)}
				</div>
				<div className="flex w-full justify-center px-2 text-gray-600 md:px-6">
					<p className="text-primary">
						{`${isPast ? "Ended on: " : ""}`}
						{event.start.toLocaleString("en-US", {
							hourCycle: "h12",
							dateStyle: "medium",
							timeStyle: "short",
						})}
					</p>
				</div>
			</CardContent>
			<CardFooter className="flex w-full items-end">
				<Link
					href={`/events/${event.id}`}
					className="flex h-full w-1/2 flex-row items-center justify-center border-r border-gray-400"
				>
					<h1 className="text-primary">Details</h1>
				</Link>

				<Link
					href={`/events/${event.id}/checkin`}
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
