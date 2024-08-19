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
	calendarLinkName: string,
	eventCalendarLink: CalendarDetails,
) {
	const lowerLinkName = calendarLinkName.toLocaleLowerCase();
	const calendarFunction = linksAsObject[lowerLinkName] as Function;
	if (calendarFunction && typeof calendarFunction === "function") {
		return calendarFunction(eventCalendarLink);
	}
	// We will default to a google calendar link if the calendar link name is not found
	return CalendarLinks.google(eventCalendarLink);
}

export function getClientTimeZone(vercelIPTimeZone?: string | null) {
	return vercelIPTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export function getUTCDate() {
	const currentDate = new Date();
	return new Date(currentDate.toUTCString());
}

export function isEventCurrentlyHappening(currentDateUTC:Date,eventStart: Date, eventEnd: Date){
	return currentDateUTC >= eventStart && currentDateUTC <= eventEnd;
}

export function isEventCheckinAllowed(currentDateUTC:Date,checkinStart:Date,checkinEnd:Date){
	return currentDateUTC >= checkinStart && currentDateUTC <= checkinEnd;
}