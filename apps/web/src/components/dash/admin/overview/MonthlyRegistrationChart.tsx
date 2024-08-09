"use client";

import React from "react";

import { getRegistrationsByMonth } from "@/lib/queries/charts";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
} from "@/components/ui/chart";

type Props = {
	registrations: {
		month: number;
		count: number;
	}[];
};

const chartConfig = {
	numRegistered: {
		label: "Registrations",
		color: "hsl(var(--chart-1))",
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

async function MonthlyRegistrationChart({ registrations }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Registrations by Month</CardTitle>
				<CardDescription>
					Showing registration trends over the last year
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={registrations.slice(0, 6)}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={4}
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
							fill="var(--color-numRegistered)"
							fillOpacity={0.4}
							stroke="var(--color-numRegistered)"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default MonthlyRegistrationChart;
