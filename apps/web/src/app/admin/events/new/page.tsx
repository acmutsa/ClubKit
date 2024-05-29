import NewEventForm from "@/components/dash/admin/events/NewEventForm";
import { getCategoryOptions } from "@/actions/events/new";

export default async function Page() {
	const defaultDate = new Date();
	const categoryOptions = await getCategoryOptions();
	return (
		<div className="mx-auto max-w-6xl pt-36 text-foreground">
			<div className="grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					New Event
				</h1>
			</div>
			<div className="rounded-xl border border-muted p-5">
				<NewEventForm
					defaultDate={defaultDate}
					categoryOptions={categoryOptions}
				/>
			</div>
		</div>
	);
}

export const runtime = "edge";
