import React, { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import StatItem, { StatItemProps } from "./StatItem";

type StatsSheetProps = {
	items: StatItemProps[];
	className?: string;
};

/**
 * A component for displaying a collection of statistics with consistent styling
 */
function StatsSheet({ items, className = "" }: StatsSheetProps) {
	return (
		<div
			className={`flex w-fit space-x-4 rounded-lg border p-2 ${className}`}
		>
			{items.map((stat, index) => (
				<React.Fragment key={stat.label}>
					<StatItem {...stat} />
					{index < items.length - 1 && (
						<Separator orientation="vertical" />
					)}
				</React.Fragment>
			))}
		</div>
	);
}

export default StatsSheet;
