import EventCheckin from "@/components/events/id/checkin/EventCheckin";
import Navbar from "@/components/shared/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import EventError from "@/components/events/shared/EventError";
import { Suspense } from "react";

export default function Page({params}: {params: {slug: string}}){

    const { userId } = auth();
	if (!userId) {
		redirect("/sign-in");
	}

    // This case should never be a thing, but just in case...
    if (!params?.slug){
        return <EventError message="Event Not Found" />;
    }

    return (
		<div className="flex h-[100dvh] w-full flex-col">
			<Navbar />
			<Suspense fallback={<h1>Grabbing the Event 1 sec...</h1>}>
                <EventCheckin id={params.slug} />
            </Suspense>
		</div>
    );
}   


  