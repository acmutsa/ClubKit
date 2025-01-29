import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { CalendarWithYears } from "@/components/ui/calendarWithYearSelect";
import { Button } from "@/components/ui/button";

interface PopoverCalendarProps<T> {
	date: T;
	onChange: (date: T) => void;
	className?: string;
}

export function PopoverCalendar({
	date,
	onChange,
	className,
}: PopoverCalendarProps<Date | null | undefined>) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						className,
						"text-md items-center pl-3 font-normal",
						!date && "text-muted-foreground",
					)}
				>
					{date ? format(date, "PPP") : <span>Pick a Date</span>}
					<CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<CalendarWithYears
					captionLayout="dropdown-buttons"
					mode="single"
					selected={date ?? undefined}
					onSelect={(value) => onChange(value)}
					disabled={(date) =>
						date > new Date() || date < new Date("1900-01-01")
					}
					fromYear={new Date().getFullYear() - 100}
					toYear={new Date().getFullYear()}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
