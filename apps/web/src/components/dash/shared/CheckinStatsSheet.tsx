import React from "react";
import { Separator } from "@/components/ui/separator";
import { getCheckinStatsOverview } from "@/lib/queries";

type Props = {};

async function CheckinStatsSheet({}: Props) {
	const stats = await getCheckinStatsOverview();
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
			{/* <Separator orientation="vertical" />
			<div className="flex flex-col p-1">
				<span className="text-xs text-muted-foreground">This Week</span>
				<span className="text-lg font-semibold">{stats.thisWeek}</span>
			</div>
			<Separator orientation="vertical" />
			<div className="flex flex-col p-1">
				<span className="text-xs text-muted-foreground">
					Past Events
				</span>
				<span className="text-lg font-semibold">
					{stats.pastEvents}
				</span>
			</div> */}
		</div>
	);
}

export default CheckinStatsSheet;
