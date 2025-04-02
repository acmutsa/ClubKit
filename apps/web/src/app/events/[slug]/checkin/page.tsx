import EventCheckin from "@/components/events/id/checkin/EventCheckin";
import Navbar from "@/components/shared/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageError from "@/components/shared/PageError";
import { getUserCheckin } from "@/lib/queries/users";
import { getUTCDate } from "@/lib/utils";

export default async function Page({ params }: { params: { slug: string } }) {
	const { userId: clerkId } = await auth();
	if (!clerkId) {
		redirect("/sign-in");
	}

	if (!params?.slug) {
		return (
			<PageError
				message="How did you even access this without a slug???"
				href="/events"
			/>
		);
	}

	const currentDateUTC = getUTCDate();

	return (
		<div className="flex h-[100dvh] w-full flex-col">
			<Navbar />
			<EventCheckin
				eventID={params.slug}
				clerkId={clerkId}
				currentDateUTC={currentDateUTC}
			/>
		</div>
	);
}
export const runtime = "edge";
