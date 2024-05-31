"use client"

import { Select,SelectContent,SelectTrigger,SelectGroup,SelectValue,SelectItem } from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { eventFilters } from "./EventsOptionsBar";


export default function PastPresentDropDown({cardViewSelected,showUpcomingEvents}: {cardViewSelected: boolean,showUpcomingEvents: boolean}){
    const searchParams = useSearchParams();
    
    const pathname = usePathname();
    const {replace} = useRouter();

    // Maybe come back and add a small debounce, but who is clicking checkboxes that fast?
    const handleSelectChange = (value:string)=>{
        const params = new URLSearchParams(searchParams);
        if (value === eventFilters.showUpcomingEvents){
            params.delete(eventFilters.showEvents);
            replace(`${pathname}?${params.toString()}`);
            return;
        }
        params.set(eventFilters.showEvents,value);
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
							<SelectItem value={eventFilters.showUpcomingEvents}>Upcoming</SelectItem>
							<SelectItem value={eventFilters.showPastEvents}>Past</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			)}
		</>
	);
}