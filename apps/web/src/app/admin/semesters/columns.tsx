"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import React, { useState, useEffect } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTrigger,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import EditCategory from "@/components/dash/admin/categories/EditCategoryDialogue";
import DeleteCategoryDialogue from "@/components/dash/admin/semesters/DeleteSemesterDialogue";
import { DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Semester } from "db/types";
import { Switch } from "@/components/ui/switch";
import { useOptimisticAction } from "next-safe-action/hooks";
import { toggleCurrentSemester } from "@/actions/semester";
import { formatInTimeZone } from "date-fns-tz";
import { getClientTimeZone } from "@/lib/utils";
import DeleteSemesterDialogue from "@/components/dash/admin/semesters/DeleteSemesterDialogue";
import UpdateSemesterDialogue from "@/components/dash/admin/semesters/UpdateSemesterDialogue";

export const semesterColumns: ColumnDef<Semester>[] = [
	{
		accessorKey: "semesterID",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Name" />;
		},
		enableSorting: true,
	},
	{
		accessorKey: "Duration",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader
					column={column}
					title="Duration"
					className="flex w-full justify-center"
				/>
			);
		},
		cell: ({ row }) => {
			const clientTimeZone = getClientTimeZone();
			const { startDate, endDate } = row.original;
			const startDateFormatted = formatInTimeZone(
				startDate,
				clientTimeZone,
				"eeee, MMMM dd yyyy",
			);
			const endDateFormatted = formatInTimeZone(
				endDate,
				clientTimeZone,
				"eeee, MMMM dd yyyy",
			);
			return <div>{`${startDateFormatted} - ${endDateFormatted}`}</div>;
		},
		enableSorting: true,
	},
	{
		accessorKey: "isCurrent",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader
					column={column}
					title="Current Semester"
				/>
			);
		},
		cell: ({ row }) => {
			const { isCurrent, semesterID } = row.original;
			const {
				execute: runToggleSemester,
				result,
				optimisticState,
			} = useOptimisticAction(toggleCurrentSemester, {
				currentState: { isCurrent },
				updateFn: (_, newChecked) => {
					return {
						isCurrent: newChecked.isCurrent,
					};
				},
				onError: ({}) => {
					toast.dismiss();
					toast.error("Failed to update current semester");
				},
				onExecute: ({}) => {
					toast.dismiss();
					toast.success("Semester toggled.", {
						duration: 1500,
					});
				},
			});
			return (
				<Switch
					id={semesterID.toString()}
					checked={optimisticState.isCurrent}
					onCheckedChange={(checked_value) => {
						runToggleSemester({
							semesterID,
							isCurrent: checked_value,
						});
					}}
				/>
			);
		},
	},
	{
		accessorKey: "pointsRequired",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader
					column={column}
					title="Points Required"
				/>
			);
		},
	},
	{
		id: "actions",
		enablePinning: true,
		header: ({}) => {},
		cell: ({ row }) => {
			const [open, setOpen] = useState(false);

			const data = row.original;
			return (
				<AlertDialog>
					<Dialog open={open} onOpenChange={setOpen}>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={async () =>
										toast.promise(
											navigator.clipboard.writeText(
												data.semesterID.toString(),
											),
											{
												loading: "Copying ID...",
												success: "ID copied",
												error: "Failed to copy ID",
											},
										)
									}
								>
									Copy ID
								</DropdownMenuItem>

								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<DialogTrigger className="w-full">
										Edit
									</DialogTrigger>
								</DropdownMenuItem>
								<DropdownMenuItem asChild className="w-full">
									<AlertDialogTrigger className="text-red-500">
										Delete
									</AlertDialogTrigger>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<UpdateSemesterDialogue
							semesterData={data}
							open={open}
							setOpen={setOpen}
						/>
					</Dialog>
					<DeleteSemesterDialogue
						semesterID={data.semesterID}
						name={data.name}
					/>
				</AlertDialog>
			);
		},
	},
];
