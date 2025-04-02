import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";

// Basic content skeleton for general use
export function ContentSkeleton() {
	return (
		<div className="space-y-2 p-4">
			<Skeleton className="h-8 w-2/3" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-3/4" />
		</div>
	);
}

// Card-style skeleton for dashboard items
export function CardSkeleton() {
	return (
		<div className="rounded-lg border p-4 shadow-sm">
			<Skeleton className="mb-4 h-8 w-1/2" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-3/4" />
			</div>
		</div>
	);
}

// Table skeleton for data tables
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead colSpan={4}>
						<Skeleton className="h-8 w-full" />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array(rows)
					.fill(0)
					.map((_, i) => (
						<TableRow key={i}>
							<TableCell colSpan={4}>
								<Skeleton className="h-12 w-full" />
							</TableCell>
						</TableRow>
					))}
			</TableBody>
		</Table>
	);
}

// Stats skeleton for member stats and other metrics
export function StatsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{Array(4)
				.fill(0)
				.map((_, i) => (
					<div key={i} className="rounded-lg border p-4">
						<Skeleton className="mb-2 h-4 w-1/2" />
						<Skeleton className="h-8 w-3/4" />
					</div>
				))}
		</div>
	);
}

// Chart skeleton for analytics sections
export function ChartSkeleton({ height = "h-64" }: { height?: string }) {
	return (
		<div className="space-y-2">
			<Skeleton className="mb-4 h-8 w-1/3" />
			<Skeleton className={`w-full ${height}`} />
			<div className="mt-2 flex justify-between">
				<Skeleton className="h-4 w-12" />
				<Skeleton className="h-4 w-12" />
				<Skeleton className="h-4 w-12" />
				<Skeleton className="h-4 w-12" />
			</div>
		</div>
	);
}

// Key metrics skeleton specifically for dashboard metrics cards
export function KeyMetricsSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
			{Array(5)
				.fill(0)
				.map((_, i) => (
					<div key={i} className="rounded-lg border p-4">
						<div className="mb-2 flex justify-between">
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-4 w-4 rounded-full" />
						</div>
						<Skeleton className="mb-1 h-8 w-1/2" />
						<Skeleton className="h-3 w-16" />
					</div>
				))}
		</div>
	);
}

// Dashboard section skeleton with title and content area
export function DashboardSectionSkeleton({
	height = "h-64",
}: {
	height?: string;
}) {
	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<Skeleton className="h-6 w-40" />
			</div>
			<Skeleton className={`w-full ${height}`} />
		</div>
	);
}
