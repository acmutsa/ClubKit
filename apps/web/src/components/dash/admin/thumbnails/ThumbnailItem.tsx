"use client"
import Image from "next/image"
import { ThumbnailType } from "@/lib/types/shared"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"
import { XIcon } from "lucide-react"
import { useState } from "react"

type runDeleteActionType = (input: {
	id: number;
	url: string;
	name:string;
}) => void

export default function ThumbnailItem({thumbnail, runDel}:{thumbnail: ThumbnailType, runDel: runDeleteActionType}) {
	const [isRunning, setIsRunning] = useState(false);
  return (
		<HoverCard openDelay={0} closeDelay={150}>
			<HoverCardTrigger className="h-full overflow-hidden rounded-md border border-muted">
				<div className="relative flex h-full w-full flex-col items-center ">
					<Image
						src={thumbnail.url}
						alt={thumbnail.name}
						width={300}
						height={300}
						priority
					/>
					<h1 className="h-full w-full text-center align-text-bottom">
						{thumbnail.name}
					</h1>
				</div>
			</HoverCardTrigger>
			<HoverCardContent
				side="top"
				align="end"
				className="w-[--radix-hover-card-trigger-width] translate-y-5 translate-x-2 border-transparent bg-transparent p-0 shadow-none"
			>
				<div className="flex w-full flex-row items-center justify-end">
					<div
						className={`cursor-pointer rounded-full ${isRunning ? "bg-red-200" : "bg-red-400"} p-2 translate-x-3`}
						onClick={() => {
							if (isRunning) return;
							setIsRunning(true);
							runDel({
								...thumbnail,
							});
						}}
					>
						<XIcon />
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
  );

}