import EventDetails from "@/components/events/id/EventDetails";
import Navbar from "@/components/shared/navbar";
import { Suspense } from "react";
import { headers } from "next/headers";

export default function Page({ params }: { params: { slug: string } }) {
	const userAgent = headers().get("user-agent")?.toLowerCase();
	const isBroswerSafari =
		(userAgent?.includes("safari") &&
			!userAgent?.includes("crios") &&
			!userAgent.includes("chrome")) ||
		false;

	return (
		<div className="flex min-h-[100dvh] w-full flex-col">
			<Navbar showBorder />
			<Suspense fallback={<h1>Grabbing the event. One sec...</h1>}>
				<EventDetails
					id={params.slug}
					isBroswerSafari={isBroswerSafari || false}
				/>
			</Suspense>
		</div>
	);
}
export const runtime = "edge";
