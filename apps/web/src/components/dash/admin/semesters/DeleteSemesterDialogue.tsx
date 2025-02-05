"use client";
import { deleteSemester } from "@/actions/semester";
import { useAction } from "next-safe-action/hooks";
import {
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function DeleteSemesterDialogue({
	semesterID,
	name,
}: {
	semesterID: number;
	name: string;
}) {
	const { status, execute: runDeleteSemester } = useAction(deleteSemester, {
		onSuccess: () => {
			toast.dismiss();
			toast.success("Semester deleted successfully");
		},
		onError: () => {
			toast.dismiss();
			toast.error("Failed to delete semester");
		},
	});

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
						runDeleteSemester(semesterID);
					}}
				>{`Delete ${name}`}</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
}
