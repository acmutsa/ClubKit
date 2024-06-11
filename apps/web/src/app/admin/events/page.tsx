import { getEventsWithCheckins } from "@/lib/queries";
import { columns } from "./columns";

import { DataTable } from "@/components/ui/data-table";

async function Page() {
	const events = await getEventsWithCheckins();
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					Events
				</h1>
			</div>
			{/* <div className="border-muted">{events?.[0].name}</div> */}
			<div className="rounded-xl p-5">
				<DataTable
					columns={columns}
					data={events}
					viewRoute="/events/"
				/>
			</div>
		</div>
	);
}

export default Page;
