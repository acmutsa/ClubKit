import { StatsSkeleton, TableSkeleton } from "@/components/ui/skeleton-loaders";

export default function Loading() {
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="mb-5 grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					Members
				</h1>
			</div>
			<div className="px-5">
				<StatsSkeleton />
			</div>
			<div className="rounded-xl p-5">
				<TableSkeleton rows={10} />
			</div>
		</div>
	);
}
