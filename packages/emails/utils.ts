import { render } from "@react-email/components";
import { ReactElement } from "react";
import { emailsConfig } from "config";
import Plunk from "@plunk/node";
import { SendParams } from "@plunk/node/dist/types/emails";

const plunk = new Plunk(process.env.PLUNK_API_KEY!, {
	baseUrl: emailsConfig.isSelfHosted
		? process.env.PLUNK_BASE_URL
		: "https://api.useplunk.com/v1/",
});

export interface SendEmailProps extends Omit<SendParams, "body"> {
	body: string | ReactElement;
}

export async function sendEmail(sendEmailProps: SendEmailProps) {
	if (!emailsConfig.useEmailService) {
		return;
	}
	const emailBody =
		typeof sendEmailProps.body === "string"
			? sendEmailProps.body
			: await render(sendEmailProps.body);
	const success = await plunk.emails.send({
		...sendEmailProps,
		body: emailBody,
	});

	if (!success) {
		console.error(success);
		throw new Error("Failed to send email");
	}
}
