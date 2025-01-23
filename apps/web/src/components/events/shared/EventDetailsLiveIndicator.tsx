export default function EventDetailsLiveIndicator({
	className,
}: {
	className?: string;
}) {
	return (
		<div
			className={`h-5 w-5 animate-pulse rounded-full bg-red-600 ${className}`}
		/>
	);
}
