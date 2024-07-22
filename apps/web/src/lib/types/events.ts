export type EventsToCategories = {
	eventID: string;
	categoryID: string;
	category: {
		name: string;
		color: string;
	};
};

export type EventCategory = {
	name: string;
	color: string;
	id: string;
};

export type EventType = {
	id: string;
	name: string;
	description: string;
	thumbnailUrl: string;
	start: Date;
	end: Date;
	checkinStart: Date;
	checkinEnd: Date;
	location: string;
	isUserCheckinable: boolean;
	isHidden: boolean;
	eventsToCategories: Array<EventsToCategories>;
};