import { Suspense } from "react";
import { UserRoundPlus } from "lucide-react";
import AddCheckinDialogue from "@/components/dash/shared/AddCheckinDialogue";
import CheckinsStatsSheet from "@/components/dash/shared/CheckinStatsSheet";
import { Button } from "@/components/ui/button";
import AdminCheckinLog from "@/components/dash/shared/AdminCheckinLog";
import { getEventList } from "@/lib/queries/events";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AdminPageSkeletonContent } from "@/components/dash/shared/AdminPageSkeleton";
import { TableSkeleton } from "@/components/ui/skeleton-loaders";

export default async function Page() {
	const eventList = await getEventList();
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="mb-5 grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					Checkins
				</h1>
			</div>
			<div className="mx-5 flex items-center justify-between">
				<Suspense
					fallback={<div className="w-full">Loading stats...</div>}
				>
					<CheckinsStatsSheet />
				</Suspense>
				<div>
					<Dialog>
						<DialogTrigger asChild>
							<Button className="flex flex-nowrap gap-x-2">
								<UserRoundPlus />
								Add Checkin
							</Button>
						</DialogTrigger>
						<AddCheckinDialogue eventList={eventList} />
					</Dialog>
				</div>
			</div>
			{/* <div className="border-muted">{events?.[0].name}</div> */}
			<div className="rounded-xl p-5">
				<div>
					<Suspense fallback={<TableSkeleton rows={10} />}>
						<AdminCheckinLog />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
