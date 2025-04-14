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
	Link,
} from "@react-email/components";
import type * as React from "react";
import c, { emailsConfig } from "config";
import { DefaultFooter, DefaultHeader, baseUrl } from "./shared";

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

						<Section className="pt-5">
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
						<ul className="mt-0 pt-0">
							<li className="mb-20">
								<strong>Learn more about ACM. </strong>
								Check out our{" "}
								<Link href={"https://acmutsa.org"}>
									main website{" "}
								</Link>
								and learn more about our suborgs, officers, and
								mission.
							</li>
							<li className="mb-20">
								<strong>Check out our upcoming events. </strong>
								{`${c.clubName} is always hosting cool events that give you an opportunity to come learn, have snacks, and meet new people so be sure to `}
								<Link href={`${baseUrl}/events`}>
									check out what is happening soon.
								</Link>
							</li>
							<li className="mb-20">
								<strong>Join our discord. </strong>
								We are always chatting and sharing cool stuff
								there. You can also talk with our officers and
								ask any questions you may have.{" "}
								<Link href={`${c.discordLink}`}>
									{" "}
									Click the here to join.
								</Link>
							</li>
						</ul>
						<Section className="mt-10 text-center">
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
