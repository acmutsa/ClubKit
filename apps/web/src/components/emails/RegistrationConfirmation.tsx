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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export default function RegistrationConfirmation({ firstName }: { firstName: string }) {
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
				<Preview>{`${c.universityName} ${c.clubName} Welcome`}</Preview>
				<Body className="bg-offwhite font-sans text-base">
					<Img
						src={emailsConfig.publicLogoLink}
						width="100"
						height="100"
						alt="Logo"
						className="mx-auto my-20"
					/>
					<div className="p-45 flex flex-col items-center justify-center bg-white">
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
									happy to have you as one of our members. As you might know, ACM is always dedicated to our members and we want to help you get familiar with us and our membership portal.
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
								{`${c.clubName} is always hosting cool events that give you an opportunity to come learn, have snacks, and meet new people so be sure to `}
								<Link href={`${baseUrl}/events`}>
									check out what is happening soon.
								</Link>
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

						<div className="mt-45 flex w-full flex-wrap items-center justify-center gap-x-4">
							{emailsConfig.footerLinks.map((link) => (
								<div key={link.name}>
									<Link
										className="font-bold text-black underline"
										href={link.href}
									>
										{link.name}
									</Link>{" "}
									<span className="text-green-500">→</span>
								</div>
							))}
						</div>
					</div>

					<Container className="mt-20">
						<Text className="mb-45 text-center text-gray-400">
							{`${emailsConfig.rightsReservedString}`}
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
