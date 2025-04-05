import { CardSkeleton } from "@/components/ui/skeleton-loaders";

export default function Loading() {
	return (
		<div className="container my-8 space-y-6">
			<h1 className="text-3xl font-bold tracking-tight">Events</h1>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array(6)
					.fill(0)
					.map((_, i) => (
						<CardSkeleton key={i} />
					))}
			</div>
		</div>
	);
}
