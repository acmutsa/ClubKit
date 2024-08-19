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
				<Card>
					<CardHeader>
						<CardTitle>Classifications</CardTitle>
					</CardHeader>
					<CardContent>
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
									innerRadius={48}
									strokeWidth={5}
								></Pie>
								<ChartLegend
									content={
										<ChartLegendContent nameKey="classification" />
									}
									className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
								/>
							</PieChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default DemographicsStats;
