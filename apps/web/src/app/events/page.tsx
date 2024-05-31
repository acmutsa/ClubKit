// This is the main component for the events page
import Navbar from "@/components/shared/Navbar";
import EventsTitle from "@/components/events/EventsTitle";
import type { SearchParams } from "config";
import EventsOptionsBar from "@/components/events/filters/EventsOptionsBar";
import EventsView from "@/components/events/EventsView";
import { db } from "db";
import { Suspense } from "react";

export type EventCategory = {
	name: string;
	color: string;
	id: string;
};

type EventsToCategories = {
	eventID: string;
	categoryID: string;
	category: {
		name: string;
		color: string;
	};
};

export type EventType = {
	id: string;
	name: string;
	description: string;
	start: Date;
	end: Date;
	checkinStart: Date;
	checkinEnd: Date;
	location: string;
	isUserCheckinable: boolean;
	isHidden: boolean;
	eventsToCategories: Array<EventsToCategories>;
};

// This is use to create a single source of truth in our filters for the events
export const eventFilters = {
	query: "query",
	card: "card",
	view: "view",
	calendar: "calendar",
	showUpcomingEvents: "upcoming",
	showPastEvents: "past",
	showEvents: "show_events",
	categories: "categories",
};

export default function EventsPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	return (
		<div className="flex h-screen w-screen flex-col items-center">
			{/* <Navbar /> */}
			<EventsTitle />
			<EventsOptionsBar params={searchParams} />
			<Suspense fallback={<div className="w-full bg-red-600 text-center">Loading...</div>}>
				<EventsView params={searchParams} />
			</Suspense>
		</div>
	);
}
export const runtime = "edge";

