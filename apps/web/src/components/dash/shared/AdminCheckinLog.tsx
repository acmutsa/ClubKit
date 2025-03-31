import React from "react";
import { getCheckinLog } from "@/lib/queries/checkins";
import { DataTable } from "@/components/ui/data-table";
import { checkinLogColumns } from "./CheckinLogColumns";

async function AdminCheckinLog() {
	const data = await getCheckinLog();
	return (
		<div>
			<div>
				<DataTable
					data={data}
					columns={checkinLogColumns}
					options={{
						tableName: "all checkins",
					}}
				/>
			</div>
		</div>
	);
}

export default AdminCheckinLog;
