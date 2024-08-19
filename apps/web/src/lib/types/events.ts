import {
	events,
	eventsToCategories,
	eventCategories,
	eventsToCategoriesRelations,
} from "db/schema";

export type EventToCategoriesType = typeof eventsToCategories.$inferSelect;

export type EventCategoryType = typeof eventCategories.$inferSelect;

export type EventsToCategoriesWithCategoryType = EventToCategoriesType & {
	category: {
		// id?: string;
		name: string;
		color: string;
	};
};

export type EventType = typeof events.$inferSelect;

export type EventAndCategoriesType = EventType & {
	eventsToCategories: EventsToCategoriesWithCategoryType[];
};

export type EventCalendarLink = {
	title: string;
	description: string;
	start: string;
	end: string;
	location: string;
};

export type EventCalendarName = {
	title:string;
	titleOverride?:string;
}

export type DetailsProps = {
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
};

export type CalendarDetails = {
	title: string;
	description: string;
	start: string;
	end: string;
	location: string;
};

export enum CheckinResult {
	SUCCESS = "success",
	ALREADY_CHECKED_IN = "already_checked_in",
	SOME_FAILED = "some_failed",
	FAILED = "failed",
}
