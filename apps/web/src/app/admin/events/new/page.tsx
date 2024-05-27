import NewEventForm from "@/components/dash/admin/events/NewEventForm";

export default function Page() {
	const defaultDate = new Date();
	return (
		<div className="mx-auto max-w-6xl pt-44 text-foreground">
			<div className="grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					New Event
				</h1>
			</div>
			<div className="rounded-xl border border-muted p-5">
				<NewEventForm defaultDate={defaultDate} />
			</div>
		</div>
	);
}

export const runtime = "edge";
