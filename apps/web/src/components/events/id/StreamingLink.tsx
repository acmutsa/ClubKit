"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";


export default function StreamingLink({title,href}:{title:string,href:string}){

    const [src, setSrc] = useState(
		`/img/logos/${title.toLocaleLowerCase()}-icon.svg`,
	);
    

	const fallBackSrc = "/img/logos/stream.svg";


    return (
		<Link
			href={href}
			target="_blank"
			className="flex gap-4 rounded-md bg-primary/90 px-4 py-2 text-primary-foreground hover:bg-primary/80"
		>
			<Image
				src={src}
				alt="Streaming Icon"
				height={25}
				width={25}
				onError={(e) => {
					setSrc(fallBackSrc);
				}}
			/>
			<p>{capitalizeFirstLetter(title)}</p>
		</Link>
	);






}