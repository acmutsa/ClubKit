import React from "react";
import { getCheckinLog } from "@/lib/queries/checkins";
import { DataTable } from "@/components/ui/data-table";
import { eventCheckinColumns } from "./EventCheckinsColumns";
import Link from "next/link";
export default async function EventCheckinsLog({
	eventID,
	eventName,
}: {
	eventID: string;
	eventName: string;
}) {
	const data = await getCheckinLog(eventID);
	return (
		<div>
			<div>
				<DataTable
					data={data}
					columns={eventCheckinColumns}
					options={{
						tableName: "event checkins",
						downloadRoute: `/api/admin/export?name=${"event checkins"}&event_id=${eventID}`,
					}}
				/>
				<Link href="/admin/events">
					<p className="w-full pt-10 text-end text-sm underline">
						Back to Events
					</p>
				</Link>
			</div>
		</div>
	);
}
