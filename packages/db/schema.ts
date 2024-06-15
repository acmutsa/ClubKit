import {
	bigserial,
	text,
	varchar,
	uniqueIndex,
	uuid,
	boolean,
	timestamp,
	integer,
	json,
	pgEnum,
	primaryKey,
	pgTable,
	PgArray,
	serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import c from "config";

/* USERS */
export const users = pgTable("users", {
	userID: serial("user_id")
		.primaryKey()
		.references(() => data.userID),
	clerkID: text("clerk_id").unique(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
	role: text("role").notNull().default("member"),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	data: one(data, { fields: [users.userID], references: [data.userID] }),
	checkins: many(checkins),
}));

export const data = pgTable("data", {
	userID: integer("user_id").primaryKey(),
	major: text("major").notNull(),
	classification: text("classification").notNull(),
	graduationMonth: integer("graduation_month").notNull(),
	graduationYear: integer("graduation_year").notNull(),
	birthday: timestamp("birthday"),
	gender: text("gender").array().notNull(),
	ethnicity: text("ethnicity").array().notNull(),
	resume: text("resume"),
	shirtType: text("shirt_type").notNull(),
	shirtSize: text("shirt_size").notNull(),
	interestedEventTypes: text("interested_event_types").array().notNull(),
	universityID: text("short_id").notNull().unique(),
});

/* EVENTS */
export const eventCategories = pgTable("event_categories", {
	// category can be a sub org or other things depending on the event
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	// badge background
	color: text("color").notNull(),
});

export const eventCategoriesRelations = relations(
	eventCategories,
	({ many }) => ({
		eventsToCategories: many(eventsToCategories),
	}),
);



// Add points
// Created at timestamp
export const events = pgTable("events", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	thumbnailUrl: text("thumbnail_Url").default(c.thumbnails.default).notNull(),
	start: timestamp("start").notNull(),
	end: timestamp("end").notNull(),
	checkinStart: timestamp("checkin_start").notNull(),
	checkinEnd: timestamp("checkin_end").notNull(),
	location: text("location").notNull(),
	isUserCheckinable: boolean("is_user_checkinable").notNull().default(true),
	isHidden: boolean("is_hidden").notNull().default(false),
});

export const eventsRelations = relations(events, ({ many }) => ({
	eventsToCategories: many(eventsToCategories),
	checkins: many(checkins),
}));

// Also, because the event to categories table does not have a primary key, we cannot update or delete rows so if you select or add the wrong 
export const eventsToCategories = pgTable("events_to_categories", {
	eventID: text("event_id")
		.notNull()
		.references(() => events.id),
	categoryID: text("category_id")
		.notNull()
		.references(() => eventCategories.id),
});

export const eventsToCategoriesRelations = relations(
	eventsToCategories,
	({ one }) => ({
		category: one(eventCategories, {
			fields: [eventsToCategories.categoryID],
			references: [eventCategories.id],
		}),
		event: one(events, {
			fields: [eventsToCategories.eventID],
			references: [events.id],
		}),
	}),
);

// nullable admin id - backburner
export const checkins = pgTable(
	"checkins",
	{
		eventID: text("event_id").notNull(),
		userID: text("user_id").notNull(),
		time: timestamp("time").defaultNow().notNull(),
		feedback: text("feedback"),
	},
	(table) => {
		return {
			id: primaryKey({ columns: [table.eventID, table.userID] }),
		};
	},
);

export const checkinRelations = relations(checkins, ({ one }) => ({
	author: one(users, {
		fields: [checkins.userID],
		references: [users.userID],
	}),
	event: one(events, {
		fields: [checkins.eventID],
		references: [events.id],
	}),
}));
