'use client'
import { useRouter,useSearchParams,usePathname } from "next/navigation"
import { EVENT_FILTERS } from "@/lib/constants/events";
import { Calendar, Grid2X2 } from "lucide-react";
import clsx from "clsx";

export default function ({cardViewSelected}:{cardViewSelected:boolean}){
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();
		const {CALENDAR, CARD} = EVENT_FILTERS;

    const handleFilterChange = (value:string)=>{
        const params = new URLSearchParams(searchParams);
        if (value !== CALENDAR){
            params.delete('view');
            replace(`${pathname}?${params.toString()}`);
            return;
        }
        params.set('view',value);
        replace(`${pathname}?${params.toString()}`);
    }
    return (
		// Toggle for card or calendar view 
		<div className="flex">
			<button
				onClick={() => handleFilterChange(CARD)}
				className={clsx("p-2", {
					"rounded-md border bg-stone-300 bg-opacity-80 ":
						cardViewSelected,
				})}>
				<Grid2X2 />
			</button>
			<button
				onClick={() => handleFilterChange(CALENDAR)}
				className={clsx("p-2", {
					"rounded-md border bg-stone-300 bg-opacity-80 ":
						!cardViewSelected,
				})}>
				<Calendar />
			</button>
		</div>
	);
}