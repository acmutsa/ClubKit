"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";

type StatusData = {
	status: string;
	count: number;
	color: string;
};

type Props = {
	membershipStatus: StatusData[];
};

export default function MembershipStatusChart({ membershipStatus }: Props) {
	// Calculate total for percentages
	const totalMembers = membershipStatus.reduce(
		(acc, curr) => acc + curr.count,
		0,
	);

	return (
		<div className="flex flex-col space-y-4">
			{membershipStatus.map((status) => (
				<div key={status.status} className="space-y-1">
					<div className="flex items-center justify-between">
						<div className="text-sm font-medium">
							{status.status}
						</div>
						<div className="text-sm text-muted-foreground">
							{status.count} (
							{Math.round((status.count / totalMembers) * 100)}%)
						</div>
					</div>
					<Progress
						value={(status.count / totalMembers) * 100}
						className={`h-2 ${status.color}`}
					/>
				</div>
			))}
		</div>
	);
}
