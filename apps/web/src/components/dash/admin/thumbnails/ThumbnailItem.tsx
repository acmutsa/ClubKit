"use client"
import Image from "next/image"
import { ThumbnailType } from "@/lib/types/shared"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"
import { XIcon } from "lucide-react"

type runDeleteActionType = (input: {
	id: number;
	url: string;
	name:string;
}) => void

export default function ThumbnailItem({thumbnail, runDel}:{thumbnail: ThumbnailType, runDel: runDeleteActionType}) {
	
	

  return (
		<HoverCard openDelay={0} closeDelay={150}>
			<HoverCardTrigger>
				<div className="relative w-full overflow-hidden rounded-md border border-muted">
					<Image
						src={thumbnail.url}
						alt={thumbnail.name}
						width={300}
						height={300}
					/>
					<h1>{thumbnail.name}</h1>
				</div>
			</HoverCardTrigger>
			<HoverCardContent
				side="top"
				align="end"
				className="w-[--radix-hover-card-trigger-width] border-transparent bg-transparent p-0 shadow-none"
			>
				<div className="flex w-full flex-row items-center justify-end">
					<div
						className="rounded-full bg-red-300 p-2 cursor-pointer"
						onClick={() =>
							runDel({
								...thumbnail,
							})
						}
					>
						<XIcon />
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
  );

}