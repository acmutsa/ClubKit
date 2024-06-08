import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { data, users, events, eventsToCategories } from "./schema";
import { z } from "zod";
import c from "config";

export const insertUserDataSchema = createInsertSchema(data);
export const insertUserSchema = createInsertSchema(users);

// Modified For Forms

const userFormified = createInsertSchema(users, {
	email: z.string().email().min(1),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
}).pick({
	email: true,
	firstName: true,
	lastName: true,
});

const userDataFormified = z.object({
	data: createInsertSchema(data, {
		classification: z.string().min(1),
		major: z.string().min(1, "You must select a major."),
		shirtSize: z.string().min(1).max(10),
		shirtType: z.string().min(1).max(10),
		birthday: z.date().optional(),
		// Special Values
		universityID: z.string().min(1).max(c.universityID.maxLength),
		gender: z
			.array(
				z.enum([
					"Male",
					"Female",
					"Non-Binary",
					"Transgender",
					"Intersex",
					"Other",
					"I prefer not to say",
				]),
			)
			.min(1, "Required"),
		ethnicity: z
			.array(
				z.enum([
					"African American or Black",
					"Asian",
					"Native American/Alaskan Native",
					"Native Hawaiian or Pacific Islander",
					"Hispanic / Latinx",
					"White",
				]),
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

const sometable = createInsertSchema(data);

type iType = z.infer<typeof sometable>;

// TODO: tighten insert schema constraints
export const insertEventSchema = createInsertSchema(events);

export const insertEventSchemaFormified = insertEventSchema.merge(
	z.object({ categories: z.string().array(), thumbnailUrl: z.string() }),
);

export const selectEventSchema = createSelectSchema(events);
export type Event = z.infer<typeof selectEventSchema>;
