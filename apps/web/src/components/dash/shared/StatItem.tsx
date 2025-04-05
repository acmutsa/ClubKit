import React from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
export type StatItemProps = {
	label: string;
	value: number | string;
	description?: string;
};

/**
 * Reusable component for displaying a single statistic with a label and value
 */
function StatItem({ label, value, description }: StatItemProps) {
	return (
		<div className="flex flex-col p-1">
			<div className="flex flex-row items-center space-x-1">
				<span className="text-xs text-muted-foreground">{label}</span>
				{description && (
					<HoverCard>
						<HoverCardTrigger className="">
							<Info className="h-3 w-3" />
						</HoverCardTrigger>
						<HoverCardContent className="text-xs">
							{description}
						</HoverCardContent>
					</HoverCard>
				)}
			</div>
			<span className="text-lg font-semibold">{value}</span>
		</div>
	);
}

export default StatItem;
