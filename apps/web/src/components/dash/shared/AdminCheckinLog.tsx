import React from "react";
import { getCheckinLog } from "@/lib/queries/checkins";
import { DataTable } from "@/components/ui/data-table";
import { checkinLogColumns } from "./CheckinLogColumns";

type Props = {};

async function AdminCheckinLog({}: Props) {
	const data = await getCheckinLog();
	return (
		<div>
			<div>
				<DataTable
					data={data}
					columns={checkinLogColumns}
					tableName="checkins"
				/>
			</div>
		</div>
	);
}

export default AdminCheckinLog;
