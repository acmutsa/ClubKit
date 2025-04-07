import {
	getRegistrationsByMonth,
	getCheckinsByMonth,
	getRetentionRate,
	getGrowthRate,
} from "@/lib/queries/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	UserIcon,
	CheckCircleIcon,
	BarChart,
	ArrowUpIcon,
	ArrowDownIcon,
	UsersIcon,
	TrendingUpIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default async function KeyMetrics() {
	// Fetch data in parallel
	const [monthlyRegistrations, monthlyCheckins, retentionRate, growthRate] =
		await Promise.all([
			getRegistrationsByMonth(),
			getCheckinsByMonth(),
			getRetentionRate(),
			getGrowthRate(),
		]);

	// Calculate metrics
	const totalRegistrations = monthlyRegistrations.reduce(
		(acc, curr) => acc + curr.count,
		0,
	);

	const totalCheckins = monthlyCheckins.reduce(
		(acc, curr) => acc + curr.count,
		0,
	);

	// Get new members this month
	const newMembersThisMonth =
		monthlyRegistrations[new Date().getMonth()]?.count || 0;

	return (
		<div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
					<CardTitle className="text-xs font-medium sm:text-sm">
						Total Registrations
					</CardTitle>
					<UserIcon className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
				</CardHeader>
				<CardContent>
					<div className="text-xl font-bold sm:text-2xl">
						{totalRegistrations}
					</div>
					<p className="text-xs text-muted-foreground">This year</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
					<CardTitle className="text-xs font-medium sm:text-sm">
						Total Check-ins
					</CardTitle>
					<CheckCircleIcon className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
				</CardHeader>
				<CardContent>
					<div className="text-xl font-bold sm:text-2xl">
						{totalCheckins}
					</div>
					<p className="text-xs text-muted-foreground">This year</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
					<CardTitle className="text-xs font-medium sm:text-sm">
						New Members
					</CardTitle>
					<UsersIcon className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
				</CardHeader>
				<CardContent>
					<div className="text-xl font-bold sm:text-2xl">
						{newMembersThisMonth}
					</div>
					<p className="text-xs text-muted-foreground">This month</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
					<CardTitle className="text-xs font-medium sm:text-sm">
						Retention Rate
					</CardTitle>
					<TrendingUpIcon className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
				</CardHeader>
				<CardContent>
					<div className="flex items-baseline space-x-1">
						<div className="text-xl font-bold sm:text-2xl">
							{retentionRate}%
						</div>
					</div>
					<div className="mt-1">
						<Progress value={retentionRate} className="h-1" />
					</div>
					<p className="mt-1 text-xs text-muted-foreground">
						Last 3 months
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
					<CardTitle className="text-xs font-medium sm:text-sm">
						Growth Rate
					</CardTitle>
					<BarChart className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
				</CardHeader>
				<CardContent>
					<div className="flex items-baseline space-x-1">
						<div className="text-xl font-bold sm:text-2xl">
							{growthRate}%
						</div>
						{growthRate > 0 ? (
							<ArrowUpIcon className="h-4 w-4 text-green-500" />
						) : growthRate < 0 ? (
							<ArrowDownIcon className="h-4 w-4 text-red-500" />
						) : null}
					</div>
					<p className="text-xs text-muted-foreground">
						vs last month
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
