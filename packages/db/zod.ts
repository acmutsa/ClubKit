import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { data, users, events, checkins } from "./schema";
import { z } from "zod";
import c from "config";

export const insertUserDataSchema = createInsertSchema(data);
export const insertUserSchema = createInsertSchema(users);

// Modified For Forms
export const basicStringSchema = z.string().min(1).max(255);

const userFormified = createInsertSchema(users, {
	email: z.string().email().min(1),
	firstName: basicStringSchema,
	lastName: basicStringSchema,
}).pick({
	email: true,
	firstName: true,
	lastName: true,
});

const userDataFormified = z.object({
	data: createInsertSchema(data, {
		classification: z.string().min(1, "You must select a classification."),
		major: z.string().min(1, "You must select a major."),
		shirtSize: z.string().min(1).max(10),
		shirtType: z.string().min(1).max(10),
		birthday: z.date().optional(),
		// Special Values
		universityID: z.string().min(1).max(c.universityID.maxLength),
		gender: z
			.array(
				z.enum(c.userIdentityOptions.gender),
			)
			.min(1, "Required"),
		ethnicity: z
			.array(
				z.enum(c.userIdentityOptions.ethnicity),
			)
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
		gender: z.string().array().min(1, "Required"),
		ethnicity: z.string().array().min(1, "Required"),
		interestedEventTypes: z.string().array(),
	}),
});
export type UserWithData = z.infer<typeof selectUserWithDataSchema>;

// TODO: tighten insert schema constraints
export const insertEventSchema = createInsertSchema(events);
export const insertEventSchemaFormified = insertEventSchema
	.merge(
		z.object({
			categories: z
				.string()
				.array()
				.min(1, "You must select one or more categories"),
				points:z.number().min(c.minEventPoints).max(c.maxEventPoints)
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

export const selectCheckinSchema = createSelectSchema(checkins);

export const adminCheckinSchema = z.object({
	universityIDs: z.string().regex(new RegExp(`(\\w+[,\\W]*)+`), {
		message: "Invalid format for ID or list of ID's",
	}),
	eventID: z.string().min(c.events.idLength),
});
export type AdminCheckin = z.infer<typeof adminCheckinSchema>;
export const universityIDSplitter = z
	.string()
	.transform((val) => val.split(/[,\W]+/));

// Current events or events of the week

export const userCheckInSchema = createInsertSchema(checkins);

export const userCheckinSchemaFormified = userCheckInSchema.merge(
	z.object({
		eventID: z.string().min(c.events.idLength),
		feedback: z
			.string()
			.max(c.maxCheckinDescriptionLength, {
				message: `Feedback must be ${c.maxCheckinDescriptionLength} characters or less.`,
			}),
		rating: z
			.number()
			.int()
			.min(1, { message: "Please provide a rating." })
			.max(5,{ message:"Rating must be between 1 and 5." }),
}));
