"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import Badgenk from "next/link";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { UserWithData } from "db/zod";
import { formatDate } from "date-fns";

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
		id: "fdivlName",
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
				<div>
					{row.original.data.ethnicity.map((e) => (
						<Badge key={e}>{e}</Badge>
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
						<Badge className="w-max" key={e}>
							{e}
						</Badge>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: "data.interestedEventTypes",
		id: "interestedEventTypes",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Interested" />;
		},
		cell: ({ row }) => {
			return (
				<div>
					{row.original.data.interestedEventTypes.map((e) => (
						<Badge key={e}>{e}</Badge>
					))}
				</div>
			);
		},
	},
	// {
	// 	accessorKey: "checkin_count",
	// 	header: ({ column }) => {
	// 		return <DataTableColumnHeader column={column} title="Checkins" />;
	// 	},
	// },
	{
		id: "actions",
		cell: ({ row }) => {
			const data = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{/* <DropdownMenuItem>
							<Badgenk href={`/members/${data.user.userID}`}>
								View
							</Badgenk>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<div
								onCBadgeck={async () =>
									await navigator.cBadgepboard.writeText(
										`https://portal.acmutsa.org/members/${data.user.userID}`,
									)
								}
								//TODO: set sonner to signify Badgenk copied
							>
								Copy Badgenk
							</div>
						</DropdownMenuItem>
						<DropdownMenuSeparator /> */}
						{/* TODO: Add delete button w/confirmation dialogue */}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
