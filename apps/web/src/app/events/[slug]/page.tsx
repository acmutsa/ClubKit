import EventDetails from "@/components/events/EventDetails";
import Navbar from "@/components/shared/navbar";
import { Suspense } from "react";
export default async function Page({ params }: { params: { slug: string } }) {
  return (
		<div className="flex min-h-[100dvh] w-full flex-col">
			<Navbar />
			<Suspense fallback={<h1>Grabbing the Event 1 sec.....</h1>}>
        <EventDetails id={params.slug} />
      </Suspense>
		</div>
  );
}