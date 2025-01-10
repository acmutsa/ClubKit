import NewEventDetails from "@/components/events/id/NewEventDetails";
import Navbar from "@/components/shared/navbar";
import { Suspense } from "react";

export default function Page({ params }: { params: { slug: string } }) {
	return (
		<div className="flex min-h-[100dvh] w-full flex-col">
			<Navbar showBorder />
			<Suspense fallback={<h1>Grabbing the event. One sec...</h1>}>
				<NewEventDetails id={params.slug} />
			</Suspense>
		</div>
	);
}
export const runtime = "edge";
