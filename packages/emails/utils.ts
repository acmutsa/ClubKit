import { render } from "@react-email/components";
import { ReactElement } from "react";
import { emailsConfig } from "config";

export interface SendEmailProps {
	to: string | Array<string>;
	subject: string;
	body: string | ReactElement;
	subscribed?: boolean;
	name?: string;
	from?: string;
	reply?: string;
	headers?: Record<string, string>;
}

export async function sendEmail(sendEmailProps: SendEmailProps) {
	if (!emailsConfig.useEmailService) {
		return;
	}
	sendEmailProps.body =
		typeof sendEmailProps.body === "string"
			? sendEmailProps.body
			: await render(sendEmailProps.body);
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.PLUNK_API_KEY}`,
		},
		body: JSON.stringify(sendEmailProps),
	};

	const res = await fetch(`${process.env.PLUNK_BASE_URL}/send`, options);
	if (!res.ok) {
		console.error(res);
		throw new Error("Failed to send email");
	}
}
