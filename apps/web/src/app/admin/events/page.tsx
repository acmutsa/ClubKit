import { getEvents } from "@/lib/queries";
import { columns } from "./columns";

import { DataTable } from "@/components/ui/data-table";

async function Page() {
	const events = await getEvents();
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="grid grid-cols-2 px-5">
				<h1 className="font-foreground mb-3 text-3xl font-bold tracking-tight">
					Events
				</h1>
			</div>
			<div className="rounded-xl border border-muted p-5">
				<DataTable columns={columns} data={events} />
			</div>
		</div>
	);
}

export default Page;
