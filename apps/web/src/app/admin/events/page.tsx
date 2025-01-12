import { Suspense } from "react";
import Link from "next/link";
import { getEventsWithCheckins } from "@/lib/queries/events";
import { CalendarPlus } from "lucide-react";
import { columns } from "./columns";

import { DataTable } from "@/components/ui/data-table";
import EventStatsSheet from "@/components/dash/admin/events/EventStatsSheet";
import { Button } from "@/components/ui/button";
import AdminCheckinLog from "@/components/dash/shared/AdminCheckinLog";
import { unstable_noStore as noStore } from "next/cache";

async function Page() {
	noStore();
	const events = await getEventsWithCheckins();
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="mb-5 grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					Events
				</h1>
			</div>
			<div className="mx-5 flex items-center justify-between rounded-lg border p-2">
				<Suspense
					fallback={<div>Grabbing event stats. One sec...</div>}
				>
					<EventStatsSheet />
				</Suspense>
				<div>
					<Link href="/admin/events/new">
						<Button className="flex flex-nowrap gap-x-2">
							<CalendarPlus />
							Create Event
						</Button>
					</Link>
				</div>
			</div>
			<div className="rounded-xl p-5">
				<DataTable
					columns={columns}
					data={events}
					tableName="events"
					viewRoute={undefined}
				/>
			</div>
		</div>
	);
}

export const runtime = "edge";

export default Page;
