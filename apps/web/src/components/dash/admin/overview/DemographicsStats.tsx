"use client";

import React from "react";

import { Label, Pie, PieChart } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
} from "@/components/ui/chart";

type Props = {
	classifications: {
		classification: string;
		count: number;
		fill?: string;
	}[];
};

const classChartConfig = {
	freshman: {
		label: "Freshman",
		color: "hsl(var(--chart-1))",
	},
	sophomore: {
		label: "Sophomore",
		color: "hsl(var(--chart-2))",
	},
	sophmore: {
		label: "Sophmore 😭",
		color: "hsl(173 58% 75%)",
	},
	junior: {
		label: "Junior",
		color: "hsl(var(--chart-3))",
	},
	senior: {
		label: "Senior",
		color: "hsl(var(--chart-4))",
	},
	graduate: {
		label: "Graduate",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

function DemographicsStats({ classifications }: Props) {
	return (
		<div className="col-span-4">
			<div>
				<ChartContainer
					config={classChartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={classifications}
							dataKey="count"
							nameKey="classification"
							outerRadius={100}
							innerRadius={48}
							strokeWidth={5}
						></Pie>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend
							content={
								<ChartLegendContent className="flex-wrap justify-center" />
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

export default DemographicsStats;
