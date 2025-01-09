import { insertUserWithDataSchemaFormified } from "db/zod";
import { z } from "zod";

export const editAccountSettingsSchema = insertUserWithDataSchemaFormified
	.pick({
		firstName: true,
		lastName: true,
	})
	.merge(
		insertUserWithDataSchemaFormified.shape.data.pick({
			birthday: true,
			gender: true,
			ethnicity: true,
		}),
	);

export const editAcademicSettingsSchema =
	insertUserWithDataSchemaFormified.shape.data.pick({
		major: true,
		classification: true,
		graduationMonth: true,
		graduationYear: true,
	});

export const editClubSettingsSchema =
	insertUserWithDataSchemaFormified.shape.data.pick({
		shirtType: true,
		shirtSize: true,
	});

export const editProfilePictureSchema = z.object({
	profilePicture: z.instanceof(File).nullish(),
});

export const editResumeFormSchema = z.object({
	resume: z.instanceof(File).nullish(),
});

export const editResumeActionSchema = z.object({
	resume: z.string(),
	oldResume: z.string().optional(),
});
