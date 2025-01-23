"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";

export default function StreamingLink({
	title,
	href,
}: {
	title: string;
	href: string;
}) {
	const [src, setSrc] = useState(
		`/img/logos/${title.toLocaleLowerCase()}-icon.svg`,
	);

	const fallBackSrc = "/img/logos/stream.svg";

	return (
		<Link
			href={href}
			target="_blank"
			className="flex w-auto justify-between gap-3 rounded-md px-3 py-2 text-primary-foreground md:max-w-[7.5rem] lg:max-w-none"
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
			<p className="text-primary md:text-base xl:text-lg 2xl:text-xl">
				{capitalizeFirstLetter(title)}
			</p>
		</Link>
	);
}
