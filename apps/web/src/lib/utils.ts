import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as links from "calendar-link";
import type { CalendarDetails } from "./types/events";

const linksAsObject = links as Record<string, Function>;

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
}

export function createCalendarLink(
	calendarLinkName: string,
	eventCalendarLink: CalendarDetails,
) {
	const lowerLinkName = calendarLinkName.toLocaleLowerCase();
	const calendarFunction = linksAsObject[lowerLinkName] as Function;
	if (calendarFunction && typeof calendarFunction === "function") {
		return calendarFunction(eventCalendarLink);
	}
	// We will default to a google calendar link if the calendar link name is not found
	return links.google(eventCalendarLink);
}

export const getClientTimeZone = (vercelIPTimeZone: string | null) => {
	return vercelIPTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const convertDateToUtc = (date: Date) => {
	return date.toISOString();
};

export const convertDateWithTimeZone = (date: Date, timeZone: string) => {
	return date.toLocaleString(undefined, {
		hourCycle: "h12",
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: timeZone,
	});
};
