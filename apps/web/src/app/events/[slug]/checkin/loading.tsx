import Navbar from "@/components/shared/navbar";
import { CardSkeleton } from "@/components/ui/skeleton-loaders";

export default function Loading() {
	return (
		<div className="flex h-[100dvh] w-full flex-col">
			<Navbar />
			<div className="container my-4">
				<CardSkeleton />
			</div>
		</div>
	);
}
