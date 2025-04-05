"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";

type Props = {
	activeMembers: number;
	totalRegistrations: number;
};

export default function EngagementMetricsCard({
	activeMembers,
	totalRegistrations,
}: Props) {
	const activePercentage = Math.round(
		(activeMembers / totalRegistrations) * 100,
	);

	return (
		<div className="flex flex-col space-y-2">
			<div className="flex items-baseline justify-between">
				<div className="text-3xl font-bold">{activeMembers}</div>
				<div className="text-sm text-muted-foreground">
					of {totalRegistrations} ({activePercentage}%)
				</div>
			</div>
			<Progress value={activePercentage} className="h-2" />
		</div>
	);
}
