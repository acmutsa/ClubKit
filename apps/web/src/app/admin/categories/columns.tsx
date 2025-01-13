"use client"
import { ColumnDef } from "@tanstack/react-table"
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
import EditCategory from "@/components/dash/admin/categories/EditCategoryDialogue";
import DeleteCategoryDialogue from "@/components/dash/admin/categories/DeleteCategoryDialogue";

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
    cell: ({row}) =>{
      return <div>
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: row.getValue("color") }}
          ></div>
          {row.getValue("color")}
        </div>
      </div>
    },
		enableSorting: true,
	},
	{
		id: "actions",
		enablePinning: true,
		header: ({  }) => {},
    cell:({row})=>{
    const [showDelete, setShowDelete] = useState(false);
		const [open, setOpen] = useState(false);
		const data = row.original;
		


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
              
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      );
    }
	},
];

function CategoryColumnActions({ setOpen, showDelete, id, name }:{
  setOpen:React.Dispatch<React.SetStateAction<boolean>>,
  showDelete:boolean,
  id:string,
  name:string
}) {}