import React from "react";
import { getMemberStatsOverview } from "@/lib/queries/users";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";

async function MemberStatsSheet() {
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
			<div className="flex flex-col p-1">
				<span className="text-xs text-muted-foreground">
					Active Members
				</span>
				<span className="text-lg font-semibold">
					{stats.activeMembers}
				</span>
			</div>

			<Link
				href="/admin/members/banquet"
				className="flex flex-col p-1 hover:cursor-pointer"
			>
				<span className="text-xs text-muted-foreground hover:cursor-pointer">
					Banquet Qualifiers
				</span>
				<span className="text-lg font-semibold underline hover:cursor-pointer">
					{stats.banquetQualifiers}
				</span>
			</Link>
		</div>
	);
}

export default MemberStatsSheet;
