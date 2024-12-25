import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion"
export default function PortalMigrationExplainer() {
 return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1">
				<AccordionTrigger className="w-full">
					Why Migrate?
				</AccordionTrigger>
				<AccordionContent className="max-w-[90%]">
					If you had a portal account before the swap over to the new
					version, you can migrate your account to the new system.
					This will allow you to keep your account and all of your
					data.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
 );

}