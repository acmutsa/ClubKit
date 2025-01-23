"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { UserWithData } from "db/types";
import { formatDate } from "date-fns";
import { Dialog, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import UpdateRoleDialogue from "@/components/dash/shared/UpdateRoleDialogue";

const timeFormatString = "eee, MMM dd yyyy HH:mm bb";

const timeCell = ({ row }: { row: Row<UserWithData> }) => {
	const formattedDate = formatDate(row.getValue(""), timeFormatString);
	return <div>{formattedDate}</div>;
};

export const columns: ColumnDef<UserWithData>[] = [
	// {
	// 	accessorKey: "user.userID",
	// 	id: "userID",
	// 	header: "User ID",
	// 	cell: ({ row }) => {
	// 		return <div className="">{row.original.user.userID}</div>;
	// 	},
	// },
	{
		id: "name",
		accessorFn: (row) => `${row.user.firstName} ${row.user.lastName}`,
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Name" />;
		},
		enableSorting: true,
	},
	{
		accessorKey: "user.email",
		id: "email",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Email" />;
		},
	},
	{
		accessorKey: "checkin_count",
		id: "checkins",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Checkins" />;
		},
	},
	{
		accessorKey: "data.major",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Major" />;
		},
		id: "major",
	},

	{
		accessorKey: "data.universityID",
		id: "universityID",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="ABC123" />;
		},
	},
	{
		accessorKey: "data.classification",
		id: "classification",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Classification" />
			);
		},
	},
	{
		accessorKey: "data.ethnicity",
		id: "ethnicity",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Ethnicity" />;
		},
		cell: ({ row }) => {
			return (
				<div className="">
					{row.original.data.ethnicity.map((e) => (
						<Badge
							className="m-0.5 w-fit whitespace-nowrap"
							key={e}
						>
							{e}
						</Badge>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: "data.gender",
		id: "gender",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Gender" />;
		},
		cell: ({ row }) => {
			return (
				<div>
					{row.original.data.gender.map((e) => (
						<Badge key={e}>{e}</Badge>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: "user.role",
		id: "interestedEventTypes",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Role" />;
		},
	},
	{
		id: "actions",
		enablePinning: true,
		header: ({ column }) => {},
		cell: ({ row }) => {
			const {
				user: { userID, clerkID, email, role },
			} = row.original;
			const [open, setOpen] = useState(false);
			return (
				<Dialog open={open} onOpenChange={setOpen}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<div
									className="h-full w-full cursor-pointer"
									onClick={async (e) => {
										e.stopPropagation();
										toast.promise(
											navigator.clipboard.writeText(
												clerkID ?? "Not found",
											),
											{
												loading: "Copying...",
												success: () => {
													return "Link copied!";
												},
												error: "Error",
											},
										);
									}}
								>
									Copy Clerk ID
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<div
									className="h-full w-full cursor-pointer"
									onClick={async (e) => {
										e.stopPropagation();
										toast.promise(
											navigator.clipboard.writeText(
												userID.toString(),
											),
											{
												loading: "Copying...",
												success: () => {
													return "Link copied!";
												},
												error: "Error",
											},
										);
									}}
								>
									Copy User ID
								</div>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<a href={`mailto:${email}`}>Email User</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<DialogTrigger asChild>
									<div
										className="h-full w-full cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
										}}
									>
										Change Role
									</div>
								</DialogTrigger>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<UpdateRoleDialogue
						userID={userID}
						currentRole={role}
						setOpen={setOpen}
					/>
				</Dialog>
			);
		},
	},
];
