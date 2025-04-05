import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/ui/skeleton-loaders";

interface AdminPageSkeletonProps {
	title: string;
	rows?: number;
}

export function AdminPageSkeleton({ title, rows = 8 }: AdminPageSkeletonProps) {
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="mb-5 grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					{title}
				</h1>
			</div>
			<div className="mx-5 flex items-center justify-between rounded-lg border p-2">
				<div className="flex w-fit space-x-4">
					<div className="flex flex-col p-1">
						<Skeleton className="mb-1 h-4 w-24" />
						<Skeleton className="h-6 w-10" />
					</div>
				</div>
				<div>
					<Skeleton className="h-10 w-32 rounded-md" />
				</div>
			</div>
			<div className="rounded-xl p-5">
				<TableSkeleton rows={rows} />
			</div>
		</div>
	);
}

export function AdminPageSkeletonContent({ rows = 8 }: { rows?: number }) {
	return (
		<>
			<div className="mx-5 flex items-center justify-between rounded-lg border p-2">
				<div className="flex w-fit space-x-4">
					<div className="flex flex-col p-1">
						<Skeleton className="mb-1 h-4 w-24" />
						<Skeleton className="h-6 w-10" />
					</div>
				</div>
				<div>
					<Skeleton className="h-10 w-32 rounded-md" />
				</div>
			</div>
			<div className="rounded-xl p-5">
				<TableSkeleton rows={rows} />
			</div>
		</>
	);
}
