"use client";

import React from "react";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

type Props = {
	checkins: {
		month: number;
		count: number;
	}[];
};

const chartConfig = {
	numCheckins: {
		label: "Check-ins",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

const monthList = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

function MonthlyCheckinChart({ checkins }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Check-ins by Month</CardTitle>
				<CardDescription>
					Showing check-in activity over the last year
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<AreaChart accessibilityLayer data={checkins.slice(0, 6)}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							padding={{ left: 25, right: 25 }}
							interval={0}
							tickFormatter={(value) =>
								monthList[value - 1].slice(0, 3)
							}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<Area
							dataKey="count"
							type="linear"
							fill="var(--color-numCheckins)"
							fillOpacity={0.4}
							stroke="var(--color-numCheckins)"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default MonthlyCheckinChart;
