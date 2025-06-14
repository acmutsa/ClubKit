import EditEventForm from "@/components/dash/admin/events/EditEventForm";
import { getAllCategoriesKeyValue } from "@/lib/queries/categories";
import { iEvent, uEvent } from "@/lib/types/events";
import { getEventWithCategoriesById } from "@/lib/queries/events";
import { IDParamProp } from "@/lib/types/shared";
import FullScreenMessage from "@/components/shared/fullscreen-message";
import c from "config";
import { getAllSemestersDesc } from "@/lib/queries/semesters";
import { getAllThumbnails } from "@/lib/queries/thumbnails";

export default async function Page({ params: { id } }: IDParamProp) {
	const oldValuesAsync = getEventWithCategoriesById(id);
	const getAllSemestersDescAsync = getAllSemestersDesc();
	const getAllThumbnailsAsync = getAllThumbnails();
	const categoryOptionsAsync = getAllCategoriesKeyValue();

	const [allThumbnails, oldValues, semesterOptions, categoryOptions] = await Promise.all([
		getAllThumbnailsAsync,
		oldValuesAsync,
		getAllSemestersDescAsync,
		categoryOptionsAsync
	]);
	if (oldValues === undefined) {
		return (
			<FullScreenMessage
				title="Event Not Found!"
				message={`Unable to find the event you are trying to reach. If you believe this is a mistake please contact ${c.contactEmail}`}
			/>
		);
	}
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="flex w-full px-5">
				<h1 className="font-foreground mb-2 text-3xl font-bold tracking-tight">
					Edit "{oldValues.name.trim()}"
				</h1>
			</div>
			<div className="rounded-xl border border-muted p-5">
				<EditEventForm
					eventID={id}
					oldValues={oldValues}
					thumbnailOptions={allThumbnails}
					categoryOptions={categoryOptions}
					semesterOptions={semesterOptions}
				/>
			</div>
		</div>
	);
}
