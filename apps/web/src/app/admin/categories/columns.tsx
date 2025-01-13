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
import { EventCategoryType } from "@/lib/types/events";
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
import DeleteCategoryDialogue from "@/components/dash/admin/categories/DeleteCategoryDialogue";
import { DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const eventCategoryColumns: ColumnDef<EventCategoryType>[] = [
	{
		accessorKey: "id",
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
		accessorKey: "color",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Color" />;
		},
		cell: ({ row }) => {
			return (
				<div>
					<div className="flex items-center">
						<div
							className="mr-2 h-4 w-4 rounded-full"
							style={{ backgroundColor: row.getValue("color") }}
						></div>
						{row.getValue("color")}
					</div>
				</div>
			);
		},
		enableSorting: true,
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
												data.id,
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
								<DropdownMenuItem
									onClick={() =>
										toast.promise(
											navigator.clipboard.writeText(
												data.color,
											),
											{
												loading: "Copying color...",
												success: "Color copied",
												error: "Failed to copy color",
											},
										)
									}
								>
									Copy color
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
						<EditCategory eventCategory={data} setOpen={setOpen} />
					</Dialog>
					<DeleteCategoryDialogue
						categoryID={data.id}
						name={data.name}
					/>
				</AlertDialog>
			);
		},
	},
];
