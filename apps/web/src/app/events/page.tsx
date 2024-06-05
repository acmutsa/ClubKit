// This is the main component for the events page
import Navbar from "@/components/shared/Navbar";
import EventsTitle from "@/components/events/EventsTitle";
import type { SearchParams } from "config";
import EventsOptionsBar from "@/components/events/filters/EventsOptionsBar";
import EventsView from "@/components/events/EventsView";
import { db } from "db";
import { Suspense } from "react";



export default function EventsPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	return (
		<div className="flex min-h-screen w-screen flex-col items-center">
			{/* <Navbar /> */}
			<EventsTitle />
			<EventsOptionsBar params={searchParams} />
			<Suspense fallback={<div className="w-full flex flex-row h-full items-center justify-center text-center font-bold">Grabbing Events. One sec...</div>}>
				<EventsView params={searchParams} />
			</Suspense>
		</div>
	);
}
export const runtime = "edge";

