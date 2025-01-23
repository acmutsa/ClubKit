"use client";

import {
	Label,
	PolarGrid,
	PolarRadiusAxis,
	RadialBar,
	RadialBarChart,
} from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
	visitors: {
		label: "Visitors",
	},
	safari: {
		label: "Safari",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

interface RadialChartProgressProps {
	titleText?: string;
	descriptionText?: string;
	footerText?: string;
	current: number;
	total: number;
	fill?: string;
	className?: string;
}

export function RadialChartProgress(props: RadialChartProgressProps) {
	const {
		titleText,
		descriptionText,
		footerText,
		current,
		total,
		className,
	} = props;

	const chartData = [
		{
			browser: "safari",
			visitors: current,
			fill: props.fill ?? "var(--color-safari)",
		},
	];

	const isTitleOrDescriptionPresent = titleText || descriptionText;

	const startAngle = 90;
	return (
		<Card className={`flex flex-col ${className}`}>
			{isTitleOrDescriptionPresent && (
				<CardHeader className="items-center pb-0">
					{titleText && <CardTitle>{titleText}</CardTitle>}
					{descriptionText && (
						<CardDescription>{descriptionText}</CardDescription>
					)}
				</CardHeader>
			)}
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<RadialBarChart
						data={chartData}
						startAngle={startAngle}
						// We need to add the start angle here to make the chart start from the top and accomodate the 90 degree offset
						endAngle={
							Math.min(360, (current / total) * 360) + startAngle
						}
						innerRadius={80}
						outerRadius={110}
					>
						<PolarGrid
							gridType="circle"
							radialLines={false}
							stroke="none"
							className="first:fill-muted last:fill-background"
							polarRadius={[86, 74]}
						/>
						<RadialBar
							dataKey="visitors"
							background
							cornerRadius={10}
						/>
						<PolarRadiusAxis
							tick={false}
							tickLine={false}
							axisLine={false}
						>
							<Label
								content={({ viewBox }) => {
									if (
										viewBox &&
										"cx" in viewBox &&
										"cy" in viewBox
									) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-4xl font-bold"
												>{`${current >= total ? `${current}` : `${current} / ${total}`}`}</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Points
												</tspan>
											</text>
										);
									}
								}}
							/>
						</PolarRadiusAxis>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
			{footerText && (
				<CardFooter>
					<p className="mt-2 w-full text-center text-sm text-muted-foreground">
						{footerText}
					</p>
				</CardFooter>
			)}
		</Card>
	);
}
