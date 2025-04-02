import React from "react";
import { getMemberStatsOverview } from "@/lib/queries/users";
import { StatItemProps } from "@/components/dash/shared/StatItem";
import StatsSheet from "@/components/dash/shared/StatsSheet";
import Link from "next/link";

async function MemberStatsSheet() {
	const stats = await getMemberStatsOverview();

	const statItems: StatItemProps[] = [
		{
			label: "Total Members",
			value: stats.totalMembers,
		},
		{
			label: "Active Members",
			value: stats.activeMembers,
		},
	];

	return <StatsSheet items={statItems} />;
}

export default MemberStatsSheet;
