import Navbar from "@/components/shared/navbar";
import { CardSkeleton } from "@/components/ui/skeleton-loaders";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex min-h-[100dvh] flex-col">
			<Navbar />
			<div className="container mx-auto mt-6 px-4">
				<div className="mb-8">
					<Skeleton className="h-12 w-3/4 sm:w-1/2" />
					<Skeleton className="mt-2 h-4 w-1/2 sm:w-1/3" />
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					<div>
						<Skeleton className="aspect-video w-full rounded-lg" />
					</div>

					<div className="space-y-6">
						<div>
							<Skeleton className="mb-2 h-6 w-1/3" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="mt-2 h-4 w-full" />
							<Skeleton className="mt-2 h-4 w-2/3" />
						</div>

						<div>
							<Skeleton className="mb-2 h-6 w-1/3" />
							<div className="flex space-x-2">
								<Skeleton className="h-8 w-8 rounded-full" />
								<div className="flex-1">
									<Skeleton className="h-4 w-1/3" />
									<Skeleton className="mt-1 h-3 w-1/4" />
								</div>
							</div>
						</div>

						<div>
							<Skeleton className="mb-2 h-6 w-1/3" />
							<Skeleton className="h-10 w-full rounded-md" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
