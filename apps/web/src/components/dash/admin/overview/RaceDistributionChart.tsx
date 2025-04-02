"use client";

import React from "react";
import { Label, Pie, PieChart, Cell, LabelList } from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
	ChartConfig,
} from "@/components/ui/chart";

type RaceData = {
	race: string;
	count: number;
	fill: string;
};

type Props = {
	raceData: RaceData[];
};

// Define the chart configuration
const chartConfig = {
	asian: {
		label: "Asian",
		color: "hsl(var(--chart-1))",
	},
	"black-or-african-american": {
		label: "Black or African American",
		color: "hsl(var(--chart-2))",
	},
	"hispanic-or-latino": {
		label: "Hispanic or Latino",
		color: "hsl(var(--chart-3))",
	},
	white: {
		label: "White",
		color: "hsl(var(--chart-4))",
	},
	"american-indian-or-alaska-native": {
		label: "American Indian or Alaska Native",
		color: "hsl(var(--chart-5))",
	},
	"native-hawaiian-or-other-pacific-islander": {
		label: "Native Hawaiian or Other Pacific Islander",
		color: "hsl(var(--chart-6))",
	},
	other: {
		label: "Other",
		color: "hsl(var(--chart-7))",
	},
	"prefer-not-to-say": {
		label: "Prefer not to say",
		color: "hsl(var(--chart-8))",
	},
} satisfies ChartConfig;

export default function RaceDistributionChart({ raceData }: Props) {
	// Format race labels with capitalized first letter and count
	const ethnicityData = raceData.map((item) => ({
		...item,
		configKey: item.race.replace(/\s+/g, "-"),
		formattedLabel:
			chartConfig[
				(item.race[0] +
					item.race
						.slice(1)
						.replaceAll(/\s+/g, "-")) as keyof typeof chartConfig
			].label,
	}));

	const total = ethnicityData.reduce((sum, item) => sum + item.count, 0);

	return (
		<div className="col-span-4">
			<div>
				<ChartContainer
					className="mx-auto aspect-square max-h-[250px]"
					config={chartConfig}
				>
					<PieChart>
						<ChartTooltip
							content={
								<ChartTooltipContent nameKey="formattedLabel" />
							}
						/>
						<Pie
							data={ethnicityData}
							dataKey="count"
							nameKey="configKey"
							outerRadius={100}
							innerRadius={48}
							strokeWidth={5}
						></Pie>

						{/* <ChartLegend
							content={
								<ChartLegendContent className="flex-wrap justify-center" />
							}
							layout="horizontal"
							verticalAlign="bottom"
							align="center"
						/> */}
					</PieChart>
				</ChartContainer>
			</div>
		</div>
	);
}
