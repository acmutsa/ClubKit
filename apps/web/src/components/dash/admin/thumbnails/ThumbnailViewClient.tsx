"use client"
import { useState } from "react"
import type { ThumbnailType } from "@/lib/types/shared"
import Fuse from "fuse.js"
import { CreateThumbnailDialog } from "./CreateThumbnail"
import { Input } from "@/components/ui/input"
import ThumbnailItem from "./ThumbnailItem"
import { useAction } from "next-safe-action/hooks"
import { deleteThumbnailAction } from "@/actions/thumbnails"
import { toast } from "sonner"

export default function ThumbnailViewClient({allThumbnails}:{allThumbnails:ThumbnailType[]}) {
  const [thumbnails, setThumbnails] = useState(allThumbnails)
  const [searchQuery, setSearchQuery] = useState("")

  const fuse = new Fuse(allThumbnails,{
    keys:['name']
  })

  function handleSearch(query:string) {
    if (query.length === 0) {
      setThumbnails(allThumbnails)
      return
    }
    const results = fuse.search(query).map(result => result.item)
    setThumbnails(results)
  }

	const { execute: runDel } = useAction(deleteThumbnailAction, {
		onExecute:({
			input:{
				name
			}
		})=>{
			toast.loading(`Deleting ${name}...`);
		},
		onSettled: () => {
			toast.dismiss();
		},
		onError: (err) => {
			console.error(err);
			toast.error("An error occured while deleting the thumbnail");
		},
		onSuccess: ({input:{
			name
		}}) => {
			toast.success(`${name} deleted successfully`);
		},
	});

  return (
		<div className="flex h-full max-h-screen flex-col">
			<div className="flex w-full items-center justify-between">
				<Input
					placeholder={`Search thumbnails...`}
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value);
						handleSearch(e.target.value);
					}}
					className="max-w-sm"
				/>
				<CreateThumbnailDialog />
			</div>
			<div className="flex-1 overflow-x-hidden no-scrollbar mt-5 ">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
					{thumbnails.map((thumbnail) => (
						<ThumbnailItem key={thumbnail.id} thumbnail={thumbnail} runDel={runDel} />
					))}
					{Array.from({ length: 40 }).map((_, index) => (
						<div
							key={index}
							className="relative w-full overflow-hidden rounded-md border border-muted"
						>
							<div className="h-[150px] w-full animate-pulse bg-muted" />
						</div>
					))}
				</div>
			</div>
		</div>
  );
}