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
import { DefaultFooter, DefaultHeader, RowLinks } from "./shared";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

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
						<ul className="mt-0 pt-0">
							<li className="mb-20">
								<strong>
									Go update your account information.{" "}
								</strong>
								Things might have changed since you were last
								here so be sure to{" "}
								<Link href={`${baseUrl}/settings`}>
									update your settings.
								</Link>
							</li>
							<li className="mb-20">
								<strong>Check out our upcoming events! </strong>
								{`${c.clubName} is always hosting cool events that give you an opportunity to come learn, have snacks, and meet new people so be sure to check out the upcoming `}
								<Link href={`${baseUrl}/events`}>events.</Link>
							</li>
							<li className="mb-20">
								<strong>
									Check out how we bring our websites to life.{" "}
								</strong>
								All of our source code for the things we build
								are open source.{" "}
								<Link href={`${c.sourceCodeLink}`}>
									Stop by our Github for more.
								</Link>
							</li>
						</ul>

						<Section className="text-center">
							<Button
								className="bg-brand rounded-lg px-[18px] py-3 text-white"
								href={`${baseUrl}/dash`}
							>
								Go to your dashboard
							</Button>
						</Section>

						<Section
							className="mt-45"
							style={{
								width: "100%",
								justifyContent: "center",
								alignItems: "center",
								display: "flex",
							}}
						>
							<Row>
								{emailsConfig.footerLinks.map((link) => (
									<Column key={link.name} className="p-4">
										<Link
											className="font-bold text-black underline"
											href={link.href}
										>
											{link.name}
										</Link>{" "}
									</Column>
								))}
							</Row>
						</Section>
					</Container>
					<DefaultFooter />
				</Body>
			</Tailwind>
		</Html>
	);
}
