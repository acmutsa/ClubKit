"use client";

import { ColumnDef, Row, GroupColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { UserWithData } from "db/types";
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
import Link from "next/link";
import getBanquetQualifiers from "@/lib/queries/users";

type BanquetType = Awaited<ReturnType<typeof getBanquetQualifiers>>[number];

export const columns: ColumnDef<BanquetType>[] = [
	{
		id: "name",
		accessorFn: (row) => `${row.firstName} ${row.lastName}`,
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Name" />;
		},
		enableSorting: true,
	},
	{
		accessorKey: "email",
		id: "email",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Email" />;
		},
	},
	{
		accessorKey: "universityID",
		id: "universityID",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="ABC123" />;
		},
	},
	{
		accessorKey: "totalCheckins",
		id: "totalCheckins",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Checkins" />;
		},
	},
	{
		accessorKey: "totalPoints",
		id: "totalPoints",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Points" />;
		},
	},
	{
		id: "actions",
		enablePinning: true,
		header: ({}) => {},
		cell: ({ row }) => {
			const { userID, clerkID, email } = row.original;
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
								<Link href={`/admin/members/${userID}`}>
									View Member
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem disabled={clerkID == null}>
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
									{clerkID ? "Copy Clerk ID" : "No Clerk ID"}
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
						</DropdownMenuContent>
					</DropdownMenu>
				</Dialog>
			);
		},
	},
];
