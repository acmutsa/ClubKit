import React from "react";
import { getCheckinStatsOverview } from "@/lib/queries/checkins";
import { StatItemProps } from "@/components/dash/shared/StatItem";
import StatsSheet from "@/components/dash/shared/StatsSheet";

type Props = {};

async function CheckinStatsSheet({}: Props) {
	const stats = await getCheckinStatsOverview();

	const statItems: StatItemProps[] = [
		{
			label: "Total Checkins",
			value: stats.total_checkins,
		},
	];

	return <StatsSheet items={statItems} />;
}

export default CheckinStatsSheet;
