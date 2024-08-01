"use client"

import { Select,SelectContent,SelectTrigger,SelectGroup,SelectValue,SelectItem } from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { EVENT_FILTERS } from "@/lib/constants/events";


export default function PastPresentDropDown({cardViewSelected,showUpcomingEvents}: {cardViewSelected: boolean,showUpcomingEvents: boolean}){
    const searchParams = useSearchParams();
    
    const pathname = usePathname();
    const {replace} = useRouter();

		const { SHOW_EVENTS, SHOW_UPCOMING_EVENTS, SHOW_PAST_EVENTS } = EVENT_FILTERS;

    // Maybe come back and add a small debounce, but who is clicking checkboxes that fast?
    const handleSelectChange = (value:string)=>{
        const params = new URLSearchParams(searchParams);
        if (value === SHOW_UPCOMING_EVENTS){
            params.delete(SHOW_EVENTS);
            replace(`${pathname}?${params.toString()}`);
            return;
        }
        params.set(SHOW_EVENTS,value);
        replace(`${pathname}?${params.toString()}`);
    }
    return (
		<>
			{/* Selector for soonest and latest date */}
			{cardViewSelected && (
				<Select
					onValueChange={(value) =>
						handleSelectChange(value)
					}>
					<SelectTrigger className="flex my-auto w-auto justify-start items-center border-transparent bg-transparent py-0 pl-3 pr-0 text-sm focus:ring-0 focus:ring-offset-0 sm:pl-2 md:py-2 md:pl-3">
						<SelectValue
							placeholder={
								showUpcomingEvents ? "Upcoming" : "Past"
							}
							className=" "
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value={SHOW_UPCOMING_EVENTS}>Upcoming</SelectItem>
							<SelectItem value={SHOW_PAST_EVENTS}>Past</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			)}
		</>
	);
}