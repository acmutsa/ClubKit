import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants";
import UserDash from "@/components/dash/UserDash";
import { headers } from "next/headers";
import { getClientTimeZone } from "@/lib/utils";
import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";
export default function Page() {
	const { userId: clerkID } = auth();

	if (!clerkID) return redirect("/sign-in");

	const clientTimeZoneValue = headers().get(VERCEL_IP_TIMEZONE_HEADER_KEY);
	const clientTimeZone = getClientTimeZone(clientTimeZoneValue);

	return (
		<main className="flex min-h-[calc(100vh-4rem)] w-screen items-center justify-center overflow-x-hidden px-4 py-4 md:px-5 ">
			<Suspense
				fallback={
					<div className="flex flex-col items-center space-y-2">
						<LoaderCircle className="h-auto w-7 animate-spin lg:w-8 xl:w-9" />
						<h3>Loading. Please wait.</h3>
					</div>
				}
			>
				<UserDash clerkID={clerkID} clientTimeZone={clientTimeZone} />
			</Suspense>
		</main>
	);
}

export const runtime = "edge";
export const revalidate = 30;
