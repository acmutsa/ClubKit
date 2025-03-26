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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import type { EventType } from "@/lib/types/events";
import { formatDate } from "date-fns";
import AddCheckinDialogue from "@/components/dash/shared/AddCheckinDialogue";
import { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import DeleteEventDialog from "@/components/dash/admin/events/DeleteEventDialogue";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import ViewQRCode from "@/components/dash/admin/events/ViewQRCode";
import { useBasePath } from "@/lib/hooks/useBasePath";

type EventWithCheckins = Partial<EventType> & {
	checkin_count: number;
	avg_rating: number;
};

const timeFormatString = "eee, MMM dd yyyy HH:mm bb";

const timeCell =
	(key: string) =>
	({ row }: { row: Row<EventWithCheckins> }) => {
		const formattedDate = formatDate(row.getValue(key), timeFormatString);
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
					/>
				</div>
			);
		},
	},
	{
		accessorKey: "avg_rating",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Avg. Rating" />
			);
		},
		cell: ({ row }) => {
			const rating: number | string =
				row.getValue("avg_rating") || "unrated";
			return (
				<div className="text-center">
					{typeof rating === "string" ? rating : rating.toFixed(2)}
				</div>
			);
		},
	},
	{
		accessorKey: "start",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Date" />;
		},
		cell: timeCell("start"),
	},
	{
		accessorKey: "checkin_count",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Checkins" />;
		},
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Last Updated" />
			);
		},
		cell: timeCell("updatedAt"),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Created At" />;
		},
		cell: timeCell("createdAt"),
	},
	{
		id: "actions",
		enablePinning: true,
		cell: ({ row }) => {
			const [showDelete, setShowDelete] = useState(false);
			const [open, setOpen] = useState(false);
			const data = row.original;
			const basePath = useBasePath();

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
								<Link
									href={`/events/${data.id}`}
									className="h-full w-full"
								>
									View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link
									href={`/admin/events/${data.id}/checkins`}
									className="h-full w-full"
								>
									View Checkins
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<ViewQRCode
									id={data.id}
									name={data.name}
									description={data.description}
									basePath={basePath}
								/>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<div
									className="h-full w-full cursor-pointer"
									onClick={async (e) => {
										e.stopPropagation();
										toast.promise(
											navigator.clipboard.writeText(
												`${basePath}/events/${data.id}`,
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
									Copy link
								</div>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Link
									href={`/admin/events/${data.id}/edit`}
									className="h-full w-full"
								>
									Edit
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<DialogTrigger asChild>
									<div
										className="h-full w-full cursor-pointer text-red-500"
										onClick={(e) => {
											e.stopPropagation();
											setShowDelete(true);
										}}
									>
										Delete
									</div>
								</DialogTrigger>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<DialogTrigger asChild>
									<div
										className="h-full w-full cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											setShowDelete(false);
										}}
									>
										Add Checkin
									</div>
								</DialogTrigger>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<EventColumnActions
						setOpen={setOpen}
						showDelete={showDelete}
						id={row.original.id!}
						name={row.original.name!}
					/>
				</Dialog>
			);
		},
	},
];

function EventColumnActions({
	setOpen,
	showDelete,
	id,
	name,
}: {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	showDelete: boolean;
	id: string;
	name: string;
}) {
	if (showDelete) {
		return <DeleteEventDialog id={id} name={name} setOpen={setOpen} />;
	}
	return (
		<AddCheckinDialogue
			eventList={[
				{
					id,
					name,
				},
			]}
			setOpen={setOpen}
		/>
	);
}
