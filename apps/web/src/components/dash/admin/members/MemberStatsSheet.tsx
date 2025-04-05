import React from "react";
import { getMemberStatsOverview } from "@/lib/queries/users";
import { StatItemProps } from "@/components/dash/shared/StatItem";
import StatsSheet from "@/components/dash/shared/StatsSheet";

type Props = {};

async function MemberStatsSheet({}: Props) {
	const stats = await getMemberStatsOverview();

	const statItems: StatItemProps[] = [
		{
			label: "Total Members",
			value: stats.totalMembers,
		},
		{
			label: "Active Members",
			value: stats.activeMembers,
			description:
				"An active member is defined as a member who has checked in at least once this semester.",
		},
	];

	return <StatsSheet items={statItems} />;
}

export default MemberStatsSheet;
