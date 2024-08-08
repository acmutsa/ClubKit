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
// Why is this not the other way around? If a user is deleted, then their data should be deleted as well
export const users = pgTable("users", {
	userID: serial("user_id")
		.primaryKey()
		.references(() => data.userID),
	clerkID: text("clerk_id").unique(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
	role: text("role").notNull().default("member"),
	joinDate: timestamp("join_date").defaultNow().notNull(),
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
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	color: text("color").notNull(),
});

export const eventCategoriesRelations = relations(
	eventCategories,
	({ many }) => ({
		eventsToCategories: many(eventsToCategories),
	}),
);

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
	points: integer("points").notNull().default(1),
});

export const eventsRelations = relations(events, ({ many }) => ({
	eventsToCategories: many(eventsToCategories),
	checkins: many(checkins),
}));

export const eventsToCategories = pgTable("events_to_categories", {
	eventID: text("event_id")
		.notNull()
		.references(() => events.id, { onDelete: "cascade" }),
	categoryID: text("category_id")
		.notNull()
		.references(() => eventCategories.id, { onDelete: "cascade" }),
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

export const checkins = pgTable(
	"checkins",
	{
		eventID: text("event_id")
			.references(() => events.id, { onDelete: "cascade" })
			.notNull(),
		userID: integer("user_id")
			.references(() => users.userID, { onDelete: "cascade" })
			.notNull(),
		time: timestamp("time").defaultNow().notNull(),
		rating: integer("rating"),
		adminID: text("admin_id"),
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
