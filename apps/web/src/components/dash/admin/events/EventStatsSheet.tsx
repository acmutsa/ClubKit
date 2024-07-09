import React from "react";
import { getEventStatsOverview } from "@/lib/queries";

import { Separator } from "@/components/ui/separator";

type Props = {};

async function EventStatsSheet({}: Props) {
	const stats = await getEventStatsOverview();
	return (
		<div className="flex space-x-4 rounded-lg border p-2">
			<div className="flex flex-col p-1">
				<span className="text-xs text-muted-foreground">Total</span>
				<span className="text-lg font-semibold">{stats.total}</span>
			</div>
			<Separator orientation="vertical" />
			<div className="flex flex-col p-1">
				<span className="text-xs text-muted-foreground">This Week</span>
				<span className="text-lg font-semibold">{stats.thisWeek}</span>
			</div>
		</div>
	);
}

export default EventStatsSheet;
