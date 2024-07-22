import EventsTitle from "@/components/events/EventsTitle";
import EventsOptionsBar from "@/components/events/filters/EventsOptionsBar";
import EventsView from "@/components/events/EventsView";
import { Suspense } from "react";
import Navbar from "@/components/shared/navbar";
import { headers } from "next/headers";
import type { SearchParams } from "@/lib/types/shared";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants/shared";
export default function EventsPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {

	console.log('Header timezone: ',headers().get(VERCEL_IP_TIMEZONE_HEADER_KEY));
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

