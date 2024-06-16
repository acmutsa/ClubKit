import { db,eq } from "db";
import { events } from "db/schema";
import c from "config";
import Image from "next/image";
import clsx from "clsx";
import { Button } from "../ui/button";
import EventCategories from "./EventCategories";
import { getEventDetails } from "@/lib/queries";
import { MapPin,Clock,Calendar,Hourglass } from "lucide-react";
import { format } from "path";
import { unstable_noStore as no_store } from "next/cache";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

export default async function EventDetails({id}:{id:string}) {
  const aboutACM ="ACM is the premier organization on campus for students interested in technology. ACM is dedicated to providing members with opportunities for professional, academic, and social growth outside the classroom in order to prepare students for their career in tech or fuel their interest in the tech field. Anyone who has an interest in technology can join ACM.";
  const checkingIn = 'The membership portal is ACM\'s new method of tracking member check-ins and awarding points. By simply visiting this page during the event and clicking the Check-in button, you can easily garner points towards your membership for the semester.Share this event\'s check-in page quickly using this QR Code:'


    no_store();
    const event = await getEventDetails(id);
    
  if (!event){
    return <EventNotFound/>;
  }
  const currentDate = new Date();
  console.log(event);
  const isPast = event.start <= currentDate;
  // Make sure that this is converting properly
  const startTime = event.start.toLocaleString(undefined, {
		hourCycle: "h12",
		hour:"numeric",
    minute:"2-digit",
    timeZoneName:"short"
  });

  const startDate = event.start.toDateString();
  
  const rawEventDuration =
		(event.end.getHours() - event.start.getHours() / 1000 / 3600);
  
  const isEventLongerThanADay = rawEventDuration > 24;
  
  const formattedEventDuration = isEventLongerThanADay
		? (rawEventDuration / 24).toFixed(2) + " day(s)"
		: rawEventDuration.toFixed(2) + " hour(s)";

  const checkInUrl = `events/${event.id}/checkin`;
  
  const checknAvailabile = event.checkinStart <= currentDate && currentDate<= event.checkinEnd;

  const checkInMessage = checknAvailabile 
  ? "Ready to check in? Click here!" : (isPast) ? "Check-in is closed":
  `Check-in starts at ${event.checkinStart.toLocaleString(undefined, {
    hourCycle: "h12",
    hour:"numeric",
    minute:"2-digit",
    timeZoneName:"short"
  })}`;

  const googleCalLink = "https://www.google.com/";
  const icalLink = "https://www.google.com/";

  // Also, we should display how many points something is worth to entice people to show up for it 
  return (
		<div className="mt-2 flex flex-1 flex-col space-y-4 pb-20">
			<h1 className=" py-1 text-center text-2xl font-black sm:text-2xl md:text-3xl lg:text-5xl">
				{event.name}
			</h1>
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
			<div className="flex w-full flex-col items-center justify-center gap-4">
				<EventCategories event={event} isPast={isPast} />
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
				<div className="flex w-full items-center justify-center px-7 pb-6">
					<p className="text-center font-bold">{event.description}</p>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
				<Link
					href={checkInUrl}
					className={clsx(
						"flex h-full w-1/2 flex-row items-center justify-center",
						{
							"pointer-events-none": isPast,
						},
					)}
					aria-disabled={isPast}
					tabIndex={isPast ? -1 : 0}
				>
					<Button
						className={clsx("bg-blue-400 dark:bg-sky-300", {
							grayscale: isPast || !checknAvailabile,
						})}
					>
						{checkInMessage}
					</Button>
				</Link>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-5 pt-5">
				<h1 className="text-xl font-bold">Streaming on...</h1>
				<div className="flex w-full flex-row items-center justify-center gap-5">
					<Link href="https://www.youtube.com/@acmutsa/streams">
						<Button className=" bg-red-400 text-slate-100">
							Youtube
						</Button>
					</Link>
					<Link href="https://www.twitch.tv/acmutsa">
						<Button className="bg-purple-400 text-slate-100">
							Twitch
						</Button>
					</Link>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-5">
				<h1 className="text-xl font-bold">Need a Reminder?</h1>
				<div className="flex w-full flex-row items-center justify-center gap-5">
					<Link href={googleCalLink}>
						<Button>Google Calendar</Button>
					</Link>
          <Link href={icalLink}>
          <Button>
            iCal
          </Button>
          </Link>
				</div>
			</div>
      <div className="flex w-full flex-col items-center justify-center gap-1 pt-8">
        <h1 className="text-xl font-bold border-b-2">About ACM</h1>
        <p className=" px-7">{aboutACM}</p>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-1 pt-8">
        <h1 className="text-xl font-bold border-b-2">Checking In</h1>
        <p className=" px-7">{checkingIn}</p>
        </div>
		</div>
  );
}

const EventNotFound = () =>{

  return (
		<div className="flex w-full flex-1 flex-col items-center space-y-5 md:justify-center">
			<h1 className="text-center text-6xl font-black">Event Not Found</h1>
			<p className="text-center">
				{"If you think this is a mistake, please email: "}
				<span>
					<a
						className="text-center underline"
						href={`mailto:${c.contactEmail}`}
					>
						{`${c.contactEmail}`}
					</a>
				</span>
			</p>
		</div>
  );

}