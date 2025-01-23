"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { EventCategoryType } from "@/lib/types/events";
import { EVENT_FILTERS } from "@/lib/constants/events";

export default function CategoryCheckBox({
	category,
	checkBoxSet,
}: {
	category: EventCategoryType;
	checkBoxSet: Set<string>;
}) {
	const { name, color } = category;
	const { CATEGORIES } = EVENT_FILTERS;

	const searchParams = useSearchParams();
	const { replace, refresh } = useRouter();
	const pathname = usePathname();
	const params = new URLSearchParams(searchParams);
	const checkedBoxes = params.get(CATEGORIES);

	const [checked, setCheck] = useState(checkBoxSet.has(name));

	const handleCheck = (name: string) => {
		if (checkedBoxes) {
			if (checkBoxSet.has(name)) {
				checkBoxSet.delete(name);
				if (checkBoxSet.size <= 0) {
					params.delete("categories");
					replace(`${pathname}?${params.toString()}`);
					return;
				}
			} else {
				checkBoxSet.add(name);
			}
			params.set("categories", Array.from(checkBoxSet).join(","));
		} else {
			params.set("categories", name);
		}
		replace(`${pathname}?${params.toString()}`);
		refresh();
	};
	return (
		<div
			className="flex w-full justify-between gap-2"
			onClick={() => {
				setCheck(!checked);
				handleCheck(name);
			}}
		>
			<div className="flex items-center space-x-2">
				<Checkbox
					id={name}
					checked={checked}
					className=" focus-visible:ring-0 focus-visible:ring-offset-0"
				/>
				<label
					htmlFor={name}
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					{name}
				</label>
			</div>
			<div
				className="h-4 w-4 rounded-full"
				style={{ backgroundColor: color }}
			></div>
		</div>
	);
}
