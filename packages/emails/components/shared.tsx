import { Container, Text, Img } from "@react-email/components"
import { emailsConfig } from "config"

function DefaultFooter(){
  return (
    <Container className="mt-20">
						<Text className="mb-45 text-center text-gray-400">
				{`${emailsConfig.rightsReservedString}`}
		</Text>
		</Container>
  )
}

function DefaultHeader(){
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

export {DefaultFooter, DefaultHeader}