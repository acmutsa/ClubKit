import React from "react";
import { Separator } from "@/components/ui/separator";
import { getCheckinStatsOverview } from "@/lib/queries/checkins";

async function CheckinStatsSheet({ eventID }: { eventID?: string }) {
	const stats = await getCheckinStatsOverview(eventID);
	return (
		<div className="flex w-fit space-x-4">
			<div className="flex flex-col p-1">
				<span className="text-xs text-muted-foreground">
					Total Checkins
				</span>
				<span className="text-lg font-semibold">
					{stats.total_checkins}
				</span>
			</div>
		</div>
	);
}

export default CheckinStatsSheet;
