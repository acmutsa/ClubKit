"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createCalendarLink, capitalizeFirstLetter } from "@/lib/utils";
import type { CalendarDetails, EventCalendarName } from "@/lib/types/events";

// TODO: Have a quick convo about this. They are tiny icons so they
export default function CalendarLink({
	calendarName,
	calendarDetails,
}: {
	calendarName: EventCalendarName;
	calendarDetails: CalendarDetails;
}) {

	const {
		title,
		titleOverride
	} = calendarName;

	const [src, setSrc] = useState(
		`/img/logos/${title.toLocaleLowerCase()}-icon.svg`,
	);

	const fallBackSrc = "/img/logos/calendar.svg";
	const calendarLink = createCalendarLink(title, calendarDetails);

	return (
		<Link
			href={calendarLink}
			target="_blank"
			className="flex w-auto justify-between gap-3 rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/70 md:max-w-[7.5rem] lg:max-w-none"
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
			<p className="md:text-base lg:text-lg 2xl:text-2xl">
				{titleOverride ? titleOverride : capitalizeFirstLetter(title)}
			</p>
		</Link>
	);
}
