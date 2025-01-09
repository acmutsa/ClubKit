import { useState, forwardRef } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type PopoverSelectProps = {
	optionNames?: string[] | readonly string[];
	options: string[] | readonly string[];
	value: string | undefined;
	topic: string;
	onChange: (value: string) => void;
};

export function PopoverSelect({
	options,
	value,
	topic,
	optionNames,
	onChange,
}: PopoverSelectProps) {
	const [open, setOpen] = useState(false);

	return (
		<Select
			onValueChange={onChange}
			open={open}
			onOpenChange={setOpen}
			defaultValue={value}
		>
			<SelectTrigger
				onClick={() => setOpen(!open)}
				onPointerDown={(e) => e.preventDefault()}
			>
				<SelectValue placeholder={topic} />
			</SelectTrigger>
			<SelectContent>
				{options.map((option, idx) => {
					const currentOptionName = optionNames
						? optionNames[idx]
						: option;

					return (
						<SelectItem
							key={option}
							className="cursor-pointer"
							value={option}
						>
							{currentOptionName[0].toUpperCase() +
								currentOptionName.slice(1)}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
}
