'use client'
import { eventFilters } from "@/app/events/page";
import { Popover,PopoverTrigger,PopoverContent } from "../../ui/popover";
import { Search,ChevronDown } from "lucide-react";
import { Input } from "../../ui/input";
import { useSearchParams,useRouter,usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function EventsSearch({cardViewSelected}:{cardViewSelected:boolean}){
    
    const searchParams = useSearchParams();
    const {replace} = useRouter();
    const pathname = usePathname();    

	// We use a debouncing strategy to prevent the search from querying every single keystroke and instead will run a time after the user completes typing
    const handleSearch = useDebouncedCallback((term) => {
		console.log(`Searching... ${term}`);
		const params = new URLSearchParams(searchParams);
		if (term) {
			params.set("query", term);
		} else {
			params.delete("query");
		}
		replace(`${pathname}?${params.toString()}`);
	}, 200);
    return (
		<>
			{/* Mobile Search bar */}
			{cardViewSelected && (
				<>
					<div className="mr-1 flex items-center justify-center sm:hidden">
						<Popover>
							<PopoverTrigger asChild>
								<div className="flex items-center">
									<Search />
									<ChevronDown size={15} />
								</div>
							</PopoverTrigger>
							<PopoverContent>
								<Input
									type="text"
									placeholder="Search for events"
									defaultValue={searchParams.get(eventFilters.query)?.toString()}
									className="bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
									onChange={(e) =>
										handleSearch(e.target.value)
									}
								/>
							</PopoverContent>
						</Popover>
					</div>
					{/* Desktop Search bar */}
					<div className="hidden w-1/3 items-center justify-start rounded-md ring-black focus-within:ring-1 sm:flex  ">
						<Search className="" />
						<Input
							type="text"
							placeholder="Search for events"
							defaultValue={searchParams.get(eventFilters.query)?.toString()}
							onChange={(e) =>
								handleSearch(e.target.value)
							}
							className="my-0 border-transparent bg-transparent py-0 focus-visible:ring-0 focus-visible:ring-offset-0  "
						/>
					</div>
				</>
			)}
		</>
	);
}