import type { EventType } from "config";
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
import { Separator } from "../ui/separator";



export default function EventCardComponent({ event }: { event: EventType }) {



  return (
    <Card className="flex flex-col items-center w-full">
      <CardHeader className="w-full flex flex-col justify-center items-center space-y-5">
        <CardTitle className="text-center">{event.name}</CardTitle>
        <div className="flex flex-row space-x-4">
          {event.orgs.map((org) => {
            // Style is like this for now because of the way tailwind ships, it prevents you from using arbitrary colors that are not known ahead of time
            return (
              <div
                className="rounded-md"
                key={org.name}
                style={{ backgroundColor: org.color }}>
                <p className="my-1 mx-2">{org.name}</p>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col w-full space-y-5">
        {/* This will eventually change to the source passed in */}
        {/* Also look into aspect ratio stuff */}
        <Image
          src="/img/logos/acm.svg"
          width={0}
          height={0}
          alt="Event Image"
          className="h-auto w-28 self-center"
        />
        <div className="w-full flex justify-start text-gray-600">
          <p>
            {event.start.toLocaleString("en-GB", {
              timeZone: "CST",
              hourCycle: "h12",
            })}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex w-full justify-between">
        <Link
          href={`/events/${event.id}`}
          className="w-1/2 h-full flex flex-row items-center justify-center border-r border-gray-400">
          <h1 className=" text-primary">Details</h1>
        </Link>

        <Link
          href={`/events/${event.id}/checkin`}
          className=" w-1/2 h-full flex flex-row items-center justify-center border-l border-gray-400">
          <h1 className="text-primary">Check-In</h1>
        </Link>
      </CardFooter>
    </Card>
  );
}
