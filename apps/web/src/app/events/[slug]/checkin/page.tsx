import EventCheckin from "@/components/events/id/checkin/EventCheckin";
import Navbar from "@/components/shared/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageError from "@/components/shared/PageError";
import { Suspense } from "react";
import { getUserCheckin } from "@/lib/queries";
import { getUTCDate } from "@/lib/utils";
export default function Page({params}: {params: {slug: string}}){

    const { userId: clerkId } = auth();
	if (!clerkId) {
		redirect("/sign-in");
	}

    if (!params?.slug){
        return <PageError message="How did you even access this without a slug???" href="/events" />;
    }

    const currentDateUTC = getUTCDate();

    return (
		<div className="flex h-[100dvh] w-full flex-col">
			<Navbar />
			<Suspense fallback={<h1>Grabbing the Event 1 sec...</h1>}>
                <EventCheckin eventID={params.slug} clerkId={clerkId} currentDateUTC={currentDateUTC} />
            </Suspense>
		</div>
    );
}   
export const runtime = "edge";


  