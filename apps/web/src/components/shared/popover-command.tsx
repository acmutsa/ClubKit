import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";
import { useState } from "react";

interface PopoverCommandProps {
	options: string[] | readonly string[];
	value: string | undefined;
	topic: string;
	onChange: (value: string) => void;
}

export function PopoverCommand({
	options,
	value,
	topic,
	onChange,
}: PopoverCommandProps) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					className={cn(
						"w-full justify-between",
						!value && "text-muted-foreground",
					)}
				>
					{value
						? options.find((option) => option === value)
						: `Select a ${topic}`}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="max-h-[400px] w-[var(--radix-popover-trigger-width)] p-0 no-scrollbar">
				<Command>
					<CommandInput placeholder={`Search ${topic}s...`} />
					<CommandEmpty>No {topic}s found.</CommandEmpty>
					<CommandList>
						<CommandGroup>
							{options.map((option) => {
								return (
									<CommandItem
										value={option}
										key={option}
										onSelect={(v) => {
											onChange(v);
											setOpen(false);
										}}
										className="cursor-pointer"
									>
										<Check
											className={`mr-2 h-4 w-4 overflow-hidden ${
												value &&
												option.toLowerCase() === value
													? "block"
													: "hidden"
											}
											`}
										/>
										{option}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
