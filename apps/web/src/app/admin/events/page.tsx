import { Suspense } from "react";
import { getEventsWithCheckins } from "@/lib/queries";
import { columns } from "./columns";

import { DataTable } from "@/components/ui/data-table";
import EventStatsSheet from "@/components/dash/admin/events/EventStatsSheet";

async function Page() {
	const events = await getEventsWithCheckins();
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="mb-5 grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					Events
				</h1>
			</div>
			<div className="px-5">
				<Suspense fallback={<div>...loading</div>}>
					<EventStatsSheet />
				</Suspense>
			</div>
			<div className="rounded-xl p-5">
				<DataTable
					columns={columns}
					data={events}
					tableName="events"
					viewRoute="/events/"
				/>
			</div>
		</div>
	);
}

export default Page;
