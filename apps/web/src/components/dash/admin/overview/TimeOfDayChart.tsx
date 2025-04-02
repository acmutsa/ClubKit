"use client";

import React from "react";

type TimeSlot = {
	time: string;
	count: number;
};

type Props = {
	activityByTimeOfDay: TimeSlot[];
};

export default function TimeOfDayChart({ activityByTimeOfDay }: Props) {
	// Find the highest count to calculate relative widths
	const maxCount = Math.max(...activityByTimeOfDay.map((slot) => slot.count));

	return (
		<div className="space-y-4">
			{activityByTimeOfDay.map((timeSlot) => (
				<div key={timeSlot.time} className="flex items-center gap-2">
					<div className="w-16 text-xs font-medium">
						{timeSlot.time}
					</div>
					<div className="flex-1">
						<div className="h-3 rounded-full bg-primary/10">
							<div
								className="h-full rounded-full bg-primary"
								style={{
									width: `${(timeSlot.count / maxCount) * 100}%`,
								}}
							></div>
						</div>
					</div>
					<div className="w-9 text-xs font-medium">
						{timeSlot.count}
					</div>
				</div>
			))}
		</div>
	);
}
