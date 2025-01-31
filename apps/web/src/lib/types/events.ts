import { events, eventsToCategories, eventCategories } from "db/schema";

import {
	insertEventSchemaFormified,
	selectEventSchema,
	updateEventSchemaFormified,
} from "db/zod";
import { z } from "zod";

import type { Noop, RefCallBack } from "react-hook-form";

import type { ImageProps } from "next/image";

import type { Semester } from "db/types";

export type EventToCategoriesType = typeof eventsToCategories.$inferSelect;

export type EventCategoryType = typeof eventCategories.$inferSelect;
import c from "config";

export type EventsToCategoriesWithCategoryType = EventToCategoriesType & {
	category: {
		name: string;
		color: string;
	};
};

export type EventType = typeof events.$inferSelect;

export type EventAndCategoriesType = EventType & {
	eventsToCategories: EventsToCategoriesWithCategoryType[];
};

export interface EventCalendarLink {
	title: string;
	description: string;
	start: string;
	end: string;
	location: string;
}

export type EventCalendarName = (typeof c.calendarLinks)[number];

export interface DetailsProps {
	event: EventAndCategoriesType;
	startTime: string;
	startDate: string;
	formattedEventDuration: string;
	checkInUrl: string;
	checkInMessage: string;
	eventCalendarLink: EventCalendarLink;
	isEventPassed: boolean;
	isCheckinAvailable: boolean;
	isEventHappening: boolean;
}

export interface CalendarDetails {
	title: string;
	description: string;
	start: string;
	end: string;
	location: string;
}

export enum CheckinResult {
	SUCCESS = "success",
	ALREADY_CHECKED_IN = "already_checked_in",
	SOME_FAILED = "some_failed",
	FAILED = "failed",
}

export type iEvent = z.infer<typeof insertEventSchemaFormified>;
export type uEvent = z.infer<typeof updateEventSchemaFormified>;
export type sEvent = z.infer<typeof selectEventSchema>;

export type EventImageProps = Omit<ImageProps, "alt"> & {
	alt?: string;
	isLive?: boolean;
};

export type RatingFormAttributes = {
	onChange: (...event: any[]) => void;
	onBlur: Noop;
	value: number;
	disabled?: boolean | undefined;
	name: string;
	ref: RefCallBack;
};

export type NewEventFormProps = {
	defaultDate: Date;
	categoryOptions: { [key: string]: string };
	semesterOptions: Semester[];
};
