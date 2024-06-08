"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import { Event } from "db/zod";
import { formatDate } from "date-fns";

const timeFormatString = "eee, MMM dd yyyy HH:mm bb";

const timeCell = ({ row }: { row: Row<Event> }) => {
	const formattedDate = formatDate(row.getValue("start"), timeFormatString);
	return <div>{formattedDate}</div>;
};

export const columns: ColumnDef<Event>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => {
			return <div className="">{row.getValue("id")}</div>;
		},
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		accessorKey: "thumbnailUrl",
		header: "Thumbnail",
		cell: ({ row }) => {
			return (
				<div className="relative max-w-xs">
					<Image
						style={{
							objectFit: "contain",
							height: "auto",
							margin: "auto",
						}}
						src={row.getValue("thumbnailUrl")}
						alt={`Thumbnail for event ${row.getValue("name")}`}
						width={256}
						height={32}
						quality={5}
						// fill
					/>
				</div>
			);
		},
	},
	{
		accessorKey: "start",
		header: "Start",
		cell: timeCell,
	},
	{
		accessorKey: "end",
		header: "End",
		cell: timeCell,
	},
];
