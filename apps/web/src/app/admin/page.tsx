import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import KeyMetrics from "@/components/dash/admin/overview/KeyMetrics";
import MembershipTrends from "@/components/dash/admin/overview/MembershipTrends";
import EngagementSection from "@/components/dash/admin/overview/EngagementSection";
import ActivityPatterns from "@/components/dash/admin/overview/ActivityPatterns";
import DemographicsSection from "@/components/dash/admin/overview/DemographicsSection";
import {
	KeyMetricsSkeleton,
	DashboardSectionSkeleton,
} from "@/components/ui/skeleton-loaders";

// The dashboard always fetches fresh data on each request
// Data is memoized within each render via React's built-in request deduplication
export default async function Page() {
	return (
		<div className="mx-auto max-w-7xl space-y-4 p-3 text-foreground sm:space-y-6 sm:p-4">
			<div className="flex flex-col space-y-1 sm:space-y-2">
				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
					Admin Overview
				</h1>
				<p className="text-sm text-muted-foreground sm:text-base">
					Monitor key club metrics and trends
				</p>
				<Separator className="mt-1 sm:mt-2" />
			</div>

			{/* Key Metrics Summary Cards with streaming */}
			<Suspense fallback={<KeyMetricsSkeleton />}>
				<KeyMetrics />
			</Suspense>

			{/* Trends Section with streaming */}
			<Suspense
				fallback={<DashboardSectionSkeleton height="h-[300px]" />}
			>
				<MembershipTrends />
			</Suspense>

			{/* Engagement Metrics with streaming */}
			<Suspense
				fallback={<DashboardSectionSkeleton height="h-[200px]" />}
			>
				<EngagementSection />
			</Suspense>

			{/* Activity Patterns with streaming */}
			<Suspense
				fallback={<DashboardSectionSkeleton height="h-[250px]" />}
			>
				<ActivityPatterns />
			</Suspense>

			{/* Demographics with streaming */}
			<Suspense
				fallback={<DashboardSectionSkeleton height="h-[300px]" />}
			>
				<DemographicsSection />
			</Suspense>
		</div>
	);
}
