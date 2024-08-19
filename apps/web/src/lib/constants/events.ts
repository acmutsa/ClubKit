// This is use to create a single source of truth in our filters for the events
export const EVENT_FILTERS = Object.freeze({
	QUERY: "query",
	CARD: "card",
	VIEW: "view",
	CALENDAR: "calendar",
	SHOW_UPCOMING_EVENTS: "upcoming",
	SHOW_PAST_EVENTS: "past",
	SHOW_EVENTS: "show_events",
	CATEGORIES: "categories",
	WEEK_OF: "week_of",
});

export const EVENT_DATE_FORMAT_STRING = "MMM do, yyyy";
export const EVENT_TIME_FORMAT_STRING = "h:mm a";