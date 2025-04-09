import {
	Container,
	Text,
	Img,
	Section,
	Row,
	Link,
	Column,
} from "@react-email/components";
import { emailsConfig } from "config";

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

function RowLinks() {
	return (
		<Section className="mt-45 flex w-full items-center justify-center ">
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
	);
}

export { DefaultFooter, DefaultHeader, RowLinks };
