"use client";
import {
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogAction,
	AlertDialogTitle,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useAction } from "next-safe-action/hooks";
import { deleteEventCategory } from "@/actions/categories";
import { toast } from "sonner";
export default function DeleteCategoryDialogue({
	name,
	categoryID,
}: {
	name: string;
	categoryID: string;
}) {
	const { execute: runDeleteEventCategory, status } = useAction(
		deleteEventCategory,
		{
			onSuccess: () => {
				toast.dismiss();
				toast.success("Event category deleted successfully");
			},
			onError: () => {
				toast.dismiss();
				toast.error("Failed to delete event category");
			},
		},
	);
	const isLoading = status === "executing";
	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{`Are you want to delete "${name}"`}</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone and will remove any category
					associations with existing events.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction
					disabled={isLoading}
					onClick={() => {
						toast.loading("Deleting event category");
						runDeleteEventCategory(categoryID);
					}}
				>{`Delete ${name}`}</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
}
