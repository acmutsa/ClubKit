import React from "react";

export type StatItemProps = {
	label: string;
	value: number | string;
};

/**
 * Reusable component for displaying a single statistic with a label and value
 */
function StatItem({ label, value }: StatItemProps) {
	return (
		<div className="flex flex-col p-1">
			<span className="text-xs text-muted-foreground">{label}</span>
			<span className="text-lg font-semibold">{value}</span>
		</div>
	);
}

export default StatItem;
