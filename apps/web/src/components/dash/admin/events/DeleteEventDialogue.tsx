"use client";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { deleteEventAction } from "@/actions/events/delete";
import { toast } from "sonner";
export default function DeleteEventDialog({
	id,
	name,
	setOpen,
}: {
	id: string;
	name: string;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { status: deleteEventStatus, execute: runDeleteEvent } = useAction(
		deleteEventAction,
		{
			onSuccess: () => {
				setOpen(false);
				toast.dismiss();
				toast.success(`"${name}"Event deleted.`);
			},
			onError: () => {
				setOpen(false);
				toast.dismiss();
				toast.error(`An error occured attempting to delete "${name}"`);
			},
		},
	);

	const isLoading = deleteEventStatus === "executing";

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{`Are you sure you want to delete "${name}"?`}</DialogTitle>
				<DialogDescription className="text-red-500">
					This action cannot be undone. All of the checkins for this
					event will also be deleted.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button
					type="submit"
					onClick={() => {
						toast.dismiss();
						toast.loading(`Deleting "${name}"...`);
						runDeleteEvent(id);
					}}
					disabled={isLoading}
				>
					Delete
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
