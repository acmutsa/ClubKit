// This is the main component for the events page
import EventsTitle from "@/components/events/EventsTitle";
import type { SearchParams } from "config";
import EventsOptionsBar from "@/components/events/filters/EventsOptionsBar";
import EventsView from "@/components/events/EventsView";
import { db } from "db";
import { Suspense } from "react";
import Navbar from "@/components/shared/navbar";


export default function EventsPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	// bg-gradient-to-tr from-blue-400 to-muted
	return (
		<div className="flex h-[100dvh] w-screen flex-col items-center no-scrollbar">
			<Navbar />
			<EventsTitle />
			<EventsOptionsBar params={searchParams} />
			<Suspense
				fallback={
					<h1 className="pt-[15%] text-center text-4xl font-bold">
						Grabbing Events. One sec...
					</h1>
				}
			>
				<EventsView params={searchParams} />
			</Suspense>
		</div>
	);
}
export const runtime = "edge";

