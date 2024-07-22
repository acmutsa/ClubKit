import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as links from "calendar-link";
import { headers } from "next/headers";

type CalendarDetails = {
    title: string,
    description: string,
	start: string,
	end: string,
	location: string,
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function range(start: number, end: number, step: number = 1): number[] {
	let arr = [];
	for (let i = start; i < end; i += step) {
		arr.push(i);
	}
	return arr;
}

export function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

// This is so jank im ngl. Defienetely gonna come back and rethink this
export function createCalendarLink(calendarLinkName:string,eventCalendarLink:CalendarDetails){
	const lowerLinkName = calendarLinkName.toLocaleLowerCase();
	

/// @ts-ignore shhh it works for now
  const calendarFunction = links[lowerLinkName as keyof links];
	if (calendarFunction){
		return calendarFunction(eventCalendarLink);
	}
	// We will default to a google calendar link if the calendar link name is not found
	return links.google(eventCalendarLink);
}

export const getClientTimeZone = (vercelIPTimeZone:string | null) =>{
	return vercelIPTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export const convertDateToUtc = (date:Date) =>{
	return date.toISOString();
}

export const convertDateWithTimeZone = (date:Date,timeZone:string) =>{
	return date.toLocaleString(undefined, {
				hourCycle: "h12",
				dateStyle: "medium",
				timeStyle: "short",
				timeZone: timeZone,
			});
}