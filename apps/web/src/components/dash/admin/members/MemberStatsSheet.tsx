import React from "react";
import { getMemberStatsOverview } from "@/lib/queries";

import { Separator } from "@/components/ui/separator";

type Props = {};

async function MemberStatsSheet({}: Props) {
	const stats = await getMemberStatsOverview();
	return (
		<div className="flex w-fit space-x-4 rounded-lg border p-2">
			<div className="flex flex-col p-1">
				<span className="text-xs text-muted-foreground">
					Total Members
				</span>
				<span className="text-lg font-semibold">
					{stats.totalMembers}
				</span>
			</div>
			<Separator orientation="vertical" />
			{/* Put recent registration count here */}
			{/* <div className="flex flex-col p-1">
				<span className="text-xs text-muted-foreground">This Week</span>
				<span className="text-lg font-semibold">{stats.thisWeek}</span>
			</div>
			<Separator orientation="vertical" /> */}
			<div className="flex flex-col p-1">
				<span className="text-xs text-muted-foreground">
					Active Members
				</span>
				<span className="text-lg font-semibold">
					{stats.activeMembers}
				</span>
			</div>
		</div>
	);
}

export default MemberStatsSheet;
