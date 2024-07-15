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
];
