import type { EventAndCategoriesType } from "@/lib/types/events";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import c from "config";
export default function EventCategories({
	event,
	isPast,
	className,
}: {
	event: EventAndCategoriesType;
	isPast: boolean;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex w-full flex-row items-center justify-center space-x-3 md:space-x-4",
				className,
			)}
		>
			{event.eventsToCategories.length > 0 ? (
				event.eventsToCategories.map((category) => {
					// Style is like this for now because of the way tailwind ships, it prevents you from using arbitrary colors that are not known ahead of time
					return (
						<Badge
							key={category.category.name}
							style={{
								backgroundColor: category.category.color,
							}}
						>
							<h1 className="text-sm text-muted ">
								{category.category.name}
							</h1>
						</Badge>
					);
				})
			) : (
				<Badge>
					<h1 className="text-sm">{c.clubName}</h1>
				</Badge>
			)}
			{isPast && (
				<Badge className="bg-red-400 hover:bg-red-400">
					<h1 className="text-sm">Past</h1>
				</Badge>
			)}
		</div>
	);
}
