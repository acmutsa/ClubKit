import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as CalendarLinks from "calendar-link";
import type { CalendarDetails } from "./types/events";

const linksAsObject = CalendarLinks as Record<string, Function>;

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
	functionKey: string,
	eventCalendarLink: CalendarDetails,
) {
	const lowerLinkName = functionKey.toLocaleLowerCase();
	const calendarFunction = linksAsObject[lowerLinkName] as Function;
	if (calendarFunction && typeof calendarFunction === "function") {
		return calendarFunction(eventCalendarLink);
	}
	// We will default to a google calendar link if the calendar link name is not found
	return CalendarLinks.office365Mobile(eventCalendarLink);
}

export function getClientTimeZone(timeZone?: string | null) {
	return timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getUTCDate() {
	const currentDate = new Date();
	return new Date(currentDate.toUTCString());
}

export function formatBlobUrl(blobUrl: string) {
	const end = blobUrl.split("/").at(-1);
	if (!end) return blobUrl;

	const extension = end.split(".").at(-1);
	if (!extension) return end;

	const name = end.split("-").slice(0, -1).join("-");
	if (!name) return end;

	return `${decodeURIComponent(name)}.${extension}`;
}
