import React from "react";
import { getEventStatsOverview } from "@/lib/queries/events";

import { Separator } from "@/components/ui/separator";

type Props = {};

async function EventStatsSheet({}: Props) {
	const stats = await getEventStatsOverview();
	return (
		<div className="flex w-fit space-x-4">
			<div className="flex flex-col p-1">
				<span className="text-xs text-muted-foreground">
					Total Events
				</span>
				<span className="text-lg font-semibold">
					{stats.totalEvents}
				</span>
			</div>
			<Separator orientation="vertical" />
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
			</div>
		</div>
	);
}

export default EventStatsSheet;
