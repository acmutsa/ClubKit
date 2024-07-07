"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createCalendarLink,capitalizeFirstLetter } from "@/lib/utils";

type CalendarDetails = {
    title: string,
    description: string,
	start: string,
	end: string,
	location: string,
}

// TODO: Have a quick convo about this. They are tiny icons so they 
export default function CalendarLink({
	calendarName,
	calendarDetails,
}: {
	calendarName: string,
	calendarDetails: CalendarDetails}) {

	const [src, setSrc] = useState(
		`/img/logos/${calendarName.toLocaleLowerCase()}-icon.svg`,
	);

	const fallBackSrc = "/img/logos/calendar.svg";
    console.log(src);
	const calendarLink = createCalendarLink(calendarName,calendarDetails);

	return (
		<Link
			href={calendarLink}
			target="_blank"
			className="flex gap-4 rounded-md bg-primary/80 px-4 py-2 text-primary-foreground hover:bg-primary/70"
		>
			<Image
				src={src}
				alt="Calendar Icon"
				height={25}
				width={25}
				onError={(e) => {
					setSrc(fallBackSrc);
				}}
			/>
			<p className="md:text-base lg:text-lg">
				{capitalizeFirstLetter(calendarName)}
			</p>
		</Link>
	);
}