"use server";
import { authenticatedAction } from "@/lib/safe-action";
import z from "zod";
import { sendEmail } from "emails/utils";

const emailSchema = z
	.string({
		invalid_type_error: "Email needs to be a string",
		required_error: "Email is required",
	})
	.email({ message: "Invalid email address" })
	.transform((e) => e.toLowerCase());

const emailPropsSchema = z.object({
	subscribed: z
		.boolean({ invalid_type_error: "Subscribed should be a boolean" })
		.optional(),
	from: emailSchema.optional(),
	name: z.string().optional(),
	reply: emailSchema.optional(),
	to: z
		.array(emailSchema)
		.max(5, "You can only send transactional emails to 5 people at a time")
		.or(emailSchema.transform((e) => [e])),
	subject: z.string({
		required_error:
			"Subject is required. Read more: https://docs.useplunk.com/api-reference/transactional/send",
	}),
	body: z.string({
		required_error:
			"Body is required. Read more: https://docs.useplunk.com/api-reference/transactional/send",
	}),
	headers: z.record(z.string()).optional(),
});

export const sendEmailAction = authenticatedAction
	.schema(emailPropsSchema)
	.action(async ({ parsedInput }) => {
		await sendEmail(parsedInput);
	});
