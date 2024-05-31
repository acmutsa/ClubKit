import type { EventType } from "@/app/events/page";
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
// Add skeleton to this for data loading purposes
export default function EventCardComponent({ event }: { event: EventType }) {

  return (
		<Card className="flex w-full flex-col transition duration-300 ease-in-out md:hover:scale-105">
			<CardHeader className="flex w-full flex-col items-center">
				<CardTitle className="w-full truncate whitespace-nowrap pb-1 text-center font-bold">
					{event.name}
				</CardTitle>
				<div className="flex w-full flex-row items-center justify-center space-x-3 pt-2 md:space-x-4">
					{event.eventsToCategories.map((category) => {
						// Style is like this for now because of the way tailwind ships, it prevents you from using arbitrary colors that are not known ahead of time
						return (
							// style={{ color: category.category.color }}
							<Badge key={category.category.name}>
								<h1 className="text-sm ">
									{category.category.name}
								</h1>
							</Badge>
						);
					})}
				</div>
			</CardHeader>
			<CardContent className="flex w-full flex-col p-0 pb-4">
				{/* This will eventually change to the source passed in */}
				<Image
					src={defaultImg}
					alt="Event Image"
					priority
					className="rounded-md"
				/>
				<div className="flex w-full justify-start px-2 text-gray-600 md:px-6">
					<p className="text-primary">
						{event.start.toLocaleString("en-US", {
							hourCycle: "h12",
							dateStyle: "short",
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
					className=" flex h-full w-1/2 flex-row items-center justify-center border-l border-gray-400"
				>
					<h1 className=" text-blue-400">Check-In</h1>
				</Link>
			</CardFooter>
		</Card>
  );
}
