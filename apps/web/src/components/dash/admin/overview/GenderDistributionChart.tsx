"use client";

import React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
	ChartConfig,
} from "@/components/ui/chart";

type GenderData = {
	gender: string;
	count: number;
	fill: string;
};

type Props = {
	genderData: GenderData[];
};

const chartConfig = {
	male: {
		label: "Male",
		color: "hsl(var(--chart-1))",
	},
	female: {
		label: "Female",
		color: "hsl(var(--chart-2))",
	},
	"non-binary": {
		label: "Non-binary",
		color: "hsl(var(--chart-3))",
	},
	transgender: {
		label: "Transgender",
		color: "hsl(var(--chart-4))",
	},
	"prefer-not-to-say": {
		label: "Prefer not to say",
		color: "hsl(var(--chart-5))",
	},
	other: {
		label: "Other",
		color: "hsl(var(--chart-6))",
	},
} satisfies ChartConfig;

export default function GenderDistributionChart({ genderData }: Props) {
	// Format gender labels with capitalized first letter and count
	// Also convert spaces to hyphens to match chartConfig keys
	const formattedData = genderData.map((item) => ({
		...item,
		// Add a configKey property that uses hyphens instead of spaces
		configKey: item.gender.replace(/\s+/g, "-"),
		formattedLabel: `${item.gender.charAt(0).toUpperCase() + item.gender.slice(1)}`,
	}));

	const total = formattedData.reduce((sum, item) => sum + item.count, 0);
	return (
		<div className="col-span-4">
			<div>
				<ChartContainer
					className="mx-auto aspect-square max-h-[250px]"
					config={chartConfig}
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent nameKey="formattedLabel" />
							}
						/>
						<Pie
							data={formattedData}
							dataKey="count"
							nameKey="configKey"
							outerRadius={90}
							innerRadius={48}
							strokeWidth={5}
						></Pie>

						<ChartLegend
							content={
								<ChartLegendContent className="w-full flex-wrap justify-center" />
							}
							layout="horizontal"
							verticalAlign="bottom"
							align="center"
						/>
					</PieChart>
				</ChartContainer>
			</div>
		</div>
	);
}
