<<<<<<< HEAD
// This is the main component for the events page
import EventsTitle from "@/components/events/EventsTitle";
import type { SearchParams } from "@/lib/types/shared";
import EventsOptionsBar from "@/components/events/filters/EventsOptionsBar";
import EventsView from "@/components/events/EventsView";
import { db } from "db";
import { Suspense } from "react";
import Navbar from "@/components/shared/navbar";
import { headers } from "next/headers";

export default function EventsPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	// bg-gradient-to-tr from-blue-400 to-muted

	console.log('Header timezone: ',headers().get("x-vercel-ip-timezone"));
	console.log('Header from config timezone: ',headers().get('x-timezone'));
=======
import EventsTitle from "@/components/events/EventsTitle";
import EventsOptionsBar from "@/components/events/filters/EventsOptionsBar";
import EventsView from "@/components/events/EventsView";
import { Suspense } from "react";
import Navbar from "@/components/shared/navbar";
import type { SearchParams } from "@/lib/types/shared";
export default function EventsPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {

>>>>>>> dev
	return (
		<div className="flex h-[100dvh] w-screen flex-col items-center no-scrollbar">
			<Navbar showBorder />
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

