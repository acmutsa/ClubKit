import React from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { HelpCircle } from "lucide-react";
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
		<div className="flex flex-row space-x-1 p-1">
			<div className="flex flex-col">
				<span className="text-xs text-muted-foreground">{label}</span>
				<span className="text-lg font-semibold">{value}</span>
			</div>
			{description && (
				<HoverCard>
					<HoverCardTrigger>
						<HelpCircle className="h-4 w-4" />
					</HoverCardTrigger>
					<HoverCardContent className="text-xs">
						{description}
					</HoverCardContent>
				</HoverCard>
			)}
		</div>
	);
}

export default StatItem;
