"use client"

import Image from "next/image";
import type { EventImageProps } from "@/lib/types/events";
import { useState,useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventImage(props:EventImageProps){

  const [loaded, setLoaded] = useState(false);

  const combinedProps = {
		alt: "Event Image",
		priority: true,
    width:0,
    height:0,
    quality:100,
		sizes:"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    ...props
  };

  return (
		<>
			<Image
				{...combinedProps}
				onLoad={() => setLoaded(true)}
        hidden={!loaded}
			/>
			<Skeleton className={`${loaded ? "hidden" : `h-[${props.width || '300'}px] w-full`}`} hidden={loaded} />
		</>
  );
}