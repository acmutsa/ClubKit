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

type Props = {};

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

async function MonthlyRegistrationChart({}: Props) {
	const registrations = await getRegistrationsByMonth();
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
					<AreaChart accessibilityLayer data={registrations}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) =>
								monthList[value].slice(0, 3)
							}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default MonthlyRegistrationChart;
