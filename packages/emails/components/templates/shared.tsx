import {
	Container,
	Text,
	Img,
	Section,
	Row,
	Link,
	Column,
} from "@react-email/components";
import c, { emailsConfig } from "config";

export default function PlaceHolderShared() {
	<></>;
}

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
function DefaultFooter() {
	return (
		<Container className="mt-20">
			<Text className="mb-45 text-center text-gray-400">
				{`${emailsConfig.rightsReservedString}`}
			</Text>
		</Container>
	);
}

function DefaultHeader() {
	return (
		<Img
			src={emailsConfig.publicLogoLink}
			width="100"
			height="100"
			alt="Logo"
			className="mx-auto my-20"
		/>
	);
}

function GetStartedList() {
	return (
		<ul className="mt-0 pt-0">
			<li className="mb-20">
				<strong>Go update your account information. </strong>
				Things might have changed since you were last here so be sure to{" "}
				<Link href={`${baseUrl}/settings`}>update your settings.</Link>
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
				We are always chatting and sharing cool stuff there. You can
				also talk with our officers and ask any questions you may have.{" "}
				<Link href={`${c.discordLink}`}> Click the here to join.</Link>
			</li>
		</ul>
	);
}

export { DefaultFooter, DefaultHeader, GetStartedList };
