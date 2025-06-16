"use client"
import Image from "next/image"
import { ThumbnailType } from "@/lib/types/shared"

export default function ThumbnailItem(thumbnail:ThumbnailType) {
  return (
    <div className="relative w-full overflow-hidden rounded-md border border-muted">
      <Image
        src={thumbnail.url}
        alt={thumbnail.name}
        width={300}
        height={300}
      />
    </div>
  );

}