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
import { useRouter } from "next/navigation";
export default function DeleteCategoryDialogue({
	name,
	categoryID,
	thumbnailUrl,
}: {
	name: string;
	categoryID: string;
	thumbnailUrl: string;
}) {
	const { refresh } = useRouter();
	const { execute: runDeleteEventCategory, status } = useAction(
		deleteEventCategory,
		{
			onSuccess: () => {
				toast.dismiss();
				toast.success("Event category deleted successfully");
				refresh();
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
						runDeleteEventCategory({
							categoryID,
							thumbnailUrl,
						});
					}}
				>{`Delete ${name}`}</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
}
