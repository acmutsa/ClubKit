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
	// bg-gradient-to-tr from-blue-400 to-muted
	return (
		<div className="flex min-h-screen w-screen flex-col items-center ">
			{/* <Navbar /> */}
			<EventsTitle />
			<EventsOptionsBar params={searchParams} />
			<Suspense
				fallback={
						<h1 className="font-bold text-4xl text-center pt-[15%]">Grabbing Events. One sec...</h1>
				}>
				<EventsView params={searchParams} />
			</Suspense>
		</div>
	);
}
export const runtime = "edge";

