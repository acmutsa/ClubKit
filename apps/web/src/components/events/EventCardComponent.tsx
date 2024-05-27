import type { EventType } from "./Events";
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

// Add skeleton to this for data loading purposes
export default function EventCardComponent({ event }: { event: EventType }) {

  return (
    <Card className="flex flex-col w-full transition ease-in-out duration-300 md:hover:scale-105">
      <CardHeader className="w-full flex flex-col items-center my-auto">
        {/* Temp fix for now. Will come back later */}
        <CardTitle className={clsx('text-center',{
          'text-base':event.name.length > 40,
        })}>{event.name}</CardTitle>
        <div className="flex flex-row space-x-3 md:space-x-4 my-auto">
          {event.eventsToCategories.map((category) => {
            // Style is like this for now because of the way tailwind ships, it prevents you from using arbitrary colors that are not known ahead of time
            return (
              <div
                className="rounded-md"
                key={category.category.name}
                style={{ backgroundColor: category.category.color }}>
                <p className="my-1 mx-2 text-sm">{category.category.name}</p>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col w-full space-y-5 p-0 pb-4">
        {/* This will eventually change to the source passed in */}
        <Image
          src={defaultImg}
          alt="Event Image"
          priority
          className="rounded-md"
        />
        <div className="w-full flex justify-start text-gray-600 px-2 md:px-6">
          {event.start.toLocaleString("en-US", {
            hourCycle: "h12",
            dateStyle: "short",
            timeStyle: "short",
          })}
        </div>
      </CardContent>
      <CardFooter className="flex w-full items-end">
        <Link
          href={`/events/${event.id}`}
          className="w-1/2 h-full flex flex-row items-center justify-center border-r border-gray-400">
          <h1 className="text-primary">Details</h1>
        </Link>

        <Link
          href={`/events/${event.id}/checkin`}
          className=" w-1/2 h-full flex flex-row items-center justify-center border-l border-gray-400">
          <h1 className=" text-blue-400">Check-In</h1>
        </Link>
      </CardFooter>
    </Card>
  );
}
