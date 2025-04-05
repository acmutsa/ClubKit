import {
	DashboardSectionSkeleton,
	KeyMetricsSkeleton,
} from "@/components/ui/skeleton-loaders";

export default function Loading() {
	return (
		<div className="mx-auto max-w-7xl space-y-4 p-3 text-foreground sm:space-y-6 sm:p-4">
			<div className="flex flex-col space-y-1 sm:space-y-2">
				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
					Admin Overview
				</h1>
				<p className="text-sm text-muted-foreground sm:text-base">
					Monitor key club metrics and trends
				</p>
				<div className="mt-1 h-px w-full bg-border sm:mt-2" />
			</div>

			{/* Key Metrics Summary Cards */}
			<KeyMetricsSkeleton />

			{/* Trends Section */}
			<DashboardSectionSkeleton height="h-[300px]" />

			{/* Engagement Metrics */}
			<DashboardSectionSkeleton height="h-[200px]" />

			{/* Activity Patterns */}
			<DashboardSectionSkeleton height="h-[250px]" />

			{/* Demographics */}
			<DashboardSectionSkeleton height="h-[300px]" />
		</div>
	);
}
