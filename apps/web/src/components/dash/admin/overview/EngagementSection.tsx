import { Suspense } from "react";
import {
	getActiveMembers,
	getRegistrationsByMonth,
	getCheckinsByMonth,
	getMostActiveDay,
	getActivityByDayOfWeek,
} from "@/lib/queries/charts";
import EngagementMetricsCard from "./EngagementMetricsCard";
import AverageVisitsCard from "./AverageVisitsCard";
import ActivityByDayChart from "./ActivityByDayChart";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

export default function EngagementSection() {
	return (
		<div className="space-y-3 sm:space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold tracking-tight sm:text-xl">
					Engagement Metrics
				</h2>
			</div>
			<div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
				<Suspense
					fallback={
						<LoadingCard
							title="Active Members"
							description="Members who visited in the last 30 days"
						/>
					}
				>
					<ActiveMembersCard />
				</Suspense>
				<Suspense
					fallback={
						<LoadingCard
							title="Avg. Visits per Member"
							description="Average check-ins per registered member"
						/>
					}
				>
					<VisitsCard />
				</Suspense>
				<Suspense
					fallback={
						<LoadingCard
							title="Most Active Day"
							description="Day with highest check-in activity"
						/>
					}
				>
					<ActiveDayCard />
				</Suspense>
			</div>
		</div>
	);
}

function LoadingCard({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<Card>
			<CardHeader className="pb-2 sm:pb-3">
				<CardTitle className="text-sm sm:text-lg">{title}</CardTitle>
				<CardDescription className="text-xs sm:text-sm">
					{description}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex h-[120px] items-center justify-center sm:h-[150px]">
					Loading...
				</div>
			</CardContent>
		</Card>
	);
}

async function ActiveMembersCard() {
	const [activeMembers, registrations] = await Promise.all([
		getActiveMembers(),
		getRegistrationsByMonth(),
	]);

	const totalRegistrations = registrations.reduce(
		(acc, curr) => acc + curr.count,
		0,
	);

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg">Active Members</CardTitle>
				<CardDescription>
					Members who visited in the last 30 days
				</CardDescription>
			</CardHeader>
			<CardContent>
				<EngagementMetricsCard
					activeMembers={activeMembers}
					totalRegistrations={totalRegistrations}
				/>
			</CardContent>
		</Card>
	);
}

async function VisitsCard() {
	const [registrations, checkins] = await Promise.all([
		getRegistrationsByMonth(),
		getCheckinsByMonth(),
	]);

	const totalRegistrations = registrations.reduce(
		(acc, curr) => acc + curr.count,
		0,
	);
	const totalCheckins = checkins.reduce((acc, curr) => acc + curr.count, 0);
	const averageVisitsPerMember = (
		totalCheckins / (totalRegistrations || 1)
	).toFixed(1);

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg">
					Avg. Visits per Member
				</CardTitle>
				<CardDescription>
					Average check-ins per registered member
				</CardDescription>
			</CardHeader>
			<CardContent>
				<AverageVisitsCard averageVisits={averageVisitsPerMember} />
			</CardContent>
		</Card>
	);
}

async function ActiveDayCard() {
	const [mostActiveDay, activityByDayOfWeek] = await Promise.all([
		getMostActiveDay(),
		getActivityByDayOfWeek(),
	]);

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg">Most Active Day</CardTitle>
				<CardDescription>
					Day with highest check-in activity
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ActivityByDayChart
					activityByDayOfWeek={activityByDayOfWeek}
					mostActiveDay={mostActiveDay}
				/>
			</CardContent>
		</Card>
	);
}
