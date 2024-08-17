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
import { DataTableColumnHeader } from "@/components/ui/data-table";
import type { EventType } from "@/lib/types/events";
// import { Event } from "db/zod";
import { formatDate } from "date-fns";

type EventWithCheckins = Partial<EventType> & { checkin_count: number };

const timeFormatString = "eee, MMM dd yyyy HH:mm bb";

const timeCell = ({ row }: { row: Row<EventWithCheckins> }) => {
	const formattedDate = formatDate(row.getValue("start"), timeFormatString);
	return <div>{formattedDate}</div>;
};

export const columns: ColumnDef<EventWithCheckins>[] = [
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
			return <DataTableColumnHeader column={column} title="Name" />;
		},
		enableSorting: true,
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => {
			return (
				<div className="relative line-clamp-4 w-[45ch]">
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
			return <DataTableColumnHeader column={column} title="Date" />;
		},
		cell: timeCell,
	},
	// {
	// 	accessorKey: "end",
	// 	header: ({ column }) => {
	// 		return <DataTableColumnHeader column={column} title="End" />;
	// 	},
	// 	cell: timeCell,
	// },
	{
		accessorKey: "checkin_count",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Checkins" />;
		},
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
							<Link href={`/events/${data.id}`}>View</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<div
								className="h-full w-full"
								onClick={async (e) => {
									e.stopPropagation();
									await navigator.clipboard.writeText(
										`https://portal.acmutsa.org/events/${data.id}`,
									);
								}}
								//TODO: set sonner to signify link copied
							>
								Copy link
							</div>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link href={`/admin/events/${data.id}/edit`}>
								Edit
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link href={`/admin/events/${data.id}/checkin`}>
								Add Checkin
							</Link>
						</DropdownMenuItem>
						{/* TODO: Add delete button w/confirmation dialogue */}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
