import NewEventForm from "@/components/dash/admin/events/NewEventForm";
import { getAllCategoriesKeyValue } from "@/lib/queries/categories";
import { getUTCDate } from "@/lib/utils";
import { getAllSemesters } from "@/lib/queries/semesters";
import { db, desc } from "db";
import { semesters } from "db/schema";

export default async function Page() {
	const defaultDate = getUTCDate();
	defaultDate.setSeconds(0);
	const categoryOptionsAsync = getAllCategoriesKeyValue();
	const semesterOptionsAsync = db.query.semesters.findMany({
		orderBy: desc(semesters.isCurrent),
	});
	const [categoryOptions, semesterOptions] = await Promise.all([
		categoryOptionsAsync,
		semesterOptionsAsync,
	]);
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="grid grid-cols-2 px-5">
				<h1 className="font-foreground mb-2 text-3xl font-bold tracking-tight">
					New Event
				</h1>
			</div>
			<div className="rounded-xl border border-muted p-5">
				<NewEventForm
					defaultDate={defaultDate}
					categoryOptions={categoryOptions}
					semesterOptions={semesterOptions}
				/>
			</div>
		</div>
	);
}

export const runtime = "edge";
