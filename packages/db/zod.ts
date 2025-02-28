import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
	data,
	users,
	events,
	checkins,
	eventCategories,
	semesters,
} from "./schema";
import { string, z } from "zod";
import c, { majors } from "config";

export const insertUserDataSchema = createInsertSchema(data);
export const insertUserSchema = createInsertSchema(users);

// Modified For Forms
export const basicStringSchema = z.string().min(1).max(255);

const userFormified = createInsertSchema(users, {
	email: z.string().email().min(1),
	universityID: z.string().regex(c.universityID.universityIDRegex),
	firstName: basicStringSchema,
	lastName: basicStringSchema,
});

const userDataFormified = z.object({
	data: createInsertSchema(data, {
		classification: z.enum(c.userIdentityOptions.classification),
		major: z.enum(majors),
		shirtSize: z.enum(c.userIdentityOptions.shirtSize),
		shirtType: z.enum(c.userIdentityOptions.shirtType),
		birthday: z.date().optional(),
		// Special Values

		gender: z
			.array(z.enum(c.userIdentityOptions.gender))
			.min(1, "Required"),
		ethnicity: z
			.array(z.enum(c.userIdentityOptions.ethnicity))
			.min(1, "Required"),
		graduationMonth: z
			.number()
			.int()
			.min(1)
			.max(12)
			.or(z.string())
			.pipe(z.coerce.number().min(1).max(12).int()),
		graduationYear: z
			.number()
			.int()
			.min(new Date().getFullYear())
			.max(new Date().getFullYear() + 10)
			.or(z.string())
			.pipe(
				z.coerce
					.number()
					.min(new Date().getFullYear())
					.max(new Date().getFullYear() + 10)
					.int(),
			),
		resume: z.string().url().optional(),
	}).omit({
		interestedEventTypes: true,
		userID: true,
	}),
});

export const insertUserWithDataSchemaFormified =
	userFormified.merge(userDataFormified);

export const selectUserWithDataSchema = z.object({
	user: createSelectSchema(users),
	data: createSelectSchema(data, {
		gender: z.string().array().min(1),
		ethnicity: z.string().array().min(1),
		interestedEventTypes: z.string().array(),
	}),
});

export const deleteEventSchema = z.string().min(c.events.idLength);

export const insertEventSchema = createInsertSchema(events);
export const insertEventSchemaFormified = insertEventSchema
	.extend({
		name: basicStringSchema,
		location: basicStringSchema,
	})
	.merge(
		z.object({
			categories: z
				.string()
				.array()
				.min(1, "You must select one or more categories"),
			points: z.number().min(c.minEventPoints).max(c.maxEventPoints),
		}),
	)
	.omit({ id: true })
	.refine((event) => event.start < event.end, {
		message: "Event start time must be before end",
		path: ["end"],
	})
	.refine((event) => event.checkinStart < event.checkinEnd, {
		message: "Event checkin start time must be before checkin end",
		path: ["checkinEnd"],
	});
export const updateEventSchemaFormified = insertEventSchema
	.merge(
		z.object({
			categories: z.string().min(1).array(),
		}),
	)
	.refine((event) => event.start < event.end, {
		message: "Event start time must be before end",
		path: ["end"],
	})
	.refine((event) => event.checkinStart < event.checkinEnd, {
		message: "Event checkin start time must be before checkin end",
		path: ["checkinEnd"],
	});
export const updateEventSchema = insertEventSchema.merge(
	z.object({
		categories: z.string().min(1).array(),
		oldCategories: z.string().min(1).array(),
		eventID: z.string().min(1),
	}),
);

export const selectEventSchema = createSelectSchema(events);

export const dashEventSchema = z.array(
	z.object({
		id: string(),
		name: string(),
		points: z.number(),
		start: z
			.number()
			.positive()
			.transform((val) => new Date(val)),
	}),
);

export const selectCheckinSchema = createSelectSchema(checkins);

// regex no work rn
export const adminCheckinSchema = z.object({
	universityIDs: z
		.string()
		.regex(
			new RegExp(`(${c.universityID.universityIDRegex.source}[,\\s]*)+`),
			{
				message: "Invalid format for ID or list of ID's",
			},
		),
	eventID: z.string().min(c.events.idLength),
});
export const universityIDSplitter = z
	.string()
	.transform((val) => val.split(/[,\W]+/));

// Current events or events of the week

export const userCheckInSchema = createInsertSchema(checkins);

export const userCheckinSchemaFormified = userCheckInSchema.merge(
	z.object({
		eventID: z.string().min(c.events.idLength),
		feedback: z.string().max(c.maxCheckinDescriptionLength, {
			message: `Feedback must be ${c.maxCheckinDescriptionLength} characters or less.`,
		}),
		rating: z
			.number()
			.int()
			.min(1, { message: "Please provide a rating." })
			.max(5, { message: "Rating must be between 1 and 5." }),
	}),
);

export const eventCategorySchema = createSelectSchema(eventCategories).extend({
	id: z.string().length(c.events.categoryIDLength),
	name: basicStringSchema,
	color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const createEventCategorySchema = eventCategorySchema.omit({ id: true });

export const selectSemesterSchema = createSelectSchema(semesters);

export const createSemesterSchema = createInsertSchema(semesters)
	.extend({
		name: basicStringSchema,
	})
	.refine((val) => val.startDate < val.endDate, {
		message: "Start Date must be before End Date",
	});

export const updateSemesterSchema = createSelectSchema(semesters).refine(
	(val) => val.startDate < val.endDate,
	{
		message: "Start Date must be before End Date",
	},
);

export const toggleCurrentSemesterSchema = z.object({
	semesterID: z.number().int(),
	isCurrent: z.boolean(),
});
