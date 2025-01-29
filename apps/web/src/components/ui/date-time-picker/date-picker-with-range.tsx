"use client";

import { addDays, subDays, format, isAfter, isBefore } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerWithRangeProps = {
	start: Date;
	end: Date;
	onRangeChange: (date?: DateRange) => void;
	className?: string;
};

export function DatePickerWithRange(props: DatePickerWithRangeProps) {
	const { start, end, className, onRangeChange } = props;
	const [date, setDate] = useState<DateRange | undefined>({
		from: start,
		to: end,
	});

	const [cnt, setCnt] = useState(0);

	useEffect(() => {
		onRangeChange(date);
	}, [date]);

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-[300px] justify-start text-left font-normal",
							!date && "text-muted-foreground",
						)}
					>
						<CalendarIcon />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={(vals) => {
							onRangeChange(vals);
							// setDate(vals);
						}}
						numberOfMonths={2}
						min={2}
						onDayClick={(day) => {
							const dateRange = {
								from: date?.from ?? start,
								to: date?.to ?? end,
							};
							if (cnt % 2 == 0) {
								setDate({
									from: isAfter(day, dateRange.to)
										? subDays(dateRange.to, 2)
										: day,
									to: dateRange.to,
								});
							} else {
								setDate({
									from: dateRange.from,
									to: isBefore(day, dateRange.from)
										? addDays(dateRange.from, 2)
										: day,
								});
							}
							setCnt((cnt + 1) % 2);
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
