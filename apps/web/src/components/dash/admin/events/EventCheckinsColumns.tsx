"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { formatDate } from "date-fns";

const timeFormatString = "eee, MMM dd yyyy HH:mm bb";

type EventCheckinEntry = {
	time: Date;
	feedback: string | null;
	author: {
		userID: number;
		firstName: string;
		lastName: string;
	};
	rating: number | null;
};

const timeCell = ({ row }: { row: Row<EventCheckinEntry> }) => {
	const formattedDate = formatDate(row.getValue("time"), timeFormatString);
	return <div>{formattedDate}</div>;
};

export const eventCheckinColumns: ColumnDef<EventCheckinEntry>[] = [
	{
		accessorKey: "author.userID",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="User ID" />;
		},

		enableSorting: true,
	},
	{
		id: "author",
		accessorFn: (row) => `${row.author.firstName} ${row.author.lastName}`,
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Name" />;
		},
		cell: ({ row }) => {
			return (
				<div>
					{row.original.author.firstName}{" "}
					{row.original.author.lastName}
				</div>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: "time",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Time" />;
		},
		cell: timeCell,
		enableSorting: true,
	},
	{
		accessorKey: "rating",
		id: "rating",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Rating" />;
		},
		cell: ({ row }) => {
			return (
				<div>
					<p>{row.getValue("rating") ?? "unrated"}</p>
				</div>
			);
		},
	},
	{
		accessorKey: "feedback",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Feedback" />;
		},
		cell: ({ row }) => {
			return (
				<div>
					<p>{row.getValue("feedback") ?? ""}</p>
				</div>
			);
		},
		enableSorting: true,
	},
];
