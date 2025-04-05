"use client";

import React from "react";

type Props = {
	averageVisits: string;
};

export default function AverageVisitsCard({ averageVisits }: Props) {
	return (
		<div className="flex items-center justify-center">
			<div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 border-primary/10">
				<div className="text-4xl font-bold">{averageVisits}</div>
				<div className="text-xs text-muted-foreground">
					visits/member
				</div>
			</div>
		</div>
	);
}
