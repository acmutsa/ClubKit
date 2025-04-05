import React from "react";
import { getEventStatsOverview } from "@/lib/queries/events";
import { StatItemProps } from "@/components/dash/shared/StatItem";
import StatsSheet from "@/components/dash/shared/StatsSheet";

type Props = {};

async function EventStatsSheet({}: Props) {
	const stats = await getEventStatsOverview();

	const statItems: StatItemProps[] = [
		{
			label: "Total Events",
			value: stats.totalEvents,
		},
		{
			label: "This Week",
			value: stats.thisWeek,
		},
		{
			label: "Past Events",
			value: stats.pastEvents,
		},
	];

	return <StatsSheet items={statItems} />;
}

export default EventStatsSheet;
