"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createCalendarLink, capitalizeFirstLetter } from "@/lib/utils";
import type { CalendarDetails, EventCalendarName } from "@/lib/types/events";

export default function CalendarLink({
	calendarName,
	calendarDetails,
}: {
	calendarName: EventCalendarName;
	calendarDetails: CalendarDetails;
}) {
	const { title, functionKey } = calendarName;

	const [src, setSrc] = useState(
		`/img/logos/${title.toLocaleLowerCase()}-icon.svg`,
	);

	const fallBackSrc = "/img/logos/calendar.svg";
	const calendarLink = createCalendarLink(functionKey, calendarDetails);
	console.log("Calendar link is: ", calendarLink);
	return (
		<Link
			href={calendarLink}
			target="_blank"
			className="flex w-auto justify-between gap-3 rounded-md px-3 py-2 text-primary-foreground md:max-w-[7.5rem] lg:max-w-none"
		>
			<Image
				src={src}
				alt="Calendar Icon"
				height={25}
				width={25}
				onError={() => {
					setSrc(fallBackSrc);
				}}
			/>
			<p className="text-primary md:text-base lg:text-lg 2xl:text-2xl">
				{title}
			</p>
		</Link>
	);
}
// data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0D%0AVERSION:2.0%0D%0APRODID:Forever%20Event%3A%20Part%202%0D%0ABEGIN:VEVENT%0D%0ADTSTART:20250106T200500Z%0D%0ADTEND:20250623T200500Z%0D%0ADTSTAMP:20250130T214058Z%0D%0ASUMMARY:Forever%20Event%3A%20Part%202%0D%0ADESCRIPTION:this%20event%20should%20always%20be%20live%0D%0ALOCATION:Da%20room%20with%20the%20stuff%20for%20th%0D%0AUID:9710%0D%0AEND:VEVENT%0D%0AEND:VCALENDAR%0D%0A
// https://careercenter.utsa.edu/events/2025/01/21/career-labs-drop-ins-check-handshake-for-specifics.ics/
