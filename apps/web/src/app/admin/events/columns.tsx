"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
		header: ({ column }) => {
			return (
				<Button
					variant={"ghost"}
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => {
			return (
				<div className="max-w-[80ch]">
					{row.getValue("description")}
				</div>
			);
		},
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
		header: ({ column }) => {
			return (
				<Button
					variant={"ghost"}
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Start
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: timeCell,
	},
	{
		accessorKey: "end",
		header: ({ column }) => {
			return (
				<Button
					variant={"ghost"}
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					End
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: timeCell,
	},
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
						<DropdownMenuItem>
							<Link href={`/admin/events/${data.id}`}>View</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link href={`/admin/events/${data.id}/edit`}>
								Edit
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<div
								onClick={async () =>
									await navigator.clipboard.writeText(
										`https://portal.acmutsa.org/events/${data.id}`,
									)
								}
							>
								Copy link
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
