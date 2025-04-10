import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import type * as React from "react";
import c, { emailsConfig } from "config";
import { DefaultFooter, DefaultHeader, GetStartedList, baseUrl } from "./shared";


export default function RegistrationConfirmation({
	firstName,
}: {
	firstName: string;
}) {
	return (
		<Html>
			<Head />
			<Tailwind
				config={{
					theme: {
						extend: {
							colors: {
								brand: "#2250f4",
								offwhite: "#fafbfb",
							},
							spacing: {
								0: "0px",
								20: "20px",
								45: "45px",
							},
						},
					},
				}}
			>
				<Preview>{`Welcome to ${c.universityName} ${c.clubName}. Thanks for registering with us and we are
									happy to have you as one of our members. As
									you might know, ACM is always dedicated to
									our members and we want to help you get
									familiar with us and our membership portal.`}</Preview>
				<Body className="bg-offwhite font-sans text-base">
					<DefaultHeader />
					<Container className="p-45 bg-white">
						<Heading className="my-0 text-center leading-8">
							{`Welcome to ${c.universityName} ${c.clubName}`}
						</Heading>

						<Section className="">
							<Row>
								<Text className="text-base">
									{`Hi ${firstName},`}
								</Text>
								<Text className="text-base">
									Thanks for registering with us and we are
									happy to have you as one of our members. As
									you might know, ACM is always dedicated to
									our members and we want to help you get
									familiar with us and our membership portal.
								</Text>
								<Text className="mt-4 text-base">
									Here's how to get started:
								</Text>
							</Row>
						</Section>
						<GetStartedList />
						<Section className="text-center mt-10">
							<Button
								className="bg-brand rounded-lg px-[18px] py-3 text-white"
								href={`${baseUrl}/dash`}
							>
								Go to your dashboard
							</Button>
						</Section>
						
					</Container>
					<DefaultFooter />
				</Body>
			</Tailwind>
		</Html>
	);
}
