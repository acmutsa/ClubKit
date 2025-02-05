import {
	text,
	varchar,
	boolean,
	timestamp,
	integer,
	pgEnum,
	primaryKey,
	pgTable,
	serial,
	date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import c from "config";

// pieces of this schema need to be revamped as a lot of them are lazily set as text instead of varchar with a hard limit
/* USERS */

export const userRoles = pgEnum("user_roles", c.memberRoles);

export const users = pgTable("users", {
	userID: serial("user_id").primaryKey(),
	clerkID: varchar("clerk_id", { length: 255 }).unique(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
	role: userRoles().default("member").notNull(),
	joinDate: timestamp("join_date").defaultNow().notNull(),
	universityID: varchar("university_id", { length: 255 }).notNull().unique(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	data: one(data, { fields: [users.userID], references: [data.userID] }),
	checkins: many(checkins),
}));

export const data = pgTable("data", {
	userID: integer("user_id")
		.primaryKey()
		.references(() => users.userID, { onDelete: "cascade" }),
	major: varchar({ length: 255 }).notNull(),
	classification: varchar({ length: 255 }).notNull(),
	graduationMonth: integer("graduation_month").notNull(),
	graduationYear: integer("graduation_year").notNull(),
	birthday: timestamp("birthday"),
	gender: varchar({ length: 255 }).array().notNull(),
	ethnicity: varchar({ length: 255 }).array().notNull(),
	resume: varchar({ length: 255 }),
	shirtType: varchar("shirt_type", { length: 255 }).notNull(),
	shirtSize: varchar("shirt_size", { length: 255 }).notNull(),
	interestedEventTypes: varchar("interested_event_types", { length: 255 })
		.array()
		.notNull(),
});

/* EVENTS */
export const eventCategories = pgTable("event_categories", {
	id: varchar("id", { length: 8 }).primaryKey(),
	name: varchar({ length: 255 }).notNull().unique(),
	color: varchar({ length: 255 }).notNull(),
});

export const eventCategoriesRelations = relations(
	eventCategories,
	({ many }) => ({
		eventsToCategories: many(eventsToCategories),
	}),
);

export const events = pgTable("events", {
	id: varchar({ length: 100 }).primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	description: text("description").notNull(),
	thumbnailUrl: varchar("thumbnail_url", { length: 255 })
		.default(c.thumbnails.default)
		.notNull(),
	start: timestamp("start").notNull(),
	end: timestamp("end").notNull(),
	checkinStart: timestamp("checkin_start").notNull(),
	checkinEnd: timestamp("checkin_end").notNull(),
	location: varchar({ length: 255 }).notNull(),
	isUserCheckinable: boolean("is_user_checkinable").notNull().default(true),
	isHidden: boolean("is_hidden").notNull().default(false),
	points: integer("points").notNull().default(1),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	semesterID: integer("semester_id").references(() => semesters.semesterID, {
		onDelete: "set null",
	}),
});

export const eventsRelations = relations(events, ({ many, one }) => ({
	eventsToCategories: many(eventsToCategories),
	checkins: many(checkins),
	semester: one(semesters, {
		fields: [events.semesterID],
		references: [semesters.semesterID],
	}),
}));

export const eventsToCategories = pgTable("events_to_categories", {
	eventID: varchar("event_id", { length: 100 })
		.notNull()
		.references(() => events.id, { onDelete: "cascade" }),
	categoryID: varchar("category_id", { length: 100 })
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
		eventID: varchar("event_id", { length: 100 })
			.references(() => events.id, { onDelete: "cascade" })
			.notNull(),
		userID: integer("user_id")
			.references(() => users.userID, { onDelete: "cascade" })
			.notNull(),
		time: timestamp("time").defaultNow().notNull(),
		rating: integer("rating"),
		adminID: integer("admin_id"),
		feedback: varchar({ length: 2000 }),
	},
	(table) => {
		return [
			{
				id: primaryKey({ columns: [table.eventID, table.userID] }),
			},
		];
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

export const semesters = pgTable("semesters", {
	semesterID: serial("semester_id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull().unique(),
	startDate: timestamp("start_date").notNull(),
	endDate: timestamp("end_date").notNull(),
	pointsRequired: integer("points_required").notNull(),
	isCurrent: boolean("is_current").notNull().default(false),
});

export const semestersRelations = relations(semesters, ({ many }) => ({
	events: many(events),
}));
