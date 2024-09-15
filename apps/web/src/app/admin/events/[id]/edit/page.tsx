import React from "react";

import EditEventForm from "@/components/dash/admin/events/EditEventForm";

import { getCategoryOptions } from "@/lib/queries/categories";
import { iEvent, uEvent } from "@/lib/types/events";
import { getEventWithCategoriesById } from "@/lib/queries/events";
import { IDParamProp } from "@/lib/types/shared";
import FullScreenMessage from "@/components/shared/fullscreen-message";

import c from "config";

export default async function Page({ params: { id } }: IDParamProp) {
	const categoryOptions = await getCategoryOptions();
	const oldValues: uEvent | undefined = await getEventWithCategoriesById(id);
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
			<div className="grid grid-cols-2 px-5">
				<h1 className="font-foreground mb-2 text-3xl font-bold tracking-tight">
					Edit Event
				</h1>
			</div>
			<div className="rounded-xl border border-muted p-5">
				<EditEventForm
					eventID={id}
					oldValues={oldValues}
					categoryOptions={categoryOptions}
				/>
			</div>
		</div>
	);
}
