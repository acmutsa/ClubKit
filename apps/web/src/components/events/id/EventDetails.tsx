import { getEventDetails } from "@/lib/queries";
import PageError from "../../shared/PageError";
import EventDetailsMobile from "./EventDetailsMobile";
import EventDetailsDefault from "./EventDetailsDefault";
import { headers } from "next/headers";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants/shared";
import { getClientTimeZone } from "@/lib/utils";

export default async function EventDetails({ id }: { id: string }) {
	const headerTimeZone = headers().get(VERCEL_IP_TIMEZONE_HEADER_KEY);
	const clientTimeZone = getClientTimeZone(headerTimeZone);
	const event = await getEventDetails(id);

	if (!event) {
		return <PageError message="Event Not Found" href="/events" />;
	}

	// Also, we should display how many points something is worth to entice people to show up for it
	return (
		<div className="mt-2 flex flex-1 flex-col space-y-4 pb-20">
			<h1 className=" px-2 py-1 text-center text-2xl font-black sm:text-2xl md:px-8 md:text-3xl lg:text-5xl">
				{event.name}
			</h1>
			<EventDetailsMobile event={event} clientTimeZone={clientTimeZone} />
			<EventDetailsDefault
				event={event}
				clientTimeZone={clientTimeZone}
			/>
		</div>
	);
}
