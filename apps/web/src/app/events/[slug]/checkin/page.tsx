import EventCheckin from "@/components/events/id/checkin/EventCheckin";
import Navbar from "@/components/shared/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageError from "@/components/shared/PageError";
import { Suspense } from "react";
<<<<<<< HEAD
import { getUserCheckin } from "@/lib/queries";
=======
import { getUTCDate } from "@/lib/utils";
>>>>>>> dev
export default function Page({params}: {params: {slug: string}}){

    const { userId: clerkId } = auth();
	if (!clerkId) {
		redirect("/sign-in");
	}

<<<<<<< HEAD
    // This case should never be a thing, but just in case...
    if (!params?.slug){
        return <PageError message="Event Not Found" href="/events" />;
    }

    
=======
    if (!params?.slug){
        return <PageError message="How did you even access this without a slug???" href="/events" />;
    }

    const currentDateUTC = getUTCDate();
>>>>>>> dev

    return (
		<div className="flex h-[100dvh] w-full flex-col">
			<Navbar />
			<Suspense fallback={<h1>Grabbing the Event 1 sec...</h1>}>
<<<<<<< HEAD
                <EventCheckin eventID={params.slug} clerkId={clerkId} />
=======
                <EventCheckin eventID={params.slug} clerkId={clerkId} currentDateUTC={currentDateUTC} />
>>>>>>> dev
            </Suspense>
		</div>
    );
}   
export const runtime = "edge";


  