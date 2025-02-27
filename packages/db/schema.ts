import {
	text,
	integer,
	sqliteTable,
	primaryKey,
	customType,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import c from "config";

/* USERS */

export const userRoles = customType<{
	data: (typeof c.memberRoles)[number];
	notNull: true;
	default: true;
}>({
	dataType() {
		return "text";
	},
	toDriver(value) {
		return value;
	},
});

export const users = sqliteTable("users", {
	userID: integer("user_id").primaryKey(),
	clerkID: text("clerk_id", { length: 255 }).unique(),
	firstName: text("first_name", { length: 255 }).notNull(),
	lastName: text("last_name", { length: 255 }).notNull(),
	email: text({ length: 255 }).notNull().unique(),
	role: userRoles().default("member").notNull(),
	joinDate: integer("join_date", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(current_timestamp)`),
	universityID: text("university_id", { length: 255 }).notNull().unique(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	data: one(data, { fields: [users.userID], references: [data.userID] }),
	checkins: many(checkins),
}));

export const data = sqliteTable("data", {
	userID: integer("user_id")
		.primaryKey()
		.references(() => users.userID, { onDelete: "cascade" }),
	major: text({ length: 255 }).notNull(),
	classification: text({ length: 255 }).notNull(),
	graduationMonth: integer("graduation_month").notNull(),
	graduationYear: integer("graduation_year").notNull(),
	birthday: integer("birthday", { mode: "timestamp_ms" }),
	gender: text("gender", { mode: "json" }).notNull().$type<string[]>(),
	ethnicity: text("ethnicity", { mode: "json" }).notNull().$type<string[]>(),
	resume: text({ length: 255 }),
	shirtType: text("shirt_type", { length: 255 }).notNull(),
	shirtSize: text("shirt_size", { length: 255 }).notNull(),
	interestedEventTypes: text("interested_event_types", {
		mode: "json",
	})
		.notNull()
		.$type<string[]>(),
});

/* EVENTS */
export const eventCategories = sqliteTable("event_categories", {
	id: text("id", { length: 8 }).primaryKey(),
	name: text({ length: 255 }).notNull().unique(),
	color: text({ length: 255 }).notNull(),
});

export const eventCategoriesRelations = relations(
	eventCategories,
	({ many }) => ({
		eventsToCategories: many(eventsToCategories),
	}),
);

export const events = sqliteTable("events", {
	id: text({ length: 100 }).primaryKey(),
	name: text({ length: 100 }).notNull(),
	description: text("description").notNull(),
	thumbnailUrl: text("thumbnail_url", { length: 255 })
		.default(c.thumbnails.default)
		.notNull(),
	start: integer("start", { mode: "timestamp_ms" }).notNull(),
	end: integer("end", { mode: "timestamp_ms" }).notNull(),
	checkinStart: integer("checkin_start", { mode: "timestamp_ms" }).notNull(),
	checkinEnd: integer("checkin_end", { mode: "timestamp_ms" }).notNull(),
	location: text({ length: 255 }).notNull(),
	isUserCheckinable: integer("is_user_checkinable", { mode: "boolean" })
		.notNull()
		.default(true),
	isHidden: integer("is_hidden", { mode: "boolean" })
		.notNull()
		.default(false),
	points: integer("points").notNull().default(1),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(current_timestamp)`)
		.notNull(),
	updatedAt: integer("updated_at")
		.default(sql`(current_timestamp)`)
		.notNull(),
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

export const eventsToCategories = sqliteTable("events_to_categories", {
	eventID: text("event_id", { length: 100 })
		.notNull()
		.references(() => events.id, { onDelete: "cascade" }),
	categoryID: text("category_id", { length: 100 })
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

export const checkins = sqliteTable(
	"checkins",
	{
		eventID: text("event_id", { length: 100, mode: "text" })
			.references(() => events.id, { onDelete: "cascade" })
			.notNull(),
		userID: integer("user_id")
			.references(() => users.userID, { onDelete: "cascade" })
			.notNull(),
		time: integer("time", { mode: "timestamp_ms" }).defaultNow().notNull(),
		rating: integer("rating"),
		adminID: integer("admin_id"),
		feedback: text({ length: 2000 }),
	},
	(table) => [primaryKey({ columns: [table.userID, table.eventID] })],
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

export const semesters = sqliteTable("semesters", {
	semesterID: integer("semester_id").primaryKey(),
	name: text("name", { length: 255 }).notNull().unique(),
	startDate: integer("start_date", { mode: "timestamp_ms" }).notNull(),
	endDate: integer("end_date", { mode: "timestamp_ms" }).notNull(),
	pointsRequired: integer("points_required").notNull(),
	isCurrent: integer("is_current", { mode: "boolean" })
		.notNull()
		.default(false),
});

export const semestersRelations = relations(semesters, ({ many }) => ({
	events: many(events),
}));
