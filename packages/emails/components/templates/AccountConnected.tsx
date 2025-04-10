import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import type * as React from "react";
import c, { emailsConfig } from "config";
import {
	DefaultFooter,
	DefaultHeader,
	GetStartedList,
	baseUrl,
} from "./shared";

export default function AccountConnected({ firstName }: { firstName: string }) {
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
				<Preview>{`Welcome back to ${c.universityName} ${c.clubName}. Thanks for connecting your account. We are
									glad to have you back with us. Things have
									changed since you were last here. Lots of
									updates and enhancements that we hope you
									will enjoy.`}</Preview>
				<Body className="bg-offwhite font-sans text-base">
					<DefaultHeader />
					<Container className="p-45 bg-white">
						<Heading className="my-0 text-center leading-8">
							{`Welcome back to ${c.universityName} ${c.clubName}`}
						</Heading>

						<Section className="pt-5">
							<Row>
								<Text className="text-base">
									{`Hi ${firstName},`}
								</Text>
								<Text className="text-base">
									Thanks for connecting your account. We are
									glad to have you back with us. Things have
									changed since you were last here. Lots of
									updates and enhancements that we hope you
									will enjoy.
								</Text>
								<Text className="mt-4 text-base">
									Here's how to get started:
								</Text>
							</Row>
						</Section>
						<GetStartedList />
						<Section className="text-center">
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
