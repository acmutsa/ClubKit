import { Suspense } from "react";
import {
	getActivityByTimeOfDay,
	getMembershipStatus,
} from "@/lib/queries/charts";
import TimeOfDayChart from "./TimeOfDayChart";
import MembershipStatusChart from "./MembershipStatusChart";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

export default function ActivityPatterns() {
	return (
		<div className="space-y-3 sm:space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold tracking-tight sm:text-xl">
					Activity Patterns
				</h2>
			</div>
			<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
				<Suspense
					fallback={
						<LoadingCard
							title="Activity by Time of Day"
							description="When members most frequently visit"
						/>
					}
				>
					<TimeOfDayCard />
				</Suspense>
				<Suspense
					fallback={
						<LoadingCard
							title="Membership Status"
							description="Distribution of member statuses"
						/>
					}
				>
					<MembershipStatusCard />
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

async function TimeOfDayCard() {
	const activityByTimeOfDay = await getActivityByTimeOfDay();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">
					Activity by Time of Day
				</CardTitle>
				<CardDescription>
					When members most frequently visit
				</CardDescription>
			</CardHeader>
			<CardContent>
				<TimeOfDayChart activityByTimeOfDay={activityByTimeOfDay} />
			</CardContent>
		</Card>
	);
}

async function MembershipStatusCard() {
	const membershipStatus = await getMembershipStatus();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Membership Status</CardTitle>
				<CardDescription>
					Distribution of member statuses
				</CardDescription>
			</CardHeader>
			<CardContent>
				<MembershipStatusChart membershipStatus={membershipStatus} />
			</CardContent>
		</Card>
	);
}
