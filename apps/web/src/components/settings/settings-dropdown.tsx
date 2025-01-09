import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";

interface SettingsDropdownProps {
	items: { href: string, title: string }[];
	className?: string;
}

export function SettingsDropdown({ items, className }: SettingsDropdownProps) {
	return (
		<Accordion type="single" className={cn(className)} collapsible>
			<AccordionItem value="menu" className="px-4">
				<AccordionTrigger className="py-2">
					<Settings className="w-6 h-6" />
				</AccordionTrigger>
				<AccordionContent className="space-y-2">
					{items.map(({ title, href }) => (
						<div key={title}>
							<Link href={href} className="text-lg text-right font-bold">{title}</Link>
						</div>
					))}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
