import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as links from "calendar-link";
import type { CalendarDetails } from "./types/events";
import { ONE_HOUR_IN_MILLISECONDS } from "./constants/shared";
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

export function getClientTimeZone(vercelIPTimeZone: string | null) {
	return vercelIPTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function convertDateToUtc(date: Date) {
	return date.toISOString();
}

export function getDateAndTimeWithTimeZoneString(date: Date, timeZone: string) {
	return date.toLocaleString(undefined, {
		hourCycle: "h12",
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: timeZone,
	});
}

export function getDateWithTimeZoneString(date: Date, timeZone: string) {
	return date.toLocaleString(undefined, {
		hourCycle: "h12",
		hour: "numeric",
		minute: "2-digit",
		timeZone: timeZone,
		timeZoneName: "short",
	});
}

export function getUTCDate() {
	const currentDate = new Date();
	return new Date(currentDate.toUTCString());
}

export function getDateDifferentInHours(date1: Date, date2: Date) {
	const diffInMs = date1.getTime() - date2.getTime();
	return diffInMs / ONE_HOUR_IN_MILLISECONDS;
}
