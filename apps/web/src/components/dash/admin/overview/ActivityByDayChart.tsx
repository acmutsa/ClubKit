"use client";

import React from "react";
import { CalendarDaysIcon } from "lucide-react";

type DayActivity = {
	day: string;
	count: number;
};

type Props = {
	activityByDayOfWeek: DayActivity[];
	mostActiveDay: string;
};

export default function ActivityByDayChart({
	activityByDayOfWeek,
	mostActiveDay,
}: Props) {
	// Find the highest count to calculate relative heights
	const maxCount = Math.max(...activityByDayOfWeek.map((day) => day.count));

	return (
		<div className="flex flex-col items-center justify-center">
			<CalendarDaysIcon className="mb-2 h-10 w-10 text-primary/80" />
			<div className="text-2xl font-bold">{mostActiveDay}</div>
			<div className="mt-4 grid grid-cols-7 gap-1">
				{activityByDayOfWeek.map((day) => (
					<div key={day.day} className="flex flex-col items-center">
						<div
							className={`h-16 w-4 rounded-sm ${
								day.day === mostActiveDay.substring(0, 3)
									? "bg-primary"
									: "bg-primary/20"
							}`}
							style={{
								height: `${(day.count / maxCount) * 64}px`,
							}}
						></div>
						<div className="mt-1 text-xs font-medium">
							{day.day}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
